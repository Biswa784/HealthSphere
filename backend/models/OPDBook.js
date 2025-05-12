// models/OPDBook.js
const mongoose = require('mongoose');

const OPDBookSchema = new mongoose.Schema({
  patient: {
    firstName: { 
      type: String, 
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: { 
      type: String, 
      required: [true, 'Last name is required'],
      trim: true
    },
    phoneNumber: { 
      type: String, 
      required: [true, 'Phone number is required'],
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    gender: { 
      type: String, 
      required: [true, 'Gender is required'],
      enum: ['male', 'female', 'other']
    }
  },
  symptoms: { 
    type: String, 
    required: [true, 'Symptoms description is required'],
    trim: true
  },
  department: { 
    type: String, 
    required: [true, 'Department is required'],
    trim: true
  },
  doctor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor',
    required: [true, 'Doctor is required']
  },
  appointmentDate: { 
    type: Date, 
    required: [true, 'Appointment date is required']
  },
  bedNumber: { 
    type: Number,
    min: [1, 'Bed number must be at least 1'],
    max: [20, 'Bed number cannot exceed 20']
    
  },
  bed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bed'
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'confirmed', 'cancelled', 'completed']
  },
  documentPath: {
    type: String,
    default: null
  },
  imagePath: {
    type: String,
    default: null
  },
  doctorNotes: {
    type: String,
    default: null
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted appointment date
OPDBookSchema.virtual('formattedDate').get(function() {
  return this.appointmentDate.toLocaleDateString();
});

// Virtual for formatted appointment time
OPDBookSchema.virtual('formattedTime').get(function() {
  return this.appointmentDate.toLocaleTimeString();
});

// Indexes
OPDBookSchema.index({ doctor: 1 });
OPDBookSchema.index({ patientId: 1 });
OPDBookSchema.index({ appointmentDate: 1 });
OPDBookSchema.index({ status: 1 });

// Middleware to handle bed assignment
OPDBookSchema.pre('save', async function(next) {
    if (this.isModified('bedNumber') && this.bedNumber) {
      try {
        const bed = await mongoose.model('Bed').findOneAndUpdate(
          { number: this.bedNumber, status: 'available' }, // ✅ Correct status field
          {
            status: 'occupied',
            patient: this.patientId,
            lastOccupied: new Date(),
            currentBooking: this._id
          },
          { new: true }
        );
  
        if (!bed) {
          throw new Error('Bed not available or does not exist');
        }
  
        this.bed = bed._id;
      } catch (error) {
        return next(error);
      }
    }
    next();
  });
  

// Middleware to release bed when booking is cancelled or completed
OPDBookSchema.post('findOneAndUpdate', async function(doc) {
  if (doc && (doc.status === 'cancelled' || doc.status === 'completed')) {
    await mongoose.model('Bed').findByIdAndUpdate(
      doc.bed,
      { available: true, currentBooking: null }
    );
  }
});

module.exports = mongoose.model('OPDBook', OPDBookSchema);