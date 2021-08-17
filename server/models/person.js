const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const config = require("../utils/config");
const logger = require("../utils/logger");

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

logger.info("connecting to", { database: config.MONGODB_URI });

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    unique: true,
  },
  number: {
    type: String,
    minlength: 8,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

personSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Person", personSchema);
