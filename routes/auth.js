const mongoose = require("mongoose");
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const authPassword = require("../middleware/authPasswordHandler");

// Register Endpoint
router.post("/register", async (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    db_id: req.body.db_id,
  });
  try {
    const savedUser = await user.save();
    res.status(200).json(savedUser);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

// Login Endpoint
router.post("/login", async (req, res, next) => {
  const body = req.body;
  try {
    const user = await User.findOne({ username: body.username });
    if (user) {
      await authPassword(res, body, user);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
