const express = require("express");
const mongoose = require("mongoose");
const { db } = require("../models/User");
const userLogSchema = require("../models/UserLog");
const router = express.Router();
let UserLog;

router.post("/:db_id", async (req, res, next) => {
  try {
    const db_id = process.env.DB_URI + req.params.db_id;
    const db_connection = mongoose.createConnection(db_id);
    UserLog = db_connection.model("userLog", userLogSchema);
    const body = req.body;
    const userLog = new UserLog({
      uid: body.uid,
      temperature: body.temperature,
      status: body.status,
    });
    const savedUserLog = await userLog.save();
    db_connection.close();
    res.status(200).json({ message: "User Submitted", user: savedUserLog });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
