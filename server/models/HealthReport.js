const mongoose = require("mongoose");
mongoose.pluralize(null);

const healthReportSchema = new mongoose.Schema({
    animalID: { type: String, required: true },
    staffID: { type: String, required: true },
    healthDescription: { type: String, required: true },
    nextCheckupDate: { type: Date, required: true },
    medication: { type: String, required: true },
    vaccineStatus: { type: String, required: true },
});

module.exports = mongoose.model("health_report", healthReportSchema);
