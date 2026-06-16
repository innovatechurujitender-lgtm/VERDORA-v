require("dotenv").config();
const nodemailer = require("nodemailer");
const t = nodemailer.createTransport({
  host: process.env.SMTP_HOST, port: parseInt(process.env.SMTP_PORT), secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});
t.sendMail({
  from: '"Verdora" <verdora30@gmail.com>',
  to: "test@example.com",
  subject: "Test",
  text: "Hello"
}).then(() => console.log("SENT OK")).catch(e => console.log("SEND FAIL:", e.message));
