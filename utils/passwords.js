const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const fs = require("fs");

const passwordRules = {
  pattern:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  length: 10,
  history: 3,
  loginAttempts: 3,
  dictionary: fs.readFileSync("./dictionary.txt", "utf8").split(/\s+/),
};

const validatePassword = (password, passwordsHistory) => {
  if (password.length < passwordRules.length) {
    return `Invalid length - must be at least 8 characters.`;
  }

  if (passwordsHistory) {
    for (i of passwordsHistory) {
      if (verifyPassword(password, i)) {
        return `Your new password cannot be the same as your previous passwords.`;
      }
    }
  }

  if (!passwordRules.pattern.test(password)) {
    return `Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character`;
  }

  for (i of passwordRules.dictionary) {
    if (password === i) {
      return "Password is not allowed, it might be too common.";
    }
  }
};

const encryptPassword = async (password) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return {
      salt: salt,
      hash: hash,
    };
  } catch (err) {
    console.error("Encryption Failed: ", err.message);
    throw err;
  }
};

const verifyPassword = (plaintextPassword, hash) => {
  try {
    const match = bcrypt.compareSync(plaintextPassword, hash);
    return match;
  } catch (err) {
    console.error("Verification Failed: ", err.message);
    throw err;
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = async ({ uname, to, otp, text }) => {
  try {
    const info = await transporter.sendMail({
      to,
      subject: "Comunication Ltd - Reset Password",
      text: "test",
      html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset OTP</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        color: #333;
                        margin: 0;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding-bottom: 20px;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 24px;
                        color: #4CAF50;
                    }
                    .content {
                        line-height: 1.6;
                    }
                    .otp {
                        display: inline-block;
                        background-color: #e0e0e0;
                        padding: 10px;
                        border-radius: 4px;
                        font-size: 20px;
                        margin: 10px 0;
                    }
                    .reset-link {
                        display: inline-block;
                        background-color: #4CAF50;
                        color: #fff;
                        text-decoration: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        margin-top: 20px;
                    }
                    .footer {
                        text-align: center;
                        padding-top: 20px;
                        color: #777;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset</h1>
                    </div>
                    <div class="content">
                        <p>Hello ${uname},</p>
                        <p>You requested to reset your password. Please use the following OTP to reset your password (available for 10 minutes):</p>
                        <div class="otp">${otp}</div>
                        <p>You can reset your password by clicking the link below:</p>
                        <a href="http://localhost:3000/reset/${uname}" class="reset-link">Reset Password</a>
                    </div>
                    <div class="footer">
                        <p>If you didn't request this, please ignore this email.</p>
                    </div>
                </div>
            </body>
            </html>`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = {
  passwordRules,
  validatePassword,
  encryptPassword,
  verifyPassword,
  sendEmail,
};
