const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  {
    timestamps: true,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true },
  }
);

userLogSchema.virtual("userData", {
  ref: "userData",
  localField: "uid",
  foreignField: "uid",
  justOne: true,
});

module.exports = userLogSchema;
