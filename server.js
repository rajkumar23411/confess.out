const app = require("./app");
const dotenv = require("dotenv");
const databaseConnection = require("./database/db");

// registering env varilables
dotenv.config({ path: "config/config.env" });

//  database connection
databaseConnection();

// setting up server port
app.listen(process.env.APP_PORT, () => {
  console.log(`Server started on port ${process.env.APP_PORT}`);
});
