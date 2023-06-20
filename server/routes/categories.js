const express = require("express");
const router = express.Router();
const Categories = require("../models/Categories");
const getNextCounterValue = require("./counterUtils");

router.post("/add", async (req, res) => {
    const { categoryId, module, type, item } = req.body;
    const itemName = item[0].itemName;
    try {
        let category = await Categories.findOne({ categoryId });

        if (!category) {
            const catId = await getNextCounterValue("categories", "count");
            category = new Categories({ categoryId:catId, module, type });
        } 

        const itemId = category.item.length + 1;

        category.item.push({ itemId, itemName });
        await category.save();

        res.send("Item added to categories");
    } catch (err) {
        res.status(500).send(err + "\nFailed to add item to categories");
    }
});


router.get("/view", async (req, res) => {
    Categories.find()
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
