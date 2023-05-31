const mongoose = require("mongoose");
mongoose.pluralize(null);

const mortalityReportSchema = new mongoose.Schema({
    animalID: { type: String, required: true },
    staffID: { type: String, required: true },
    casueOfDeath: { type: String, required: true },
    deathDate: { type: Date, required: true },
    deathTime: { type: Date, required: true },
    dateReported: { type: Date, required: true },
});

module.exports = mongoose.model("mortality_report", mortalityReportSchema);
