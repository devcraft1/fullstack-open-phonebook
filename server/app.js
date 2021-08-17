const express = require("express");
const mongoose = require("mongoose");
const app = express();
const personRouter = require("./controllers/person");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const config = require("./utils/config");
const logger = require("./utils/logger");

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

morgan.token("body", function (req) {
  return JSON.stringify(req.body);
});

app.use(express.static("build"));
app.use(bodyParser.json());
app.use(cors());

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use("/api/persons", personRouter);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

module.exports = app;
