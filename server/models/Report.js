const mongoose = require("mongoose");
mongoose.pluralize(null);

const ReportSchema = new mongoose.Schema({
    staffID: { type: String, required: true },
    reportDescription: { type: String, required: true },
    dateReported: { type: Date, required: true }
});

module.exports = mongoose.model("reports_collection", ReportSchema);
