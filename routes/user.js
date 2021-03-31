const express = require("express");
const mongoose = require("mongoose");
const { db } = require("../models/User");
const userLogSchema = require("../models/UserLog");
const router = express.Router();
const dbCookiesHandler = require("../middleware/dbCookiesHandler");
const { Router } = require("express");

// Use Cookie Middleware
router.use(dbCookiesHandler);

// Records Routes

router.get("/record", async (req, res, next) => {
  try {
    const db_id = process.env.DB_URI + req.cookies.db_id;
    const db_connection = mongoose.createConnection(db_id);
    const UserLog = db_connection.model("userLog", userLogSchema);
    const userList = await UserLog.find();
    db_connection.close();
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

module.exports = router;
