
const mongourl = "YOUR MONGO DB CLUSTER LINK"
// insertMedicines.js

const mongoose = require("mongoose");
const Medicine = require("./medicineDetails"); // Ensure this path is correct

// Connect to MongoDB
mongoose.connect("YOUR MONGO DB CLUSTER LINK", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Example data to insert (you can customize this with your own data)
const medicines = [
  /*{ name: "Medical Supply 1", officialPrice: 10 },
  { name: "Medical Supply 2", officialPrice: 50 },
  { name: "Medical Supply 3", officialPrice: 30 },
  { name: "Medical Supply 4", officialPrice: 30 },
  { name: "Medical Supply 5", officialPrice: 60 },
  { name: "Medical Supply 6", officialPrice: 10 },
  { name: "Medical Supply 7", officialPrice: 30 },
  { name: "Medical Supply 8", officialPrice: 5 },
  { name: "Medical Supply 9", officialPrice: 3 },
  { name: "Medical Supply 10", officialPrice: 1 },
  { name: "Medical Supply 11", officialPrice: 12 },*/
  // Add more medicines as needed : commenting previous ones : as they will raise duplicate key
];

// Function to insert medicines
async function insertMedicines() {
  try {
    // Insert all medicines
    await Medicine.insertMany(medicines);
    console.log("Medicines inserted successfully");
  } catch (error) {
    console.error("Error inserting medicines:", error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

// Call the function to insert medicines
insertMedicines();
