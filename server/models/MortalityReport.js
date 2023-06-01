const mongoose = require("mongoose");
mongoose.pluralize(null);

const mortalityReportSchema = new mongoose.Schema({
    animalID: { type: Number, required: true },
    staffID: { type: Number, required: true },
    casueOfDeath: { type: String, required: true },
    deathDate: { type: Date, required: true },
    deathTime: { type: String, required: true },
    dateReported: { type: Date, required: true },
});

module.exports = mongoose.model("mortality_report", mortalityReportSchema);
