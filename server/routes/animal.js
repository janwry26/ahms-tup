const express = require("express");
const router = express.Router();
const Animal = require("../models/Animal");
const getNextCounterValue = require("./counterUtils");

router.get("/view", async (req, res) => {
    Animal.find()
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
    const { animalName, breedType, species, weight, gender, age, birthDate} = req.body;
    
    try {
        const animalID = await getNextCounterValue("animals_collection", "count");

        let animal = new Animal({ animalID, animalName, breedType, species, weight, gender, age, birthDate });
        await animal.save();

        res.send("animalID #" + animalID + " has been recorded");

    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred during registration");
    }
})

router.put("/edit/:id", async (req, res) => {
    Animal.findByIdAndUpdate({ _id: req.params.id }, {
        breedType: req.body.breedType, 
        species: req.body.species,
        weight: req.body.weight, 
        gender: req.body.gender, 
        age: req.body.age,
        birthDate: req.body.birthDate
    })
    .then(() => {
        res.send("Animal updated successfully");
    })
    .catch((err) => res.send(err + "\nFailed to update animal"));
});

module.exports = router;
