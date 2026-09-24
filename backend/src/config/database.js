const mongoose = require("mongoose");

const defaultMongoUri = "mongodb://localhost:27017/order-mgmt";

function getMongoUri() {
  return process.env.MONGODB_URI || defaultMongoUri;
}

async function connectDatabase() {
  await mongoose.connect(getMongoUri());
  return mongoose.connection;
}

async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

module.exports = { connectDatabase, disconnectDatabase, getMongoUri };