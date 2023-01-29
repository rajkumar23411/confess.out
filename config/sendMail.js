const nodemiler = require("nodemailer");

const sendMail = async (options) => {
  const transporter = nodemiler.createTransport({
    host: "smtp.gamil.com",
    port: 465,
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
