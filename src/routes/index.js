const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.status(200).send('<h1 style="text-align: center">App Online, 2023!</h1>');
});



module.exports = router;
