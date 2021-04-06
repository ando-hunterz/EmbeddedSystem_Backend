const mongoose = require("mongoose");

const userDataSchema = mongoose.Schema(
  {
    uid: {
      type: String,
      required: [true, "Uid is Required"],
    },
    name: {
      type: String,
      required: [true, "Name is Required"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true },
  }
);

module.exports = userDataSchema;
