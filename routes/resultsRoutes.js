const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/resultsController');

// routes for GET and POST
// Route to display the voter turnout based on the municipalities
router
  .route('/turnout-votes')
  .get(resultsController.getAllTurnoutMunicipalities);

// Route to display the voter turnout based on the municipalities
router
  .route('/turnout-provinces-votes')
  .get(resultsController.getAllTurnoutProvinces);

// Route to display all spoilt votes per municipality
router
  .route('/spoilt-municipality-votes')
  .get(resultsController.getAllSpoiltMunicipalities);

// Route to display all spoilt votes per municipality
router
  .route('/spoilt-provinces-votes')
  .get(resultsController.getAllSpoiltProvinces);

// Route to display all party results nationwide
router.route('/country-votes').get(resultsController.getAllCountryVotes);

// Route to display all provinces
router.route('/provinces').get(resultsController.getAllProvinces);

// Route to call all parties
router.route('/parties').get(resultsController.getAllPartyNames);

module.exports = router;
