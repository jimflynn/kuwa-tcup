/* ================================= Routes for API ==================================== */
/**
 * This file specifies the Express routes for the API that supports the Directory UI.
 */

let express = require('express');
let db = require("../db.js");

module.exports = (function() {
    'use strict';
    let api = express.Router();

    /**
     * Get all Kuwa IDs.
     */
    api.get('/kuwaIds', async (req, res) => {
        res.json(await db.getAll());  // Handle error when promise is rejected
    });

    /**
     * Get Kuwa IDs based on status.
     * 
     * `req.params.status` should be one of the following:
     *      "Valid", "Invalid", "Credentials-Provided", 
     *      "Challenge-Expired", "Video-Uploaded", "QR-Code-Scanned"
     */
    api.get('/kuwaIds/:status', async (req, res) => {
        res.json(await db.getAllWithStatus(req.params.status)); // Handle error when promise is rejected
    });

    return api;
})();
