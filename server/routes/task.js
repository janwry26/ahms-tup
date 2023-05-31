const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

router.post("/add", async (req, res) => {

    const { staffID, taskDescription, taskStatus, taskAccomplishDate } = req.body;

    const task = new Task({  staffID, taskDescription, taskStatus, taskAccomplishDate });
    await task.save()
    .then(() => {
        res.send("Task added");
    })
    .catch((err) => {
        res.send(err + "\nFailed to add task");
    })
});

router.get("/view", async (req, res) => {
    Task.find()
        .then((items) => res.json(items))
        .catch((err) => res.status(400).json("Error: " + err));
});

router.put("/edit/:id", async (req, res) => {
    Task.findByIdAndUpdate({ _id: req.params.id }, {
        staffID: req.body.staffID, 
        taskDescription: req.body.taskDescription, 
        taskStatus: req.body.taskStatus, 
        taskAccomplishDate: req.body.taskAccomplishDate
    })
    .then(() => {
        res.send("Task updated successfully");
    })
    .catch((err) => res.send(err + "\nFailed to update task"));
});

router.delete('/delete/:id', async (req, res) => {
    await Task.findByIdAndRemove({ _id: req.params.id})
        .then((doc) => res.send("Task deleted successfully"))
        .catch((err) => res.send(err + "\nFailed to delete task"));
});


module.exports = router;
