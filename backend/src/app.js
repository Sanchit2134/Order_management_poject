const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const { connectDatabase } = require("./config/database");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/orders");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const port = process.env.PORT || 5000;

dotenv.config();
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.use(express.json());
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use(errorHandler);
if (require.main === module)
  connectDatabase()
    .then(() => {
      const server = app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
        console.log("MongoDB connected");
      });
      server.on("error", (err) => {
        console.error("Failed to start server:", err.message || err);
        process.exit(1);
      });
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message || err);
      process.exit(1);
    });
module.exports = app;
