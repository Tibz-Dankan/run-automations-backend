const path = require("path");
const ejs = require("ejs");
const SGmail = require("@sendgrid/mail");

export class Email {
  from: string;
  recipients: string;
  subject: string;
  constructor(recipients: string, subject: string) {
    SGmail.setApiKey(process.env.SEND_GRID_API_KEY);

    this.from = "cryptopile20@gmail.com";
    this.recipients = recipients;
    this.subject = subject;
  }

  async sendHtml(html: any, subject: string) {
    const mailOptions = {
      to: this.recipients,
      from: { email: this.from, name: "Run Automation" },
      subject: subject,
      html: html,
    };
    try {
      console.log("sending mail");
      await SGmail.send(mailOptions);
      console.log("mail sent");
    } catch (error) {
      console.log("error sending email", error);
    }
  }

  async sendWelcome(username: string) {
    const html = await ejs.renderFile(
      path.join(__dirname, "../views/email/welcome.ejs"),
      {
        subject: this.subject,
        userName: username,
      }
    );
    await this.sendHtml(html, "Welcome to LetsChat ");
  }

  async sendPasswordReset(url: string, username: any) {
    console.log("Password reset url: ", url);

    const html = await ejs.renderFile(
      path.join(__dirname, "../views/email/reset-password.ejs"),
      {
        subject: "Password Reset",
        userName: username,
        resetURL: url,
      }
    );
    await this.sendHtml(html, "Reset Password");
  }

  async sendContactUs(
    name: string,
    message: string,
    email: string,
    subject: string
  ) {
    const html = await ejs.renderFile(
      path.join(__dirname, "../views/email/contact.ejs"),
      {
        subject: "Contact Us Message",
        name: name,
        message: message,
        email: email,
        contactSubject: subject,
      }
    );
    await this.sendHtml(html, "Reset Password");
  }
}
