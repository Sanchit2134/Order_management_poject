const { MongoMemoryServer } = require("mongodb-memory-server");
const { connectDatabase, disconnectDatabase } = require("../src/config/database");

async function start() {
  const mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.PORT = "5000";
  process.env.STATUS_ADVANCE_INTERVAL_MS = "3600000";

  const app = require("../src/app");
  await connectDatabase();
  const server = app.listen(process.env.PORT);

  const shutdown = async () => {
    server.close();
    await disconnectDatabase();
    await mongoServer.stop();
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});