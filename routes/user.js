const express = require("express");
const mongoose = require("mongoose");
const { db } = require("../models/User");
const userLogSchema = require("../models/UserLog");
const router = express.Router();
const dbCookiesHandler = require("../middleware/dbCookiesHandler");
const { Router } = require("express");
const multer = require("multer");
const csvtojson = require("csvtojson");
const userDataSchema = require("../models/UserData");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Use Cookie Middleware
router.use(dbCookiesHandler);

// Records Routes

router.get("/records", async (req, res, next) => {
  try {
    var io = req.app.get("socketIo");
    const db_id = process.env.DB_URI + req.cookies.db_id;
    const room_id = req.cookies.db_id;
    const db_connection = mongoose.createConnection(db_id);
    const UserLog = db_connection.model("userLog", userLogSchema);
    const userData = db_connection.model("userData", userDataSchema);
    const userList = await UserLog.find().populate({
      path: "userData",
      select: "uid name",
    });
    db_connection.close();
    io.on("connection", (socket) => {
      console.log("socket id = " + socket.id);

      socket.join(room_id);
    });
    console.log(`room id = ${room_id}`);
    res.status(200).send(userList);
  } catch (error) {
    next(error);
  }
});

router.get("/record/:id", async (req, res, next) => {
  try {
    const db_id = process.env.DB_URI + req.cookies.db_id;
    const userId = req.params.id;
    const db_connection = mongoose.createConnection(db_id);
    const UserLog = db_connection.model("userLog", userLogSchema);
    const user = await UserLog.findById(userId).orFail();
    db_connection.close();
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

router.delete("/record/:id", async (req, res, next) => {
  try {
    const db_id = process.env.DB_URI + req.cookies.db_id;
    const userId = req.params.id;
    const db_connection = mongoose.createConnection(db_id);
    const UserLog = db_connection.model("userLog", userLogSchema);
    const deletedUser = await UserLog.deleteOne({ _id: userId }).orFail();
    db_connection.close();
    if (deletedUser.deletedCount == 1)
      res.status(200).send(`Record with id ${userId} has been deleted`);
  } catch (error) {
    next(error);
  }
});

// Search By Name
router.get("/search/:name", async (req, res, next) => {
  const name = req.params.name;
  res.status(200).send("params name: " + name);
});

// Post User Data for UID
router.post("/userData", upload.single("data"), async (req, res, next) => {
  try {
    const db_id = process.env.DB_URI + req.cookies.db_id;
    const db_connection = mongoose.createConnection(db_id);
    const userData = db_connection.model("userData", userDataSchema);
    console.log(req.file); // form files
    csvtojson()
      .fromFile(req.file.path)
      .then((jsonObj) => {
        userData.insertMany(jsonObj).then((user) => {
          console.log(user);
          db_connection.close();
        });
      });
    res.status(204).end();
  } catch (error) {}
});
module.exports = router;
