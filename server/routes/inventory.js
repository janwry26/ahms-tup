const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");

router.post("/add", async (req, res) => {

    const { itemName, itemType, itemDescription, quantity, expDate } = req.body;

    const inventory = new Inventory({  itemName, itemType, itemDescription, quantity, expDate });
    await inventory.save()
    .then(() => {
        res.send("Item added to the inventory");
    })
    .catch((err) => {
        res.send(err + "\nFailed to add item to the inventory");
    })
});

router.get("/view", async (req, res) => {
    Inventory.find()
        .then((items) => res.json(items))
        .catch((err) => res.status(400).json("Error: " + err));
});

router.put("/edit/:id", async (req, res) => {
    Inventory.findByIdAndUpdate({ _id: req.params.id }, {
        itemName: req.body.itemName, 
        itemType: req.body.itemType,
        itemDescription: req.body.itemDescription, 
        quantity: req.body.quantity, 
        expDate: req.body.expDate
    })
    .then(() => {
        res.send("Item updated successfully");
    })
    .catch((err) => res.send(err + "\nFailed to update item"));
});

router.delete('/delete/:id', async (req, res) => {
    await Inventory.findByIdAndRemove({ _id: req.params.id})
        .then((doc) => res.send("Item deleted successfully"))
        .catch((err) => res.send(err + "\nFailed to delete item"));
});


module.exports = router;
