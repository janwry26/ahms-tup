const express = require("express");
const router = express.Router();
const User = require("../models/User");
const getNextCounterValue = require("./counterUtils");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");

//User Information
router.get("/", auth, async (req, res) => {
    const profile = await User.findById(req.user._id);
    res.send(profile);
})

// Register User
router.post("/register", async (req, res) => {
    const { lastName, firstName, email, contact, username } = req.body;
    const password = bcrypt.hashSync(req.body.password, 10);

    try {
        const staffId = await getNextCounterValue("userAccounts", "count");

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).send("User already exists with this email");
        }

        user = new User({
            staffId,
            lastName,
            firstName,
            email,
            contactNum: contact,
            username,
            password,
        });
        await user.save();

        const jwtData = { _id: user.id, username: user.username, email: user.email };
        const token = jwt.sign(jwtData, process.env.JWTSECRET, { expiresIn: "1h" });

        res.send(token);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred during registration");
    }
});


router.get("/view", async (req, res) =>     {
    User.find({ $or: [{ isArchived: { $exists: false } }, { isArchived: false }] })
        .then((items) => res.json(items))
        .catch((err) => res.status(400).json("Error: " + err));
});


router.get("/view/:staffId", async (req, res) => {
    const { staffId } = req.params;
    User.findOne({ staffId })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json(user);
        })
        .catch((err) => res.status(400).json({ error: err.message }));
});

router.get("/view-email/:email", async (req, res) => {
    const { email } = req.params;
    User.findOne({ email })
        .select('lastName firstName email contactNum username')
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json(user);
        })
        .catch((err) => res.status(400).json({ error: err.message }));
});

router.get("/view-staff/:_id", async (req, res) => {
    const { _id } = req.params;
    User.findOne({ _id })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json(user);
        })
        .catch((err) => res.status(400).json({ error: err.message }));
});

router.put("/edit/:id", async (req, res) => {
    User.findByIdAndUpdate({ _id: req.params.id }, {
        lastName: req.body.lastName, 
        firstName: req.body.firstName,
        email: req.body.email, 
        contactNum: req.body.contactNum, 
        username: req.body.username
    })
    .then((doc) => {
        console.log(doc);
        res.send("Account updated successfully");
    })
    .catch((err) => res.send(err + "\nFailed to update Account"));
});

router.put("/change-password/:id", async (req, res) => {
    const newPassword = bcrypt.hashSync(req.body.newPassword, 10);

    User.findByIdAndUpdate({ _id: req.params.id }, { password: newPassword })
    .then((doc) => {
        console.log(doc);
        res.send("Password changed successfully");
    })
    .catch((err) => res.send(err + "\nFailed to change password"));
});

router.put("/archive/:id", async (req, res) => {
    User.findByIdAndUpdate({ _id: req.params.id }, {
        isArchived: true
    })
    .then(() => {
        res.send("Account archived successfully");
    })
    .catch((err) => res.send(err + "\nFailed to archive Account"));
});

router.put("/restore/:id", async (req, res) => {
    User.findByIdAndUpdate({ _id: req.params.id }, {
        isArchived: false
    })
    .then(() => {
        res.send("Account restored successfully");
    })
    .catch((err) => res.send(err + "\nFailed to restore Account"));
});

module.exports = router;
