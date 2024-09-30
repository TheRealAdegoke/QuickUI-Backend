const express = require("express");
const lemonSqueezy = require("../Controller/LemonSqueezyController");
const router = express.Router();

router.post("/webhook", lemonSqueezy);

module.exports = router;
