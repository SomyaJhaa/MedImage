const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");

app.use(express.json({ limit: "50mb" })); // Increase JSON payload limit

app.use(express.urlencoded({ limit: "50mb", extended: true })); // Increase URL-encoded payload limit

press = require("express");
const router = express.Router();
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

var nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");
const JWT_SECRET = " USE YOUR OWN SECRET KEY ";

const mongoose = require("mongoose");
const mongourl = "YOUR MONGO DB CLUSTER LINK"


const multer = require("multer");
const path = require("path");

mongoose
    .connect(mongourl, {
    useNewUrlParser: true,
    })
    .then(()=>{
        console.log("Connected to database.");
    })
    .catch((e) => console.log(e));

app.listen(5000, () => {
    console.log("Server Started.");
});

// app fetch, get , post, delete : many methods : i'll use post


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

require("./userDetails");
require("./imageDetails");

const User = mongoose.model("UserInfo");
const Images = mongoose.model("ImageDetails");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/register", async(req,res)=>{
    const{ fname, lname, mobile, email, password} = req.body;
    const encryptedPass = await bcrypt.hash(password, 10);
    try {
        const oldUser = await User.findOne({email});
        if( oldUser){
            return res.json({error: "User Already Exists"});
        }
        await User.create({
            fname,
            lname,
            mobile,
            email,
            password:encryptedPass,
        });
        res.send({status:"OK"});
    } catch (error) {
        res.send({status:"error"});    
    }
});

app.post("/login-user", async(req,res)=>{
    const { email, password} = req.body;

    const user = await User.findOne({email});
    if( !user){
        return res.json({error: "User Not Found"});
    }
    if( await bcrypt.compare(password, user.password)){
        const token = jwt.sign({email:user.email}, JWT_SECRET, {
            expiresIn: 1000,
        });

        if( res.status(201)){
            return res.json({status: "ok", data: token});
        }
        else{
            return res.json({error: "Error"});
        }
    }
    res.json({error:"Invalid password"});
});

app.post("/userData", async(req,res)=>{
    const {token} = req.body;
    try {
        const user = jwt.verify(token, JWT_SECRET, (err, res) => {
            //console.log(err, "error");
            //console.log(res, "result");
            if(err){
                return "Token Expired";
            }
            return res;
        });
        console.log(user);
        if(user === "Token Expired"){
            res.send({status:"error", data: "Token Expired"});
        }
        const useremail = user.email;
        User.findOne({email: useremail })
        .then((data) =>{
            res.send({status:"ok", data: data});
        })
        .catch((error) => {
            res.send({status: "error", data: error});
        });
    } catch (error) {
        res.send({ status: "error", data: error });
    }
});

app.post("/forgot-password", async(req,res) => {
    const{email} = req.body;
    try {
        const oldUser = await User.findOne({email});
        if( !oldUser){
            return res.json( { status: "User Not Exists!" } );
        }
        const secret = JWT_SECRET + oldUser.password;
        const token = jwt.sign({email: oldUser.email, id: oldUser._id}, secret, {
            expiresIn: "5m",
        });
        const link = `https://localhost:5000/reset-password/${oldUser._id}/${token}`;
        console.log(link);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'MAKE YOUR OWN GMAIL FOR THIS',
              pass: 'ENTER THE GOOGLE SHARE PASSKEY ' // if you are unable to do this, tell me I will love to help
            }
          });
          
          var mailOptions = {
            from: 'youremail@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: 'You can reset your password by going through this link' + ' : ' + link
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    } catch (error) {
        
    }
});

app.get("/reset-password/:id/:token", async(req,res) => {
    const { id, token} = req.params;
    console.log(req.params);

    const oldUser = await User.findOne({ _id: id});
    if( !oldUser){
        return res.json( { status: "User Not Exists!" } );
    }
    const secret = JWT_SECRET + oldUser.password;
    try {
        const verify = jwt.verify(token, secret);
        res.render("index", { email: verify.email, status: "Not Verified" });
        //res.send("Verified");
    } catch (error) {
        console.log(error);
        res.send("Not Verified");
    }

    //res.send("Done");
});

app.post("/reset-password/:id/:token", async(req,res) => {
    const { id, token} = req.params;
    const { password} = req.body;
    //console.log(req.params);

    const oldUser = await User.findOne({ _id: id});
    if( !oldUser){
        return res.json( { status: "User Not Exists!" } );
    }
    const secret = JWT_SECRET + oldUser.password;
    try {
        const verify = jwt.verify(token, secret);
        const encryptedPassword = await bcrypt.hash(password, 10);
        await User.updateOne(
            {
                _id: id,
            },
            {
                $set: {
                    password: encryptedPassword,
                },
            }
        );
        res.render("index", { email: verify.email, status:"verified" });
        //res.json({ status: "Password Updated"});
        
        //res.send("Verified");
    } catch (error) {
        console.log(error);
        res.json({ status: "Something Went Wrong" } );
    }

    //res.send("Done");
});

// skipped admin part
  

app.post("/uploadImage", upload.single("image"), async (req, res) => {
    const { token } = req.body;
  
    try {
      const user = jwt.verify(token, JWT_SECRET, (err, res) => {
        if (err) {
          return "Token Expired";
        }
        return res;
      });
      if (user === "Token Expired") {
        return res.json({ status: "error", data: "Token Expired" });
      }
  
      const useremail = user.email;
  
      // Save image details to database (optional)
      const imagePath = req.file.path;
      await Images.create({
        userEmail: useremail,
        imagePath: imagePath,
      });
  
      res.json({ status: "ok", data: imagePath });
    } catch (error) {
      res.json({ status: "error", data: error.message });
    }
  });

  // New endpoint to fetch user's images
