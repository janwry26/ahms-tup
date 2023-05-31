const mongoose = require("mongoose");
mongoose.pluralize(null);

const userSchema = new mongoose.Schema({
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNum: { type: String },
    username: { type: String, required: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model("userAccounts", userSchema);
