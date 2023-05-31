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

module.exports = router;
