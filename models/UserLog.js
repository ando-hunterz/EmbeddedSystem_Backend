const mongoose = require("mongoose");

const userLogSchema = mongoose.Schema(
  {
    uid: {
      type: String,
      required: [true, "Uid is Required"],
    },
    temperature: {
      type: String,
      required: [true, "Temperature is Required"],
    },
    status: {
      type: String,
      required: [true, "Status is Required"],
    },
  },
  { timestamps: true }
);

module.exports = userLogSchema;
