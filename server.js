import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import signupRoute from "./src/controllers/signup";
import signinRoute from "./src/controllers/signin";
var cloudinary = require("cloudinary").v2;
import teamLeads from "./src/routes/teamLeads";
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  fileUpload({
    useTempFiles: true
  })
);
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

app.use(cors());

app.post("/signup", signupRoute);
app.post("/signin", signinRoute);
app.use("/api", teamLeads);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Started at Port : ${PORT}`);
});

export default app;
