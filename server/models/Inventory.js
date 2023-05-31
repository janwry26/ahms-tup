const mongoose = require("mongoose");
mongoose.pluralize(null);

const inventorySchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    itemType: { type: String, required: true },
    itemDescription: { type: String, required: true },
    quantity: { type: Number, required: true },
    expDate: { type: String, required: true },
});

module.exports = mongoose.model("inventory_collection", inventorySchema);
