const express = require("express");

const router = express.Router();

const fs = require("fs");

let config = fs.readFileSync("/var/www/html/.config.json");

config = JSON.parse(config);

router.get('/',(req, res, next) => {

  console.log(config);

  res.status('200').json({
    message: config
    }); 

})

module.exports = router;