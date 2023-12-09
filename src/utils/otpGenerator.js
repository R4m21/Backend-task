const nodemailer = require("nodemailer");

// utils/otpGenerator.js
exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendEmailForVarification = (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: process.env.NM_SERVICE,
    auth: {
      user: process.env.NM_AUTH_USER,
      pass: process.env.NM_AUTH_PASS,
    },
  });
  const info = transporter.sendMail({
    from: process.env.NM_AUTH_USER,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Enter <b>${otp}</b> to verify your email address and complete.</p>`,
  });
  return info.messageId;
};
