const app = require("./app");
const http = require("http");
const config = require("./utils/config");

const server = http.createServer(app);
const PORT = config.PORT || 3003;

server.listen(config.PORT, () => {
  console.log(`Server running on port http://localhost:${config.PORT}`);
});
