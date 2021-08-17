const express = require("express");
const mongoose = require("mongoose");
const app = express();
const personRouter = require("./controllers/person");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");

logger.info("connecting to", { database: config.MONGODB_URI });

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(express.static("build"));
app.use(bodyParser.json());
app.use(cors());
app.use(middleware.requestLogger);

app.use("/api/persons", personRouter);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
