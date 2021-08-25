import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/users.js";
dotenv.config();

export const signin = async (req, res) => {
  console.log("SIGN IN");
  const { email, password } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      console.log("user doesn't exists");
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordCorrect) {
      console.log("invalid credentials");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { email: oldUser.email, id: oldUser._id },
      process.env.JWT_SECRET,
      // { expiresIn: "24h" }
    );
    res.status(200).json({ result: {...oldUser, currentPlan: '612692ee35f6357e74a0cfa2', currentWeek: '61269701b35fba7eb585b7e6'}, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser)
      return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      email,
      password: hashedPassword,
      fullName: `${firstName} ${lastName}`,
    });
    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(201).json({ result, token });
    console.log("REGISTER SUCCESS", result.email);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

export const setCurrentPlan = async (req, res) => {
  const { planId, weekId } = req.body;
  const { userId } = req;

  await User.findByIdAndUpdate(userId, { $set: { currentPlan: planId, currentWeek: weekId }});

  res.status(200).json({message: "Success"});

}
