const nodemailer = require("nodemailer");
require("dotenv").config;
const { baseURL } = require("../constant/constant");
const transporter = nodemailer.createTransport({
 service:"gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationMail = async (receiverEmail, token) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to: receiverEmail,
    subject: process.env.INVITE_SUBJECT_LINE,
    text: process.env.INVITE_TEXT_LINE,
    html: `Click the link below to register :<br><a href="${baseURL}users/user-role-register?token=${token}">Register Now</a>`,
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendVerificationMail;

//   const url = `${baseURL}/user/verify/${token}`;
