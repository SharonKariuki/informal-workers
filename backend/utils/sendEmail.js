const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, message, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    text: message,
    html
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('✅ Email sent:', info.response);
};

module.exports = sendEmail;
