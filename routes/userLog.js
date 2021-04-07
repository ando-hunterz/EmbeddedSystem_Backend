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
    if (body.status == "Ok") {
      res.status(200).json({ message: "User Submitted", user: savedUserLog });
    } else {
      const io = req.app.get("socketIo");
      console.log(req.params.db_id);
      io.to(req.params.db_id).emit("warning");
      res.status(400).json({
        message: "User Temp is Not OK, Call Satgas Immediately",
        fields: ["Status"],
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
