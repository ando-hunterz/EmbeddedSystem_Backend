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
    const errorMsg = error.message.split(',')
    const errorMsg1 = errorMsg[0].split(':')[2]
    const errorMsg2 = errorMsg[1].split(':')[1]

    res.status(400).json({messages: errorMsg1 + errorMsg2})
    res.status(400).json({messages: error.message})
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
          .json({ messages: "Invalid Password", fields: ["password"] });
      }
    }
  } catch (err) {
    res
      .status(400)
      .json({ messages: "User not found", fields: ["username"] });
    console.log(err);
    next(err);
  }
});

module.exports = router;
