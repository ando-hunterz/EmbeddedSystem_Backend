module.exports = function (req, res, next) {
  if (!req.cookies.db_id) {
    res
      .status(403)
      .send({ messages: ["DB Cookies not found!"], fields: ["Cookies"] });
  }
  next();
};
