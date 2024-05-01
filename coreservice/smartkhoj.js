require("dotenv").config({ path: __dirname + "/.env" });

const settings = require("./common/settings").Settings;
const databaseModule = require("./database/database");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const appLib = require("applib");
const logger = new appLib.Logger(null, null);
const upload = require("./databasehelper/general").FileUploadConfig;
const path = require("path");
const app = express();

// View Engine Setup
app.set("view engine", ".ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(cors());

app.use(function (_req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));
app.use(upload.array("File"));

startServerProcess(logger);

const middleware = require("./middleware/authenticator");
app.use(middleware.AuthenticateRequest);

const userRoutes = require("./routes/user");
app.use("/api/user", userRoutes);

const vendorRoutes = require("./routes/vendor");
app.use("/api/vendor", vendorRoutes);

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

const paymentRoutes = require("./routes/payments");
app.use("/api/payment", paymentRoutes);

async function startServerProcess(log) {
  try {
    log.logInfo(`StartServerProcess Invoked()`);
    await appLib.fetchDBSettings(log, settings, databaseModule);

    app.listen(process.env.NODE_PORT, () => {
      log.logInfo("server running on port " + process.env.NODE_PORT);
      console.log(process.env.NODE_PORT);
      console.log("server running on port " + process.env.NODE_PORT);
    });
  } catch (errFetchDBSettings) {
    log.logInfo(
      "Error occured in starting node services. Need immediate check."
    );
  }
}
