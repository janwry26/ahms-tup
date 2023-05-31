const mongoose = require("mongoose");
mongoose.pluralize(null);

const taskSchema = new mongoose.Schema({
    taskName:{type:String,required:true},
    staffID: { type: String, required: true },
    taskDescription: { type: String, required: true },
    taskDueDate: { type: Date, required: true},
    taskStatus: { type: String, required: true },
    taskAccomplishDate: { type: Date, required: true },
});

module.exports = mongoose.model("tasks_collection", taskSchema);
