const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth-admin");
const bcrypt = require("bcryptjs");

//User Information
router.get("/", auth, async (req, res) => {
    const profile = await Admin.findById(req.admin._id);
    res.send(profile);
})

// Register User
router.post("/register", async (req, res) => {

    const { email } = req.body;
    const accType = "Admin";
    //Hash Password
    const password = bcrypt.hashSync(req.body.password, 10);
    // Checking User
    let admin = await Admin.findOne({ email });
    if (admin) {
        return res.status(400).send("User already exists with this email");
    }

    // Save User Into Database
    admin = new Admin({  email, password, accType });
    await admin.save();

    const jwtData = {_id: admin.id, username: admin.accType, email: admin.email}
    const token = jwt.sign(jwtData, process.env.JWTSECRET, { expiresIn: '1h' })

    res.send(token);
});

router.get("/view", async (req, res) => {
    Admin.find()
        .then((items) => res.json(items))
        .catch((err) => res.status(400).json("Error: " + err));
});

router.get("/view", async (req, res) => {
    Admin.find({ $or: [{ isArchived: { $exists: false } }, { isArchived: false }] })
      .then((items) => res.json(items))
      .catch((err) => res.status(400).json("Error: " + err));
});

router.put("/archive/:id", async (req, res) => {
    Admin.findByIdAndUpdate({ _id: req.params.id }, {
        isArchived: true
    })
    .then(() => {
        res.send("Account archived successfully");
    })
    .catch((err) => res.send(err + "\nFailed to archive Account"));
});

router.put("/restore/:id", async (req, res) => {
    Admin.findByIdAndUpdate({ _id: req.params.id }, {
        isArchived: false
    })
    .then(() => {
        res.send("Account restored successfully");
    })
    .catch((err) => res.send(err + "\nFailed to restore Account"));
});

//Change Password
router.put("/change-password/:email", async (req, res) => {
    const password = bcrypt.hashSync(req.body.password, 10);
    Admin.findOneAndUpdate({ email: req.params.email }, {
        password
    })
    .then(() => {
        res.send("Password changed successfully");
    })
    .catch((err) => res.send(err + "\nFailed to change password"));
});

module.exports = router;
