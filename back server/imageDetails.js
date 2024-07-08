const mongoose = require("mongoose");

const imageDetailsSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  imagePath: { type: String, required: true },
  operations: [
    {
      type: { type: String },
      result: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

mongoose.model("ImageDetails", imageDetailsSchema);
