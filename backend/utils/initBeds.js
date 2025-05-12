// utils/initBeds.js
const Bed = require('../models/Bed');

const initializeBeds = async () => {
  try {
    const bedCount = await Bed.countDocuments();
    
    if (bedCount === 0) {
      // Create 20 beds with all required fields
      const beds = Array.from({ length: 20 }, (_, i) => ({
        number: i + 1,
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date(),
        patient: null,
        lastOccupied: null
      }));
      
      await Bed.insertMany(beds);
      console.log('✅ Successfully initialized 20 beds');
    } else {
      // Add any missing beds (1-20) if count is less than 20
      if (bedCount < 20) {
        const existingNumbers = (await Bed.find({}, 'number')).map(b => b.number);
        const missingBeds = [];
        
        for (let i = 1; i <= 20; i++) {
          if (!existingNumbers.includes(i)) {
            missingBeds.push({
              number: i,
              status: 'available',
              createdAt: new Date(),
              updatedAt: new Date(),
              patient: null,
              lastOccupied: null
            });
          }
        }
        
        if (missingBeds.length > 0) {
          await Bed.insertMany(missingBeds);
          console.log(`➕ Added ${missingBeds.length} missing beds`);
        }
      }

      // Reset any beds with invalid status
      await Bed.updateMany(
        { 
          $or: [
            { status: { $exists: false } },
            { status: { $nin: ['available', 'occupied'] } }
          ]
        },
        { 
          status: 'available',
          patient: null,
          updatedAt: new Date() 
        }
      );
      
      // Ensure indexes are synced
      await Bed.syncIndexes();
      console.log('🛏️ Beds collection is ready');
    }
  } catch (error) {
    console.error('❌ Failed to initialize beds:', error);
    throw error;
  }
};

module.exports = initializeBeds;