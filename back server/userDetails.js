const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema(
    {
        fname: String,
        lname: String,
        mobile: {type: String, unique: true},
        email: {type: String, unique: true},
        password: String,

  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "ImageDetails" }],
    },
    {
        collection: "UserInfo",
    }
);

mongoose.model("UserInfo", UserDetailsSchema);