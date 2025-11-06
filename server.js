const path = require("path");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const feeRoutes = require("./routes/fees");
const classRoutes = require("./routes/classes");
const questionRoutes = require("./routes/questions");
const testRoutes = require("./routes/tests");
const parentRoutes = require("./routes/parents");
const reportRoutes = require("./routes/reports");
const notificationRoutes = require("./routes/notifications");
const materialRoutes = require("./routes/materials");
const dashboardRoutes = require("./routes/dashboard");
const expenseRoutes = require("./routes/expenses");
const quizRoutes = require("./routes/quizzes");
const teacherRoutes = require("./routes/teacher");
const publicRoutes = require("./routes/public");

const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

/** ✅ CORS */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://vikas-frontend.onrender.com"  
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/** ✅ Body parsers */
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

/** ✅ MongoDB connection - IMPROVED */
console.log('🔧 Checking MongoDB configuration...');

// Check both MONGODB_URI and MONGODB_URL
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL;

console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_URL exists:', !!process.env.MONGODB_URL);

if (!MONGODB_URI) {
  console.error('❌ CRITICAL: MongoDB connection string missing!');
  console.log('💡 Please set MONGODB_URI in Render environment variables');
  console.log('📋 Expected format: mongodb+srv://username:password@cluster0.xxx.mongodb.net/database');
  process.exit(1);
}

// Validate connection string format
if (!MONGODB_URI.startsWith('mongodb')) {
  console.error('❌ INVALID MongoDB connection string format!');
  console.log('🔍 Your connection string:', MONGODB_URI);
  console.log('💡 It should start with "mongodb+srv://"');
  process.exit(1);
}

console.log('🔗 Attempting MongoDB connection...');

mongoose.set("strictQuery", false);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log('📊 Database:', mongoose.connection.name);
})
.catch(err => {
  console.error('❌ MongoDB connection FAILED:');
  console.error('Error:', err.message);
  console.log('🔍 Connection string used:', MONGODB_URI.replace(/:[^:]*@/, ':****@')); // Hide password
  process.exit(1);
});

/** ✅ Routes */
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/public", publicRoutes);

// Test route
app.get("/api/health", (req, res) => {
  res.json({
    status: "Server is running!",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString()
  });
});

/** ✅ Error handling */
app.use(notFound);
app.use(errorHandler);

/** ✅ Graceful shutdown */
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await mongoose.connection.close();
  process.exit(0);
});

/** ✅ Start server */
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});
