const resultsService = require('../services/resultsService');

// Function to take the response from the database and serve the getAllCountryVotes to the page.
const getAllCountryVotes = async (req, res) => {
  const { provinceID, filter } = req.query;
  try {
    const results = await resultsService.getAllCountryVotes(provinceID, filter);
    const headers = ['party_name', 'total_votes', 'vote_percentage'];
    res.json({ headers, results });
  } catch (err) {
    console.error('Error fetching country votes:', err);
    res.status(500).send({ error: 'Failed to fetch country votes' });
  }
};

// Function to take the response from the database and serve the getAllProvinces to the page.
const getAllProvinces = async (req, res) => {
  try {
    const provinces = await resultsService.getAllProvinces();
    console.log(provinces);
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
  getAllCountryVotes,
  getAllProvinces,
  getAllPartyNames,
};
