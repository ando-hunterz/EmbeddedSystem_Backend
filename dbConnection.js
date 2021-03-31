const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("db Connected!");
    },
    (err) => {
      console.log(err);
    }
  );
