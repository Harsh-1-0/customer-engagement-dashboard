import Express from "express";
import configDB from "../config/mongodb.js";
import dotenv from "dotenv";
const app = Express();
import cors from "cors";

import userRouter from "../routes/users.js";
import signupRouter from "../routes/signup.js";
import generateData from "../routes/faker.js";
import userModel from "../model/userModel.js";

dotenv.config();
configDB();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Allowed origins
    credentials: true, // Allows the server to accept cookies or other credentials
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin"], // Allowed headers
    preflightContinue: false, // Pass the CORS preflight response to the next handler
    optionsSuccessStatus: 204, // Status code for successful OPTIONS requests
  })
);
app.use(Express.json());

app.use("/users", userRouter);
app.use("/signup", signupRouter);
app.use("/generate", generateData);

app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

app.get("/fake", async (req, res) => {
  try {
    const response = await userModel.find({});

    res.send(response).status(200);
  } catch (err) {
    console.log(err);
  }
});

app.listen(5500, () => {
  console.log("Server is running on port 5500");
});
