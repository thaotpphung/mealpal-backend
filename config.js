const dotenv = require('dotenv');

dotenv.config();

let DB_CONNECTION = '';
let CLIENT_BASE_URL = '';
let PORT = process.env.PORT || 5000;
let JWT_SECRET = process.env.JWT_SECRET || 'test';
let JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '365d';
let SENDGRID_USERNAME = process.env.SENDGRID_USERNAME;
let SENDGRID_PASSWORD = process.env.SENDGRID_PASSWORD;
let EMAIL_FROM = process.env.EMAIL_FROM;

switch (process.env.NODE_ENV) {
  case 'local': {
    DB_CONNECTION = process.env.MONGODB_LOCAL;
    CLIENT_BASE_URL = process.env.CLIENT_BASE_URL_LOCAL;
    break;
  }
  case 'develop': {
    DB_CONNECTION = process.env.MONGODB_DEVELOP;
    CLIENT_BASE_URL = process.env.CLIENT_BASE_URL_DEVELOP;
    break;
  }
  case 'production': {
    DB_CONNECTION = process.env.MONGODB_PRODUCTION;
    CLIENT_BASE_URL = process.env.CLIENT_BASE_URL_PRODUCTION;
    break;
  }
  default:
}

module.exports = {
  DB_CONNECTION,
  CLIENT_BASE_URL,
  PORT,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  SENDGRID_USERNAME,
  SENDGRID_PASSWORD,
  EMAIL_FROM,
};
