const mysql = require("mysql");
require("dotenv").config();
import util from "util";

// var dbConnection = mysql.createConnection({
//   host: process.env.HOST,
//   user: process.env.USER,
//   password: process.env.PASSWORD,
//   database: process.env.DB
// });
// dbConnection.connect(err => {
//   if (!err) {
//     console.log("database connected!!!");
//   } else {
//     console.log(`Debug me i have errors!!!!! ${err}`);
//   }
// });
// export default dbConnection;
var dbConnection = mysql.createPool({
  connectionLimit: 100,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB
});
dbConnection.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
  }
  if (connection) {
    console.log("database connected!!!");
    connection.release();
  }
  return;
});

dbConnection.query = util.promisify(dbConnection.query);
export default dbConnection;
