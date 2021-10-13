const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const isCustomAuth = token.length < 500; // if > 500 -> Google auth

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token.toString(), process.env.JWT_SECRET);
      req.userId = decodedData._id;
    } else {
      // Google auth
      // check if token in request is correct
      decodedData = jwt.decode(token);
      req.userId = decodedData.sub;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

// is admin

// is moderator
