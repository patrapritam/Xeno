const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

const tenantRoutes = require('./routes/tenantRoutes');
const ingestionRoutes = require('./routes/ingestionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
// const tenantMiddleware = require('./middleware/tenantMiddleware'); // We'll apply this to protected routes later

app.use(cors());
app.use(express.json());

app.use('/api/tenants', tenantRoutes);
app.use('/api/ingest', ingestionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Start Server
// Start Server only if not in production (Vercel handles this automatically)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;

// Graceful Shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