app.post("/getUserImages", async (req, res) => {
    const { token } = req.body;
  
    try {
      const user = jwt.verify(token, JWT_SECRET, (err, res) => {
        if (err) {
          return "Token Expired";
        }
        return res;
      });
      if (user === "Token Expired") {
        return res.json({ status: "error", data: "Token Expired" });
      }
  
      const useremail = user.email;
      const images = await Images.find({ userEmail: useremail });
  
      res.json({ status: "ok", data: images });
    } catch (error) {
      res.json({ status: "error", data: error.message });
    }
  });

  app.get("/getImage/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const image = await Images.findById(id);
      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }
  
      res.json({ status: "ok", data: image });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  const { createWorker } = require("tesseract.js");


  app.post("/performOCR/:id", async (req, res) => {
    const { id } = req.params;
    const { extractedText } = req.body;
  
    try {
      const image = await Images.findById(id);
      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }
  
      // Save operation (conversation) log
      const logEntry = {
        operation: "OCR performed",
        timestamp: new Date(),
        extractedText: extractedText,
      };
      image.conversationLogs.push(logEntry);
      await image.save();
  
      res.json({ status: "ok" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/userImages", async (req, res) => {
    const { token } = req.body;
    try {
      const user = jwt.verify(token, JWT_SECRET);
      if (!user) {
        return res.json({ status: "error", data: "Token Expired" });
      }
      const userImages = await Images.find({ email: user.email });
      res.json({ status: "ok", data: userImages });
    } catch (error) {
      res.json({ status: "error", data: error.message });
    }
  });
  
  // Add new endpoint for fetching image details and performing bill analysis
app.post("/getImageDetails", async (req, res) => {
  const { imageId, token } = req.body;

  try {
    const user = jwt.verify(token, JWT_SECRET);
    const image = await Images.findOne({ _id: imageId, email: user.email });

    if (!image) {
      return res.status(404).json({ status: "error", message: "Image not found" });
    }

    const predefinedPrices = { "MedicineA": 10, "MedicineB": 20 }; // Example prices
    const ocrText = image.ocrText;

    let totalExtraCharged = 0;

    // Extract and compare prices from OCR text
    for (const [medicine, price] of Object.entries(predefinedPrices)) {
      const regex = new RegExp(`${medicine}\\s+\\$?(\\d+)`, 'i');
      const match = ocrText.match(regex);
      if (match) {
        const billedPrice = parseFloat(match[1]);
        if (billedPrice > price) {
          totalExtraCharged += (billedPrice - price);
        }
      }
    }

    res.json({ status: "ok", image, totalExtraCharged });
  } catch (error) {
    console.error("Error fetching image details:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

const UserDetails = mongoose.model("UserInfo");
const ImageDetails = mongoose.model("ImageDetails");

app.post("/deleteImage", async (req, res) => {
  const { token, imageId } = req.body;

  try {
    // Verify and decode the token to get the user email
    const user = jwt.verify(token, JWT_SECRET);
    const userEmail = user.email;

    // Remove the image reference from the user's document
    const updatedUser = await UserDetails.findOneAndUpdate(
      { email: userEmail },
      { $pull: { images: imageId } }, // Assuming 'images' is an array of image IDs in UserDetails
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: "error", error: "User not found or image not deleted" });
    }

    // Now delete the image document from the ImageDetails collection
    const deletedImage = await ImageDetails.findByIdAndDelete(imageId);

    if (!deletedImage) {
      return res.status(404).json({ status: "error", error: "Image not found or already deleted" });
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ status: "error", error: "Invalid token or image ID" });
  }
});


// routes/medicineRoutes.js
// app.js
const Medicine = require("./medicineDetails");

// ...

app.get("/getOfficialPrices2", async (req, res) => {
  try {
    const medicines = await Medicine.find({}, { _id: 0, name: 1, officialPrice: 1 });
    const officialPrices = {};
    medicines.forEach((medicine) => {
      officialPrices[medicine.name] = medicine.officialPrice;
    });
    res.json({ status: "ok", data: officialPrices });
  } catch (error) {
    console.error("Error fetching official prices:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch official prices" });
  }
});



// app.js


const bodyParser = require('body-parser');
app.use(bodyParser.json());
const medicineRoutes = require('./medicineRoutes');

// Define routes
app.use('/', medicineRoutes);

// Compare user's medicine costs with official prices
app.post('/compareMedicineCosts', async (req, res) => {
  const { extractedMedicines } = req.body;

  try {
    const results = await Medicine.find({ name: { $in: Object.keys(extractedMedicines) } });
    const comparisonResults = results.map((medicine) => {
      const officialPrice = medicine.officialPrice;
      const userPrice = extractedMedicines[medicine.name];
      const difference = userPrice - officialPrice;
      return {
        name: medicine.name,
        officialPrice,
        userPrice,
        difference
      };
    });
    res.json({ status: 'ok', data: comparisonResults });
  } catch (error) {
    console.error('Error comparing medicine costs:', error);
    res.json({ status: 'error', error: 'Failed to compare with medicine database' });
  }
});





// ...




  

  
  
  
  //module.exports = app;
  
  // Other routes...
  