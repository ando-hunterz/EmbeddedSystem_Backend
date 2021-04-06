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
const jwtHandler = require("../middleware/jwtHandler");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== "application/octet-stream") {
    req.fileValidationError = "File is Not a CSV File";
    return cb(null, false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Use Cookie & JwtToken Middleware
router.use(dbCookiesHandler);
//router.use(jwtHandler);

// Records Routes

router.get("/records", async (req, res, next) => {
  try {
    var io = req.app.get("socketIo");
    const db_id = process.env.DB_URI + req.cookies.db_id;
    const room_id = req.cookies.db_id;
    const db_connection = mongoose.createConnection(db_id);
    const UserLog = db_connection.model("userLog", userLogSchema);
    const userData = db_connection.model("userData", userDataSchema);
    const userList = await UserLog.find()
      .select("uid temperature status createdAt")
      .populate({
        path: "userData",
        select: "uid name",
      })
      .orFail();
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
    const userData = db_connection.model("userData", userDataSchema);
    const user = await UserLog.findById(userId)
      .select("uid temperature status _id createdAt")
      .populate({
        path: "userData",
        select: "uid name",
      })
      .orFail();
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
      res
        .status(200)
        .send({ message: `Record with id ${userId} has been deleted` });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.patch("/record/:id", async (req, res, next) => {
  try {
    const db_id = process.env.DB_URI + req.cookies.db_id;
    const userId = req.params.id;
    const body = req.body;
    const db_connection = mongoose.createConnection(db_id);
    const UserLog = db_connection.model("userLog", userLogSchema);
    let updateField = null;
    if (body.uid) {
      updateField = `"uid": "${body.uid}"`;
    }
    if (body.temperature) {
      if (updateField)
        updateField = updateField + `,\n"temperature": "${body.temperature}"`;
      else updateField = `"temperature": "${body.temperature}"`;
    }
    updateField = JSON.parse(`{ ${updateField} }`);
    const userUpdated = await UserLog.findOneAndUpdate(
      { _id: userId },
      updateField,
      {
        new: true,
      }
    ).orFail();
    res.status(200).send(userUpdated);
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
router.get("/userData", async (req, res, next) => {
  try {
    const db_id = process.env.DB_URI + req.cookies.db_id;
    const db_connection = mongoose.createConnection(db_id);
    const userData = db_connection.model("userData", userDataSchema);
    const userDataFound = await userData.find().orFail();
    res.status(200).send({ userData: userDataFound });
  } catch (error) {
    next(error);
  }
});

router.post("/userData", upload.single("data"), async (req, res, next) => {
  try {
    const db_id = process.env.DB_URI + req.cookies.db_id;
    const db_connection = mongoose.createConnection(db_id);
    const userData = db_connection.model("userData", userDataSchema);

    console.log(req.file); // form files
    csvtojson()
      .fromFile(req.file.path)
      .then(async (jsonObj) => {
        const user = await userData.find().select("uid");
        const userDataFiltered = jsonObj.filter(
          (elem) => !user.find(({ uid }) => elem.uid === uid)
        );
        if (userDataFiltered.length == 0)
          res
            .status(400)
            .send({ message: "No New UserData found", fields: ["userData"] });
        userData.insertMany(userDataFiltered).then(async (user) => {
          const userDataInserted = await userData.find().orFail();
          res.status(200).send({ userData: userDataInserted });
        });
      });
  } catch (err) {
    next(err);
  }
});
module.exports = router;
