const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

  
//IMPORTANT: may need to edit this depending on whether another method is required to get file from the CND
//currently path is used to get file from the 'public' folder in 'api' because we're using multer to allow users to upload to our server
//but we don't want to let users upload to our server in the future. We want to use a CND tool to upload files so this method may need to be changed
const path = require("path");

//IMPORTANT: can delete multer after we incorporate a CDN tool in the future. Multer allows users to upload data files eg images to our server
const multer = require("multer");

dotenv.config()

//make sure there's a .env file with the right URI
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
    });

//IMPORTANT: this is used to get files from the 'public' folder in 'api'. If we're downloading/uploading files to a CND in the future, may not need this line of code as this is used to get files from the 'public/images' folder in 'api'
app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// IMPORTANT: can delete storage after we incorporate a CDN tool in the future. Multer allows users to upload data files eg images to our server 
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, "public/images/post");
    },
    filename: (req,file,cb)=>{
        // in the video was supposed to be able to use 'req.body.name' but there was a type error. So had to change to 'file.originalname'. 
        // Possible issue was that that multer does not populate req.body until after the file handling middleware has run, which is why req.body.name is not defined, causing a type error
        // cb(null, file.originalname);
        const fileName = req.query.name;  // Get the file name from server from the query parameter
        cb(null, fileName);
    }
})
//IMPORTANT: can delete upload after we incorporate a CDN tool in the future. Multer allows users to upload data files eg images to our server 
const upload = multer({storage: storage});
app.post("/api/upload", upload.single("file"), (req, res) =>{
    try {
        return res.status(200).json("file uploaded successfully");
    }catch(err) {
        console.log(err);
    }
})

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(8800,() => {
    console.log("Backend server is running!")
})