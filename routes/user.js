const express = require("express");
const mongoose = require("mongoose");
const userLogSchema = require("../models/UserLog");
const router = express.Router();
const dbCookiesHandler = require("../middleware/dbCookiesHandler");
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
router.use(jwtHandler);

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
    const userData = db_connection.model("userData", userDataSchema);
    let updateField = null;
    if (body.temperature) {
      updateField = `"temperature": "${body.temperature}"`;
    }
    updateField = JSON.parse(`{ ${updateField} }`);
    const userUpdated = await UserLog.findOneAndUpdate(
      { _id: userId },
      updateField,
      {
        new: true,
      }
    ).orFail();
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
    db_connection.close();
    res.status(200).send(userDataFound);
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
        const user = await userData.find().select("uid name");
        const userDataFiltered = jsonObj.filter(
          (elem) =>
            !user.find(({ uid }) => elem.uid === uid) ||
            !user.find(({ name }) => elem.name === name)
        );

        if (userDataFiltered.length != 0) {
          let userDataFinal = [];
          for (let elem of userDataFiltered) {
            let UserDataUpdated = await userData.findOneAndUpdate(
              { uid: elem.uid },
              { uid: elem.uid, name: elem.name }
            );
            if (!UserDataUpdated) {
              UserDataUpdated = await userData.findOneAndUpdate(
                { name: elem.name },
                { uid: elem.uid, name: elem.name }
              );
            }
            if (!UserDataUpdated) {
              userDataFinal.push({ uid: elem.uid, name: elem.name });
            }
          }
          console.log(userDataFinal);
          userData.insertMany(userDataFinal).then(async (user) => {
            const userDataInserted = await userData.find().orFail();
            db_connection.close();
            res.status(200).send(userDataInserted);
          });
        } else {
          res
            .status(400)
            .send({ message: "No New UserData found", fields: ["userData"] });
        }
      });
  } catch (err) {
    next(err);
  }
});

router.patch("/userData/:id", async (req, res, next) => {
  try {
    const db_id = process.env.DB_URI + req.cookies.db_id;
    const userId = req.params.id;
    const body = req.body;
    const db_connection = mongoose.createConnection(db_id);
    const UserData = db_connection.model("userData", userDataSchema);
    let updateField = null;
    if (body.uid) {
      updateField = `"uid": "${body.uid}"`;
    }
    if (body.name) {
      if (updateField) updateField = updateField + `,\n"name": "${body.name}"`;
      else updateField = `"name": "${body.name}"`;
    }
    updateField = JSON.parse(`{ ${updateField} }`);
    const userUpdated = await UserData.findOneAndUpdate(
      { _id: userId },
      updateField,
      {
        new: true,
      }
    ).orFail();
    db_connection.close();
    res.status(200).send(userUpdated);
  } catch (error) {
    next(error);
  }
});

router.delete("/userData/:id", async (req, res, next) => {
  try {
    const db_id = process.env.DB_URI + req.cookies.db_id;
    const userId = req.params.id;
    const body = req.body;
    const db_connection = mongoose.createConnection(db_id);
    const UserData = db_connection.model("userData", userDataSchema);
    let updateField = null;
    const userDeleted = await UserData.findOneAndRemove({
      _id: userId,
    }).orFail();
    db_connection.close();
    res.status(200).send({ message: `User with id ${userId} deleted` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
