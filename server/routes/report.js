const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

router.post("/add", async (req, res) => {

    const { staffID, reportDescription, dateReported } = req.body;

    const report = new Report({ staffID, reportDescription, dateReported });
    await report.save()
    .then(() => {
        res.send("Report added");
    })
    .catch((err) => {
        res.send(err + "\nFailed to add report");
    })
});

router.get("/view", async (req, res) => {
    Report.find()
        .then((items) => res.json(items))
        .catch((err) => res.status(400).json("Error: " + err));
});

router.put("/edit/:id", async (req, res) => {
    Report.findByIdAndUpdate({ _id: req.params.id }, {
        staffID: req.body.staffID,
        reportDescription: req.body.reportDescription, 
        dateReported: req.body.dateReported
    })
    .then(() => {
        res.send("Report updated successfully");
    })
    .catch((err) => res.send(err + "\nFailed to update report"));
});

router.delete('/delete/:id', async (req, res) => {
    await Report.findByIdAndRemove({ _id: req.params.id})
        .then((doc) => res.send("Report deleted successfully"))
        .catch((err) => res.send(err + "\nFailed to delete report"));
});


module.exports = router;
