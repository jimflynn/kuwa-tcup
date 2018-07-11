/* ================================= Routes for API ==================================== */

let express = require('express');
let db = require("../db.js");

module.exports = (function() {
    'use strict';
    let api = express.Router();

    // All Kuwa IDs
    api.get('/kuwaIds', async (req, res) => {
        res.json(await db.getAll());
    });

    // All Valid Kuwa IDs
    api.get('/kuwaIds/valid', async (req, res) => {
        res.json(await db.getAllValid());
    });

    // All Invalid Kuwa IDs
    api.get('/kuwaIds/invalid', (req, res) => {
        db.getAllInvalid(res);
    });

    return api;
})();
