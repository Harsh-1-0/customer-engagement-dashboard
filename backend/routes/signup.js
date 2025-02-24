import express from "express";
import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
    });
    await user.save();
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
