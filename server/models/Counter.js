const mongoose = require("mongoose");
mongoose.pluralize(null);

const counterSchema = new mongoose.Schema({
    model: { type: String, required: true },
    field: { type: String, required: true },
    count: { type: Number, default: 0 },
});


module.exports = mongoose.model("counter_collection", counterSchema);
