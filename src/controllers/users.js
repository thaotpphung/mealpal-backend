import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/users.js';
import { getToken } from '../utils/authUtils.js';

dotenv.config();

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
      .populate('currentPlan')
      .populate('currentWeek')
      .exec();
    if (!user) {
      console.log("user doesn't exists");
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ result: user, token: getToken(user) });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const oldUser = await User.findOne({ email })
      .populate('currentPlan')
      .populate('currentWeek')
      .exec();
    if (oldUser)
      return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      email,
      password: hashedPassword,
      fullName: `${firstName} ${lastName}`,
    });
    res.status(201).json({ result, token: getToken(result) });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
    console.log(error);
  }
};

export const setCurrentWeek = async (req, res) => {
  const { weekId } = req.body;
  const user = await User.findByIdAndUpdate(
    req.userId,
    {
      $set: { currentWeek: weekId },
    },
    { new: true }
  )
    .populate('currentWeek')
    .exec();
  console.log('set current week', user);

  res.status(200).json({ user });
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.userId);
  res.status(200).json({ user });
};
