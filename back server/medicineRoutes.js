// medicineRoutes.js

const express = require('express');
const router = express.Router();
const Medicine = require('./medicineDetails'); // Adjust path as necessary

// Fetch official prices of all medicines
router.get('/getOfficialPrices', async (req, res) => {
  try {
    const medicines = await Medicine.find({}, { _id: 0, name: 1, officialPrice: 1 });
    const officialPrices = {};
    medicines.forEach((medicine) => {
      officialPrices[medicine.name] = medicine.officialPrice;
    });
    res.json({ status: 'ok', data: officialPrices });
  } catch (error) {
    console.error('Error fetching official prices:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch official prices' });
  }
});

module.exports = router;
