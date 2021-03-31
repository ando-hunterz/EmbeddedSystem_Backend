const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "required field"],
    validate: {
      validator: async (username) => {
        const usernameCount = await mongoose.models.User.countDocuments({
          username,
        });
        return !usernameCount;
      },
      message: "Username has been taken",
    },
  },
  password: {
    type: String,
    required: [true, "required field"],
    minLength: [6, "Password is to short"],
  },
  db_id: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
