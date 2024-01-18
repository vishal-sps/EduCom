const express = require("express");
const { json, urlencoded } = require("express");
const mongoose = require("mongoose");
// const multer = require('multer');
const dotenv = require("dotenv");

const { connectDB } = require("./helper/db");
const  fileUpload =require("express-fileupload");

const userRouter = require("./routes/userRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const heroBannerRouter = require("./routes/heroBannerRoutes");
const trustedCompaniesRouter = require("./routes/trustedCompanyRoutes");


dotenv.config();
const app = express();
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(fileUpload({
  useTempFiles:true
}))

app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/trusted_company", trustedCompaniesRouter)
app.use("/hero", heroBannerRouter)

app.get("/", (req, res)=>{
  res.send("Hello, Welcome to educom - a learning platform like udemy.")
})




const PORT = 8080;

async function startApp() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("error in start", error);
  }
}

startApp();
