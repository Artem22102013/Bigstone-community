const express = require("express");
const router = express.Router();

router.get("/oauth_callback", (req, res) => {
  res.send("OAuth callback endpoint");
});

module.exports = router;
