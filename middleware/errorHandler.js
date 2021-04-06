//handle email or usename duplicates
const handleDuplicateKeyError = (err, res) => {
  const field = Object.keys(err.keyValue);
  const code = 409;
  const error = `An account with that ${field} already exists.`;
  res.status(code).send({ messages: error, fields: field });
};

//handle field formatting, empty fields, and mismatched passwords
const handleValidationError = (err, res) => {
  let errors = Object.values(err.errors).map((el) => el.message);
  let fields = Object.values(err.errors).map((el) => el.path);
  let code = 400;

  res.status(code).send({ messages: errors, fields: fields });
};

const handleDocumentNotFoundError = (err, res) => {
  let message;
  if (err.query._id || err.query.username) {
    message = `Document with id ${
      err.query._id || err.query.username
    } not found`;
  } else {
    message = `Query not found anything`;
  }
  res.status(400).send({ messages: message, fields: ["query"] });
};

const handleTypeError = (err, req, res) => {
  if (req.fileValidationError) {
    res
      .status(400)
      .send({ messages: req.fileValidationError, fields: ["file"] });
  }
};

const handleCastError = (err, res) => {
  const message = `${err.path} field is not a valid value`;
  res.status(400).send({ message: message, fields: [`${err.path}`] });
};

//error controller function
module.exports = (err, req, res, next) => {
  try {
    console.log("congrats you hit the error middleware");
    if (err.name === "ValidationError")
      return (err = handleValidationError(err, res));
    if (err.code && err.code == 11000)
      return (err = handleDuplicateKeyError(err, res));
    if (err.name == "DocumentNotFoundError")
      return (err = handleDocumentNotFoundError(err, res));
    if (err.name == "CastError") return err == handleCastError(err, res);
    if (err.name == "TypeError") return err == handleTypeError(err, req, res);
  } catch (err) {
    res.status(500).send("An unknown error occured.");
  }
};
