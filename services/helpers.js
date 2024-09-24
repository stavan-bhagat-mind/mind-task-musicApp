const bcrypt = require("bcrypt");
const { salt } = require("../constant/constant");

const hashConvert = async (plainPassword) => {
  return new Promise((resolve, reject) => {
    try {
      bcrypt.hash(plainPassword, salt, function (err, hash) {
        if (err) throw err;
        resolve(hash);
        reject(err);
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  hashConvert,
};
