const nodemailer = require('nodemailer');
const log = require('npmlog');
const pug = require('pug');
const htmlToText = require('html-to-text');
const config = require('./../../config');
const juice = require('juice');

module.exports = class Email {
  constructor(user) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.from = `MealPal <${config.EMAIL_FROM}>`;
  }

  newTransport() {
    if (config.NODE_ENV === 'local') {
      return nodemailer.createTransport({
        host: config.MAILTRAP_HOST,
        port: config.MAILTRAP_PORT,
        auth: {
          user: config.MAILTRAP_USERNAME,
          pass: config.MAILTRAP_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: config.SENDGRID_USERNAME,
        pass: config.SENDGRID_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject, payload = {}) {
    // 1) Render HTML based on a pug template
    let html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      payload,
      subject,
    });
    html = juice(html, { removeStyleTags: true, preserveMediaQueries: true });
    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.htmlToText(html),
    };
    // 3) Create a transport and send email
    try {
      await this.newTransport().sendMail(mailOptions);
      return 'success';
    } catch (err) {
      log.error('Error Sending Email', err);
      return err;
    }
  }

  async sendCart(cart) {
    return this.send('cart', 'MealPal Shopping Cart', cart);
  }

  async sendConfirmationEmail(url) {
    return this.send('confirmEmail', 'Email Confirmation', url);
  }

  async sendResetPasswordEmail(url) {
    return this.send('resetPassword', 'Password Reset', url);
  }
};
