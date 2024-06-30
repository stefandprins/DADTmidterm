const db = require('../models/db');

const getAllPartyResults = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM voting_districts;';

    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      } else {
        resolve(results);
        // console.log(results);
      }
    });
  });
};

module.exports = {
  getAllPartyResults,
};
