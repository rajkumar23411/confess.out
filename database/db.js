const mongoose = require("mongoose");

const databaseConnection = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`Database connected to ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(`Could not connect to databse ` + err);
    });
};

module.exports = databaseConnection;
