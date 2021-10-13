const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
dotenv.config();

exports.getToken = (user) => {
  return jwt.sign(
    { email: user.email, _id: user._id },
    process.env.JWT_SECRET
    // { expiresIn: "24h" }
  );
};
