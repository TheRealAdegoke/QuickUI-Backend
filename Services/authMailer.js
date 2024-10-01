const nodemailer = require("nodemailer");

const sendWelcomeEmail = async (email, fullName) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    secure: true,
  });

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Server is ready to take our messages");
        resolve(success);
      }
    });
  });

  const welcomeMail = `
    <div
      style="
        font-family: Arial, sans-serif;
        max-width: 900px;
        margin: 0 auto;
        background-color: rgb(240,243,244);
        padding: 20px;
      "
    >
      <div style="background-color: white; padding: 15px;">
        <img src="https://res.cloudinary.com/dpyp7innp/image/upload/v1716557009/Quick-logo-white_xutqua.png" style="display: block; width: 150px; margin: 0 auto;" alt="QuickUI Logo">
        <h2 style="color: rgb(68,68,68); margin-top: 10px;">Welcome to QuickUI!</h2>
        <p style="font-size: 16px; color: rgb(128,128,128);">Hello ${fullName},</p>
        <p style="font-size: 16px; color: rgb(68,68,68);">We're excited to have you on board!</p>
        <p style="font-size: 16px; color: rgb(68,68,68);">QuickUI is here to simplify the process of creating stunning web designs. Whether you're an experienced designer or just starting, we've got you covered.</p>
        <p style="font-size: 16px; color: rgb(68,68,68);">Feel free to explore the powerful features and unleash your creativity with QuickUI.</p>
        <p style="font-size: 16px; color: rgb(68,68,68);">Happy designing!</p>
      </div>
    </div>
  `;


  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Welcome To QuickUI",
    html: welcomeMail,
  };
  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
};

const sendResetPasswordLink = async (email, fullName) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    secure: true,
  });

  const resetPasswordLink = `${process.env.CORS_VERCEL_FRONTEND}/resetpassword`;

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Server is ready to take our messages");
        resolve(success);
      }
    });
  });

  const resetMail = `
    <div
      style="
        font-family: Arial, sans-serif;
        max-width: 900px;
        margin: 0 auto;
        background-color: rgb(240,243,244);
        padding: 20px;
      "
    >
      <div style="background-color: white; padding: 15px;">
        <img src="https://res.cloudinary.com/dpyp7innp/image/upload/v1716557009/Quick-logo-white_xutqua.png" style="display: block; width: 150px; margin: 0 auto;" alt="QuickUI Logo">
        <h2 style="color: rgb(68,68,68); margin-top: 10px;">Welcome to QuickUI!</h2>
        <p style="font-size: 16px; color: rgb(128,128,128);">Hello ${fullName},</p>
        <p style="font-size: 16px; color: rgb(128,128,128)">
        To reset your password, please click on the link below: <strong style="color: #007BFF;">${resetPasswordLink}</strong> This link will expire in 1 hour.
      </p>
      <p style="font-size: 16px; color: rgb(68,68,68); font-weight: 600;">
        Best regards,<br /><br />QuickUI Team
      </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Reset Password",
    html: resetMail,
  };

  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
};

module.exports = { sendResetPasswordLink, sendWelcomeEmail };
