const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv/config");
require("./dbConnection");

const app = express();

const authRoute = require("./routes/auth");
const userLogRoute = require("./routes/userLog");
const userRoute = require("./routes/user");
const errorHandler = require("./middleware/errorHandler");

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/userLog", userLogRoute);
app.use("/api/user", userRoute);

app.get("/", (req, res) => {
  res.send("this is api endpoint");
});

app.use(errorHandler);

// Listening
app.listen(7070);
