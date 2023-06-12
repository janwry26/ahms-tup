const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");

router.post("/add", async (req, res) => {

    const { category,itemName, itemType, unitOfMeasure, manufacturer, supplier, itemDescription,dateAdded, quantity, expDate } = req.body;

    const inventory = new Inventory({ category, itemName, itemType,unitOfMeasure, manufacturer, supplier, dateAdded, itemDescription, quantity, expDate });
    await inventory.save()
    .then(() => {
        res.send("Item added to the inventory");
    })
    .catch((err) => {
        res.send(err + "\nFailed to add item to the inventory");
    })
});

router.get("/view", async (req, res) => {
    Inventory.find({ $or: [{ isArchived: { $exists: false } }, { isArchived: false }] })
      .then((items) => {
        res.json(items)
      })
      .catch((err) => res.status(400).json("Error: " + err));
});

router.put("/edit/:id", async (req, res) => {
    Inventory.findByIdAndUpdate({ _id: req.params.id }, {
        category: req.body.category,
        itemName: req.body.itemName, 
        itemType: req.body.itemType,
        unitOfMeasure: req.body.unitOfMeasure,
        manufacturer: req.body.manufacturer,
        supplier: req.body.supplier,
        itemDescription: req.body.itemDescription, 
        quantity: req.body.quantity, 
        expDate: req.body.expDate,
        dateAdded: req.body.dateAdded,
    })
    .then(() => {
        res.send("Item updated successfully");
    })
    .catch((err) => res.send(err + "\nFailed to update item"));
});

// router.delete('/delete/:id', async (req, res) => {
//     await Inventory.findByIdAndRemove({ _id: req.params.id})
//         .then((doc) => res.send("Item deleted successfully"))
//         .catch((err) => res.send(err + "\nFailed to delete item"));
// });

router.put("/archive/:id", async (req, res) => {
    Inventory.findByIdAndUpdate({ _id: req.params.id }, {
        isArchived: true
    })
    .then(() => {
        res.send("Item archived successfully");
    })
    .catch((err) => res.send(err + "\nFailed to archive Item"));
});

router.put("/restore/:id", async (req, res) => {
    Inventory.findByIdAndUpdate({ _id: req.params.id }, {
        isArchived: false
    })
    .then(() => {
        res.send("Item restored successfully");
    })
    .catch((err) => res.send(err + "\nFailed to restore Item"));
});


module.exports = router;
