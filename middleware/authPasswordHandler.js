const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

module.exports = async function (res, body, user) {
  const validPassword = await bcrypt.compare(body.password, user.password);
  const jwtToken = jwt.sign(
    { user: body.username },
    process.env.JWT_TOKEN_KEY,
    { expiresIn: "1h" }
  );
  return [validPassword, jwtToken];
};
