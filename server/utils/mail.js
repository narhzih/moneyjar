const nodemailer = require("nodemailer");

class Mail {
  constructor(user) {
    this.user = user;
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendResetToken(token) {
    await this.transporter.sendMail({
      from: "Moneyjar Inc",
      to: this.user.email,
      subject: "Password reset token email",
      text: `Here is your password reset token :  ${token}`,
    });
  }
  sendWelcomeMail() {}
  send(options) {}
}

module.exports = Mail;
