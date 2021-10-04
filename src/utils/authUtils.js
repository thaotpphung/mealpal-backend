import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
dotenv.config();

const getToken = (user) => {
  return jwt.sign(
    { email: user.email, _id: user._id },
    process.env.JWT_SECRET
    // { expiresIn: "24h" }
  );
};

export { getToken };
