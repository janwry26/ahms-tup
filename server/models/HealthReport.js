const mongoose = require("mongoose");
mongoose.pluralize(null);

const healthReportSchema = new mongoose.Schema({
    animalID: { type: Number, required: true },
    staffID: { type: Number, required: true },
    healthDescription: { type: String, required: true },
    nextCheckupDate: { type: Date, required: true },
    medication: { type: String, required: true },
    vaccineStatus: { type: String, required: true },
    isArchived: { type: Boolean }
});

module.exports = mongoose.model("health_report", healthReportSchema);
