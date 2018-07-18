/* ================================= Routes for API ==================================== */

let express = require('express');
let db = require("../db.js");

module.exports = (function() {
    'use strict';
    let api = express.Router();

    // All Kuwa IDs
    api.get('/kuwaIds', async (req, res) => {
        res.json(await db.getAll());  // Handle error when promise is rejected
    });

    // Get Kuwa IDs based on status
    api.get('/kuwaIds/:status', async (req, res) => {
        res.json(await db.getAllWithStatus(req.params.status)); // Handle error when promise is rejected
    });

    return api;
})();
