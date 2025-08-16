const express = require("express");
const router = express.Router();


const { register, login, logout, userDetails } = require('../services/user');

// Routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/userDetails", userDetails);


module.exports = router;