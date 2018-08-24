const express = require("express");

const router = express.Router();

const fs = require("fs");

let config = fs.readFileSync("/var/www/html/.config.json");

router.get('/',(req, res, next) => {

  console.log(config);

  res.status('200').json({
    message: config
    }); 

})

module.exports = router;