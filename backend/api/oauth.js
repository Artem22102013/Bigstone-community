const express = require('express');
const router = express.Router();

router.get("/oauth", (req, res) => {
  res.send("OAuth endpoint");
});

module.exports = router;