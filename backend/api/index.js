const app = require("../src/app");
const { connectDatabase } = require("../src/config/database");

let databaseConnection;

module.exports = async function handler(request, response) {
  try {
    databaseConnection ||= connectDatabase();
    await databaseConnection;
    return app(request, response);
  } catch (error) {
    databaseConnection = undefined;
    console.error("Database connection failed:", error.message);
    response.statusCode = 500;
    return response.json({
      error: {
        message: "Database connection failed",
        code: "DATABASE_CONNECTION_ERROR",
      },
    });
  }
};
