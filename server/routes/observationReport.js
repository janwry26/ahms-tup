const express = require("express");
const router = express.Router();
const ObservationReport = require("../models/ObservationReport");

router.post("/add", async (req, res) => {

    const { animalID, staffID, reportDescription, dateReported } = req.body;

    const observationReport = new ObservationReport({ animalID, staffID, reportDescription, dateReported });
    await observationReport.save()
    .then(() => {
        res.send("Observation Report added");
    })
    .catch((err) => {
        res.send(err + "\nFailed to add Observation report");
    })
});

router.get("/view", async (req, res) => {
    ObservationReport.find()
        .then((items) => res.json(items))
        .catch((err) => res.status(400).json("Error: " + err));
});

router.put("/edit/:id", async (req, res) => {
    ObservationReport.findByIdAndUpdate({ _id: req.params.id }, {
        animalID: req.body.animalID, 
        staffID: req.body.staffID, 
        reportDescription: req.body.reportDescription,
        dateReported: req.body.dateReported
    })
    .then(() => {
        res.send("Observation Report updated successfully");
    })
    .catch((err) => res.send(err + "\nFailed to update report"));
});

router.delete('/delete/:id', async (req, res) => {
    await ObservationReport.findByIdAndRemove({ _id: req.params.id})
        .then((doc) => res.send("Observation Report deleted successfully"))
        .catch((err) => res.send(err + "\nFailed to delete report"));
});


module.exports = router;
