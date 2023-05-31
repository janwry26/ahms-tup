const mongoose = require("mongoose");
mongoose.pluralize(null);

const { setAnimalID } = require("../middleware/ainmal-middleware");

const animalSchema = new mongoose.Schema({
    animalID: { type: Number, unique: true },
    breedType: { type: String },
    weight: { type: String}, 
    gender: { type: String },
    age: { type: String },
    birthDate: { type: Date },
});

animalSchema.pre('save', setAnimalID);

module.exports = mongoose.model("animals_collection", animalSchema);
