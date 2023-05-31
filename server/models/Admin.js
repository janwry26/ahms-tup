const mongoose = require("mongoose");
mongoose.pluralize(null);

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accType: { type: String, required: true }
});

module.exports = mongoose.model("adminAccounts", adminSchema);
