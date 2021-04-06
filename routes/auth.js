const mongoose = require("mongoose");
const router = require("express").Router();
const User = require("../models/User");
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
  console.log(body.username);
  try {
    const user = await User.findOne({ username: body.username }).orFail();
    console.log(user);
    if (user) {
      const validArray = await authPassword(res, body, user);
      if (validArray[0]) {
        res.status(200).json({ db_id: user.db_id, jwtToken: validArray[1] });
      } else {
        res
          .status(400)
          .json({ messages: ["Password Not Valid!"], fields: ["password"] });
      }
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
