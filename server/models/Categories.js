const mongoose = require("mongoose");
mongoose.pluralize(null);

const categoriesSchema = new mongoose.Schema({
    categoryId: { type: Number, required: true },
    module: { type: String, required: true },
    type: { type: String, required: true },
    item: [{ 
        itemId: { type: Number },
        itemName: { type: String }
    }]
});

module.exports = mongoose.model("categories", categoriesSchema);
