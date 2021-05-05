const jwt = require("jsonwebtoken");

module.exports = function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null)
    return res
      .sendStatus(401)
      .json({ messages: ["No Jwt Token Supplied"], fields: ["jwtToken"] }); // if there isn't any token
  jwt.verify(token, process.env.JWT_TOKEN_KEY, (err, user) => {
    if (err)
      return res
        .sendStatus(403)
        .json({ messages: ["JwtToken Expired!"], fields: ["jwtToken"] });
    next(); // pass the execution off to whatever request the client intended
  });
};
