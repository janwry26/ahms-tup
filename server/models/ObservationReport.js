const mongoose = require("mongoose");
mongoose.pluralize(null);

const observationReportSchema = new mongoose.Schema({
    animalID: { type: Number, required: true },
    staffID: { type: Number, required: true },
    reportDescription: { type: String, required: true },
    dateReported: { type: Date, required: true },
});

module.exports = mongoose.model("observation_report", observationReportSchema);
