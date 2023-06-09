const mongoose = require("mongoose");
mongoose.pluralize(null);

const inventorySchema = new mongoose.Schema({
    category: { type: String, required: true },
    itemName: { type: String, required: true },
    itemType: { type: String, required: true },
    unitOfMeasure: { type: String, required: true },
    manufacturer: { type: String, required: true },
    supplier: { type: String, required: true },
    itemDescription: { type: String, required: true },
    quantity: { type: Number, required: true },
    dateAdded: { type: String, required: true },
    expDate: { type: String, required: true },
    isArchived: { type: Boolean }
});

module.exports = mongoose.model("inventory_collection", inventorySchema);
