const mongoose = require("mongoose");
mongoose.pluralize(null);

const ReportSchema = new mongoose.Schema({
    staffID: { type: Number, required: true },
    reportDescription: { type: String, required: true },
    dateReported: { type: Date, required: true },
    isArchived: { type: Boolean }
});

module.exports = mongoose.model("reports_collection", ReportSchema);
