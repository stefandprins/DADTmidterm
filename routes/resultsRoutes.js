const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/resultsController');

// routes for GET and POST
// Route to display all party results nationwide
router.route('/country-votes').get(resultsController.getAllCountryVotes);

// Route to display all provinces
router.route('/provinces').get(resultsController.getAllProvinces);

// Route to call all parties
router.route('/parties').get(resultsController.getAllPartyNames);

module.exports = router;
