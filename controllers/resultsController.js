const resultsService = require('../services/resultsService');

const getAllPartyResults = async (req, res) => {
  try {
    const results = await resultsService.getAllPartyResults();
    console.log(results);
    res.render('party-results', { partyResults: results });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getAllPartyResults,
};
