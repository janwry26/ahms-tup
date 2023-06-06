const express = require("express");
const router = express.Router();
const HealthReport = require("../models/HealthReport");

router.post("/add", async (req, res) => {

    const { animalID, staffID, healthDescription, nextCheckupDate, medication, vaccineStatus  } = req.body;

    const healthReport = new HealthReport({  animalID, staffID, healthDescription, nextCheckupDate, medication, vaccineStatus });
    await healthReport.save()
    .then(() => {
        res.send("Health Report added");
    })
    .catch((err) => {
        res.send(err + "\nFailed to add health report");
    })
});

router.get("/view", async (req, res) => {
    HealthReport.find({ $or: [{ isArchived: { $exists: false } }, { isArchived: false }] })
      .then((items) => res.json(items))
      .catch((err) => res.status(400).json("Error: " + err));
});

router.put("/edit/:id", async (req, res) => {
    HealthReport.findByIdAndUpdate({ _id: req.params.id }, {
        animalID: req.body.animalID, 
        staffID: req.body.staffID, 
        healthDescription: req.body.healthDescription, 
        nextCheckupDate: req.body.nextCheckupDate, 
        medication: req.body.medication, 
        vaccineStatus: req.body.vaccineStatus
    })
    .then(() => {
        res.send("Health Report updated successfully");
    })
    .catch((err) => res.send(err + "\nFailed to update report"));
});

// router.delete('/delete/:id', async (req, res) => {
//     await HealthReport.findByIdAndRemove({ _id: req.params.id})
//         .then((doc) => res.send("Health Report deleted successfully"))
//         .catch((err) => res.send(err + "\nFailed to delete report"));
// });

router.put("/archive/:id", async (req, res) => {
    Task.findByIdAndUpdate({ _id: req.params.id }, {
        isArchived: true
    })
    .then(() => {
        res.send("Health Report archived successfully");
    })
    .catch((err) => res.send(err + "\nFailed to archive Health Report"));
});

router.put("/restore/:id", async (req, res) => {
    Task.findByIdAndUpdate({ _id: req.params.id }, {
        isArchived: false
    })
    .then(() => {
        res.send("Health Report restored successfully");
    })
    .catch((err) => res.send(err + "\nFailed to restore Health Report"));
});


module.exports = router;
