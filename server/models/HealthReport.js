const mongoose = require("mongoose");
mongoose.pluralize(null);

const healthReportSchema = new mongoose.Schema({
    animalID: { type: Number, required: true },
    staffID: { type: Number, required: true },
    nickname: { type: String, required: true },
    enclosure: { type: String, required: true },
    dateObserved: { type: Date, required: true },
    age: { type: String, required: true },
    veterinarian: { type: String, required: true },
    medication: { type: [String, null], required: true },
    healthDescription: { type: String, required: true },
    nextCheckupDate: { type: String, required: true },
    vaccineStatus: { type: String, required: true },
    animalHealth: { type: String, required: true },

    isArchived: { type: Boolean }
});

module.exports = mongoose.model("health_report", healthReportSchema);
