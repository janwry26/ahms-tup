const express = require("express");
const router = express.Router();
const HealthReport = require("../models/HealthReport");

router.post("/add", async (req, res) => {

    const { animalID, staffID,enclosure,dateObserved, age,nickname, healthDescription, nextCheckupDate, medication, vaccineStatus,veterinarian,animalHealth,  } = req.body;

    const healthReport = new HealthReport({  animalID, staffID, healthDescription, nextCheckupDate, medication, vaccineStatus,enclosure,dateObserved, age,nickname,animalHealth, veterinarian});
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

router.get("/view/:animalID", async (req, res) => {
    const { animalID } = req.params;
    HealthReport.findOne({ animalID })
        .then((animal) => {
            if (!animal) {
                return res.status(404).json({ error: "Animal not found" });
            }
            res.json(animal);
        })
        .catch((err) => res.status(400).json({ error: err.message }));
});
router.put("/edit/:id", async (req, res) => {
    HealthReport.findByIdAndUpdate({ _id: req.params.id }, {
        enclosure: req.body.enclosure,
        nickname: req.body.nickname,
        age:req.body.age,
        dateObserved:req.body.dateObserved,
        animalID: req.body.animalID, 
        animalHealth: req.body.animalHealth,
        staffID: req.body.staffID, 
        healthDescription: req.body.healthDescription, 
        nextCheckupDate: req.body.nextCheckupDate, 
        medication: req.body.medication, 
        vaccineStatus: req.body.vaccineStatus,
        veterinarian: req.body.veterinarian
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
    HealthReport.findByIdAndUpdate({ _id: req.params.id }, {
        isArchived: true
    })
    .then(() => {
        res.send("Health Report archived successfully");
    })
    .catch((err) => res.send(err + "\nFailed to archive Health Report"));
});

router.put("/restore/:id", async (req, res) => {
    HealthReport.findByIdAndUpdate({ _id: req.params.id }, {
        isArchived: false
    })
    .then(() => {
        res.send("Health Report restored successfully");
    })
    .catch((err) => res.send(err + "\nFailed to restore Health Report"));
});


module.exports = router;
