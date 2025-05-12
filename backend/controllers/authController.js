const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const SuperAdmin = require('../models/SuperAdmin');
const Hospital = require('../models/Hospital');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debugging

    const { firstName, lastName, email, password, phoneNumber, role, ...extraFields } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      role,
    });

    await user.save();
    console.log("User Created:", user);

    // Create role-specific document
    let roleSpecificDoc;
    switch (role) {
      case "doctor":
        roleSpecificDoc = new Doctor({ user: user._id, email, ...extraFields });
        break;
      case "patient":
        roleSpecificDoc = new Patient({ user: user._id, email, ...extraFields });
        break;
      case "superadmin":
        roleSpecificDoc = new SuperAdmin({ user: user._id, email, ...extraFields });
        break;
      case "hospital":
        roleSpecificDoc = new Hospital({ user: user._id, email, ...extraFields });
        break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }

    await roleSpecificDoc.save();
    console.log("Role-Specific Document Created:", roleSpecificDoc);

    // Return success response
    res.status(201).json({ message: "Registration successful", user });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};
// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Fetch role-specific data
    let roleData;
    switch (user.role) {
      case 'doctor':
        roleData = await Doctor.findOne({ user: user._id });
        break;
      case 'patient':
        roleData = await Patient.findOne({ user: user._id });
        break;
      case 'superadmin':
        roleData = await SuperAdmin.findOne({ user: user._id });
        break;
      case 'hospital':
        roleData = await Hospital.findOne({ user: user._id });
        break;
      default:
        throw new Error('Invalid role');
    }

    res.json({ token, user: { ...user.toObject(), ...roleData.toObject() } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};
// Fetch authenticated user's profile
exports.getUserProfile = async (req, res) => {
  try {
    // The user ID is attached to the request by the `protect` middleware
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};