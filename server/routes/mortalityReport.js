const express = require("express");
const router = express.Router();
const MortalityReport = require("../models/MortalityReport");

router.post("/add", async (req, res) => {

    const { animalID, staffID, casueOfDeath, deathDate, deathTime, dateReported } = req.body;

    const mortalityReport = new MortalityReport({  animalID, staffID, casueOfDeath, deathDate, deathTime, dateReported });
    await mortalityReport.save()
    .then(() => {
        res.send("Mortality Report added");
    })
    .catch((err) => {
        res.send(err + "\nFailed to add Mortality report");
    })
});

router.get("/view", async (req, res) => {
    MortalityReport.find()
        .then((items) => res.json(items))
        .catch((err) => res.status(400).json("Error: " + err));
});

router.put("/edit/:id", async (req, res) => {
    MortalityReport.findByIdAndUpdate({ _id: req.params.id }, {
        animalID: req.body.animalID, 
        staffID: req.body.staffID, 
        casueOfDeath: req.body.casueOfDeath, 
        deathDate: req.body.deathDate, 
        medicadeathTimetion: req.body.deathTime, 
        dateReported: req.body.dateReported
    })
    .then(() => {
        res.send("Mortality Report updated successfully");
    })
    .catch((err) => res.send(err + "\nFailed to update report"));
});

router.delete('/delete/:id', async (req, res) => {
    await MortalityReport.findByIdAndRemove({ _id: req.params.id})
        .then((doc) => res.send("Mortality Report deleted successfully"))
        .catch((err) => res.send(err + "\nFailed to delete report"));
});


module.exports = router;
