const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/connectDB");
const app = express();
const PORT = process.env.PORT;

//import routes
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const animalRoutes = require("./routes/animal");
const inventoryRoutes = require("./routes/inventory");
const taskRoutes = require("./routes/task");
const healthReportRoutes = require("./routes/healthReport");
const reportRoutes = require("./routes/report");

app.use(express.json());
app.use(cors());

//define routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/animal", animalRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/health-report", healthReportRoutes);
app.use("/api/report", reportRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});