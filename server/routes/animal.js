const express = require("express");
const router = express.Router();
const Animal = require("../models/Animal");
const getNextCounterValue = require("./counterUtils");

router.get("/view", async (req, res) => {
    Animal.find({ $or: [{ isArchived: { $exists: false } }, { isArchived: false }] })
      .then((items) => res.json(items))
      .catch((err) => res.status(400).json("Error: " + err));
});

router.get("/view/:animalID", async (req, res) => {
    const { animalID } = req.params;
    Animal.findOne({ animalID })
        .then((animal) => {
            if (!animal) {
                return res.status(404).json({ error: "Animal not found" });
            }
            res.json(animal);
        })
        .catch((err) => res.status(400).json({ error: err.message }));
});

router.post("/add", async (req, res) => {
    const {  breedType, species, birthDate,quantity,habitat,species1} = req.body;
    
    try {
        const animalID = await getNextCounterValue("animals_collection", "count");

        let animal = new Animal({ animalID,  breedType, species, birthDate,quantity,habitat,species1 });
        await animal.save();

        res.send("animalID #" + animalID + " has been recorded");

    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred during registration");
    }
})

router.put("/edit/:id", async (req, res) => {
    Animal.findByIdAndUpdate({ _id: req.params.id }, {
        // animalName: req.body.animalName,
        breedType: req.body.breedType, 
        species: req.body.species,
        species1: req.body.species1,
        // weight: req.body.weight, 
        // gender: req.body.gender, 
        // age: req.body.age,
        quantity: req.body.quantity,
        birthDate: req.body.birthDate,
        habitat:req.body.habitat,
    })
    .then(() => {
        res.send("Animal updated successfully");
    })
    .catch((err) => res.send(err + "\nFailed to update animal"));
});

router.put("/archive/:id", async (req, res) => {
    Animal.findByIdAndUpdate({ _id: req.params.id }, {
        isArchived: true
    })
    .then(() => {
        res.send("Animal archived successfully");
    })
    .catch((err) => res.send(err + "\nFailed to archive Animal"));
});

router.put("/restore/:id", async (req, res) => {
    Animal.findByIdAndUpdate({ _id: req.params.id }, {
        isArchived: false
    })
    .then(() => {
        res.send("Animal restored successfully");
    })
    .catch((err) => res.send(err + "\nFailed to restore Animal"));
});

module.exports = router;
