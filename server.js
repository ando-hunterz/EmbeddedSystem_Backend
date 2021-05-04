const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const socket = require("socket.io");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv/config");
require("./dbConnection");
const path = require('path');

const app = express();

const authRoute = require("./routes/auth");
const userLogRoute = require("./routes/userLog");
const userRoute = require("./routes/user");
const errorHandler = require("./middleware/errorHandler");

app.use(cors({ credentials: true, origin: "https://smartsani.herokuapp.com/" }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/userLog", userLogRoute);
app.use("/api/user", userRoute);
app.use(express.static(path.join(__dirname, 'public')));


app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

//app.use(errorHandler);

const server = app.listen(process.env.PORT ||7070);

const io = socket(server, {
    cors: {
      origin: 'https://smartsani.herokuapp.com/'
    }
  });

app.set("socketIo", io);

// Listening
