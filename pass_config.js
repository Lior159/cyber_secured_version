const bcrypt = require("bcrypt");
const validator = require("validator");

const passwordRules = {
  pattern:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  length: 10,
  history: 3,
  loginAttempts: 3,
  dictionary: ["1234567890"],
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
    if (password.includes(i)) {
      return "Password is not allowed, it might be too common.";
    }
  }
};

const encryptPassword = async (password) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    console.log(salt);
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

module.exports = {
  passwordRules,
  validatePassword,
  encryptPassword,
  verifyPassword,
};
