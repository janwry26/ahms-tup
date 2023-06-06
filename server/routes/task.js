const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

router.post("/add", async (req, res) => {

    const { taskName, staffID, taskDescription, taskDueDate, taskStatus, taskAccomplishDate } = req.body;

    const task = new Task({ taskName, staffID, taskDescription, taskDueDate, taskStatus, taskAccomplishDate });
    await task.save()
    .then(() => {
        res.send("Task added");
    })
    .catch((err) => {
        res.send(err + "\nFailed to add task");
    })
});

router.get("/view", async (req, res) => {
    Task.find({ $or: [{ isArchived: { $exists: false } }, { isArchived: false }] })
      .then((items) => res.json(items))
      .catch((err) => res.status(400).json("Error: " + err));
});

router.get("/view-user/:staffID", async (req, res) => {
    const { staffID } = req.params;
  
    Task.find({staffID: staffID, $or: [{ isArchived: { $exists: false } }, { isArchived: false }]})
        .then((items) => res.json(items))
        .catch((err) => res.status(400).json("Error: " + err));
  });
  

router.put("/edit/:id", async (req, res) => {
    Task.findByIdAndUpdate({ _id: req.params.id }, {
        taskName: req.body.taskName,
        staffID: req.body.staffID, 
        taskDescription: req.body.taskDescription,
        taskDueDate: req.body.taskDueDate,
        taskStatus: req.body.taskStatus, 
        taskAccomplishDate: req.body.taskAccomplishDate
    })
    .then(() => {
        res.send("Task updated successfully");
    })
    .catch((err) => res.send(err + "\nFailed to update task"));
});

router.put("/edit-status/:id", async (req, res) => {
    const currentDate = new Date();
    Task.findByIdAndUpdate({ _id: req.params.id }, {
        taskStatus: req.body.taskStatus,
        taskAccomplishDate: currentDate
    })
    .then(() => {
        res.send("Task updated successfully");
    })
    .catch((err) => res.send(err + "\nFailed to update task"));
});

router.put("/overdue/:userId", async (req, res) => {
    const { userId } = req.params;
    const currentDate = new Date();
  
    Task.updateMany(
      { staffID: userId, taskDueDate: { $lt: currentDate }, taskStatus: { $ne: "Completed" } },
      {
        taskStatus: "Overdue",
      }
    )
      .then(() => {
        res.send("Tasks updated successfully");
      })
      .catch((err) => res.send(err + "\nFailed to update tasks"));
  });
     

router.put("/archive/:id", async (req, res) => {
    Task.findByIdAndUpdate({ _id: req.params.id }, {
        isArchived: true
    })
    .then(() => {
        res.send("Task archived successfully");
    })
    .catch((err) => res.send(err + "\nFailed to archive task"));
});

router.put("/restore/:id", async (req, res) => {
    Task.findByIdAndUpdate({ _id: req.params.id }, {
        isArchived: false
    })
    .then(() => {
        res.send("Task restored successfully");
    })
    .catch((err) => res.send(err + "\nFailed to restore task"));
});

router.delete('/delete/:id', async (req, res) => {
    await Task.findByIdAndRemove({ _id: req.params.id})
        .then((doc) => res.send("Task deleted successfully"))
        .catch((err) => res.send(err + "\nFailed to delete task"));
});


module.exports = router;
