const express = require("express");
const cors = require("cors");

const chatRoutes = require("./routes/chatRoutes");
const agentRoutes = require("./routes/agentRoutes");

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "10mb",
  }),
);

/**
 * HEALTH CHECK
 */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Dev Assistant Backend Running 🚀",
  });
});

/**
 * API ROUTES
 */
app.use("/api/chat", chatRoutes);
app.use("/api/agent", agentRoutes);

/**
 * GLOBAL ERROR HANDLER
 */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(500).json({
    success: false,
    error: "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
