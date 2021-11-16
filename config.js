const dotenv = require('dotenv');

dotenv.config();

let NODE_ENV = process.env.NODE_ENV;

let DB_CONNECTION = process.env.MONGODB_LOCAL;
let CLIENT_BASE_URL = process.env.CLIENT_BASE_URL_LOCAL;
let PORT = process.env.PORT || 5000;

let JWT_SECRET = process.env.JWT_SECRET || 'local';
let JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '365d';

let SENDGRID_USERNAME = process.env.SENDGRID_USERNAME_DEVELOP;
let SENDGRID_PASSWORD = process.env.SENDGRID_PASSWORD_DEVELOP;
let EMAIL_FROM = process.env.EMAIL_FROM;

let MAILTRAP_HOST = process.env.MAILTRAP_HOST;
let MAILTRAP_PORT = process.env.MAILTRAP_PORT;
let MAILTRAP_USERNAME = process.env.MAILTRAP_USERNAME;
let MAILTRAP_PASSWORD = process.env.MAILTRAP_PASSWORD;

switch (process.env.NODE_ENV) {
  case 'develop': {
    DB_CONNECTION = process.env.MONGODB_DEVELOP;
    CLIENT_BASE_URL = process.env.CLIENT_BASE_URL_DEVELOP;
    break;
  }
  case 'production': {
    DB_CONNECTION = process.env.MONGODB_PRODUCTION;
    CLIENT_BASE_URL = process.env.CLIENT_BASE_URL_PRODUCTION;
    SENDGRID_USERNAME = process.env.SENDGRID_USERNAME_PRODUCTION;
    SENDGRID_PASSWORD = process.env.SENDGRID_PASSWORD_PRODUCTION;
    break;
  }
  default:
}

module.exports = {
  NODE_ENV,
  DB_CONNECTION,
  CLIENT_BASE_URL,
  PORT,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  SENDGRID_USERNAME,
  SENDGRID_PASSWORD,
  EMAIL_FROM,
  MAILTRAP_HOST,
  MAILTRAP_PASSWORD,
  MAILTRAP_USERNAME,
  MAILTRAP_PORT,
};
