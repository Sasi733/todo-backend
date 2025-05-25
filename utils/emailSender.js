// utils/emailSender.js

const nodemailer = require("nodemailer");
require("dotenv").config();

console.log("✅ SMTP_USER:", process.env.SMTP_USER);
console.log("✅ SMTP_PASS:", process.env.SMTP_PASS);
console.log("✅ FROM_EMAIL:", process.env.FROM_EMAIL);



const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // Use TLS for port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Helps with some SMTP issues, but use cautiously in production
  },
});

const sendReminderEmail = async (to, subject, message) => {
  try {
    await transporter.sendMail({
      from: `"Sasi's ToDo App" <${process.env.FROM_EMAIL}>`, // Better formatted
      to,
      subject,
      text: message,
      html: `<p>${message}</p>`, // Helps Gmail understand it's a real message
      replyTo: process.env.FROM_EMAIL,
      headers: {
        'X-Priority': '3',
        'X-Mailer': 'NodeMailer',
        'X-Company': 'Sasi ToDo Reminder'
      },
    });
    console.log(`📩 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email send error:", err.message, err.stack);
    throw err;
  }
};


module.exports = { sendReminderEmail };