const nodemailer = require('nodemailer');
const log = require('npmlog');
const pug = require('pug');
const htmlToText = require('html-to-text');
const config = require('./../../config');

module.exports = class Email {
  constructor(user) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.from = `MealPal <${config.EMAIL_FROM}>`;
  }

  newTransport() {
    // Sendgrid
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
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      payload,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.htmlToText(html),
    };
    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendCart(cart) {
    await this.send('cart', 'Shopping Cart', cart);
  }

  async sendConfirmationEmail(token) {
    await this.send('confirmEmail', 'Confirm Email at MealPal', token);
  }
};
