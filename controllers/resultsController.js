const resultsService = require('../services/resultsService');

// --------------------------------------------------------------------------------------------------------
// https://www.bezkoder.com/node-js-rest-api-express-mysql/
// https://github.com/LloydJanseVanRensburg/Node-MySQL-Tut/tree/master
// I used these websites to help and determine the project structure.
// I have also used some parts to program the controller coding
// --------------------------------------------------------------------------------------------------------

// Function to take the response from the database and serve the getAllTurnoutMunicipalities to the page.
const getAllTurnoutMunicipalities = async (req, res) => {
  try {
    const results = await resultsService.getAllTurnoutMunicipalities();
    const headers = [
      'province_name',
      'municipality_name',
      'registered_votes',
      'total_votes',
      'turnout',
    ];
    res.json({ headers, results });
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch country votes' });
  }
};

// Function to take the response from the database and serve the getAllTurnoutProvinces to the page.
const getAllTurnoutProvinces = async (req, res) => {
  try {
    const results = await resultsService.getAllTurnoutProvinces();
    const headers = [
      'province_name',
      'registered_votes',
      'total_votes',
      'turnout',
    ];
    res.json({ headers, results });
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch country votes' });
  }
};

// Function to take the response from the database and serve the getAllSpoiltMunicipalities to the page.
const getAllSpoiltMunicipalities = async (req, res) => {
  try {
    const results = await resultsService.getAllSpoiltMunicipalities();
    const headers = [
      'province_name',
      'municipality_name',
      'registered_votes',
      'spoilt_votes',
      'spoilt_percentage',
    ];
    res.json({ headers, results });
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch spoilt votes' });
  }
};

// Function to take the response from the database and serve the getAllSpoiltProvinces to the page.
const getAllSpoiltProvinces = async (req, res) => {
  try {
    const results = await resultsService.getAllSpoiltProvinces();
    const headers = [
      'province_name',
      'registered_votes',
      'total_spoilt_votes',
      'spoilt_vote_percentage',
    ];
    res.json({ headers, results });
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch spoilt votes' });
  }
};

// Function to take the response from the database and serve the getAllCountryVotes to the page.
const getAllCountryVotes = async (req, res) => {
  const { provinceID, filter } = req.query;
  try {
    const results = await resultsService.getAllCountryVotes(provinceID, filter);
    const headers = ['party_name', 'total_votes', 'vote_percentage'];
    res.json({ headers, results });
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch country votes' });
  }
};

// Function to take the response from the database and serve the getAllProvinces to the page.
const getAllProvinces = async (req, res) => {
  try {
    const provinces = await resultsService.getAllProvinces();
    res.json({ provinces });
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch province names' });
  }
};

// Function to take the response from the database and serve the getAllPartyNames to the page.
const getAllPartyNames = async (req, res) => {
  try {
    const parties = await resultsService.getAllPartyNames();
    res.json({ parties });
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch party names' });
  }
};

module.exports = {
  getAllTurnoutMunicipalities,
  getAllTurnoutProvinces,
  getAllSpoiltMunicipalities,
  getAllSpoiltProvinces,
  getAllCountryVotes,
  getAllProvinces,
  getAllPartyNames,
};
