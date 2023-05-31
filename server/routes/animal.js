const express = require("express");
const router = express.Router();
const Animal = require("../models/Animal");

router.get("/view", async (req, res) => {
    Animal.find()
        .then((items) => res.json(items))
        .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/add", async (req, res) => {
    const { breedType, species, weight, gender, age, birthDate} = req.body;

    let animal = new Animal({ breedType, species, weight, gender, age, birthDate });
    await animal.save();
    
    animal = await Animal.find({animalID: animal.animalID}).sort({_id:-1}).limit(1);
    const animalID = animal[0].animalID;
    res.send("animalID #" + animalID + " has been recorded");
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
