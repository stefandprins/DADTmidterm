const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/resultsController');

// routes for GET and POST
// Route to display all party results nationwide
router.route('/').get(resultsController.getAllPartyResults);

// Route to display all provinces - test
//router.route('/provinces').get(resultsController.getAllProvinces);

module.exports = router;
