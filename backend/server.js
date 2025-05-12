require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require('multer');


// Route imports
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const opdRoutes = require('./routes/opdRoutes');
const bedRoutes = require('./routes/bedRoutes');




const initializeBeds = require('./utils/initBeds');


const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000", // or your actual frontend URL
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    },
    path: "/socket.io" // optional, but good for clarity
  });
  

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/opd_booking";

// Debugging
console.log("MongoDB URI:", MONGO_URI);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Attach io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Database Connection and Initialization
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
.then(async () => {
  console.log("✅ Connected to MongoDB");
  
  // Initialize beds after successful connection
  try {
    await initializeBeds();
    console.log("🛏️ Bed initialization complete");
  } catch (err) {
    console.error("❌ Bed initialization failed:", err);
    process.exit(1);
  }
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// Routes - Mount each router with its specific prefix
// Before other routes
app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));
app.get("/", (req, res) => res.send("Server Started"));
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/beds", bedRoutes);
app.use('/api/opdbooks', opdRoutes); // This mounts all opdRoutes under /api/opd
app.use('/api/opdbook', opdRoutes);


// Socket.IO
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("newAppointment", (appointment) => {
    io.to(`doctor-${appointment.doctor}`).emit("newAppointment", appointment);
  });

  socket.on("joinDoctorRoom", (doctorId) => {
    socket.join(`doctor-${doctorId}`);
    console.log(`Doctor ${doctorId} joined their room`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      success: false,
      message: 'File upload error',
      error: err.message 
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid token' 
    });
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: err.message
    });
  }

  res.status(500).json({ 
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});