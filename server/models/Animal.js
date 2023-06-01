const mongoose = require("mongoose");
mongoose.pluralize(null);

const animalSchema = new mongoose.Schema({
    animalID: { type: Number, unique: true },
    animalName: { type: String, required: true},
    breedType: { type: String, required: true },
    species: { type: String, required: true },
    weight: { type: String, required: true}, 
    gender: { type: String, required: true },
    age: { type: String, required: true },
    birthDate: { type: Date, required: true },
});

module.exports = mongoose.model("animals_collection", animalSchema);
