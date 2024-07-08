// medicineDetails.js

const mongoose = require("mongoose");

const MedicineDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  officialPrice: { type: Number, required: true },
});

const Medicine = mongoose.model("Medicine", MedicineDetailsSchema);

module.exports = Medicine;
