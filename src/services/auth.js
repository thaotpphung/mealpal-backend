const jwt = require('jsonwebtoken');

exports.getToken = (user) => {
  console.log(process.env.JWT_EXPIRES_IN);
  return jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
