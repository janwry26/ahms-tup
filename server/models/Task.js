const mongoose = require("mongoose");
mongoose.pluralize(null);

const taskSchema = new mongoose.Schema({
    staffID: { type: String, required: true },
    taskDescription: { type: String, required: true },
    taskStatus: { type: String, required: true },
    taskAccomplishDate: { type: Date, required: true },
});

module.exports = mongoose.model("tasks_collection", taskSchema);
