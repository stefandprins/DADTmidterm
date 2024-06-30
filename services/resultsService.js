const db = require('../models/db');

const getAllCountryVotes = (provinceID, filter) => {
  return new Promise((resolve, reject) => {
    let params = [];
    let subqueryWhereClause = '';
    let whereClause = '';
    if (provinceID && provinceID !== '0') {
      subqueryWhereClause = 'WHERE m.provinceID = ?';
      whereClause = 'WHERE municipalities.provinceID = ?';
      params.push(provinceID, provinceID);
    }

    const query = `
      SELECT
          parties.party_name,
          SUM(party_results.party_result) AS total_votes,
          ROUND(
            SUM(party_results.party_result) / (
              SELECT SUM(vd.total_votes)
              FROM voting_districts vd
              JOIN municipalities m ON vd.municipalityID = m.municipalityID
              ${subqueryWhereClause}
            ) * 100.0, 2
          ) AS vote_percentage
      FROM
          party_results
      JOIN
          parties ON party_results.partyID = parties.partyID
      JOIN
          voting_districts ON party_results.vd_numberID = voting_districts.vd_number
      JOIN
          municipalities ON voting_districts.municipalityID = municipalities.municipalityID
      ${whereClause}
      GROUP BY parties.party_name
      ORDER BY total_votes DESC
    `;

    console.log('Executing query:', query);
    console.log('With params:', params);

    db.query(query, params, (err, results) => {
      if (err) {
        return reject(err);
      } else {
        resolve(results);
        // console.log(results);
      }
    });
  });
};

// Function to query the database for the province names
const getAllProvinces = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT provinceID, province_name FROM provinces;';
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Function to query the database for the party names
const getAllPartyNames = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT partyID, party_name FROM parties;';
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  getAllCountryVotes,
  getAllProvinces,
  getAllPartyNames,
};

// province_name, party_name, total_votes, vote_percentage
// const query = `SELECT
//                   provinces.province_name,
//                   parties.party_name,
//                   SUM(party_results.party_result) AS total_votes,
//                   ROUND(SUM(party_results.party_result) * 100.0 /
//                       (SELECT
//                           SUM(party_results.party_result)
//                       FROM
//                           party_results
//                       JOIN
//                           voting_districts ON party_results.vd_numberID = voting_districts.vd_number
//                       JOIN
//                           municipalities ON voting_districts.municipalityID = municipalities.municipalityID
//                       WHERE
//                           municipalities.provinceID = provinces.provinceID), 2) AS vote_percentage
//               FROM
//                   party_results
//               JOIN
//                   parties ON party_results.partyID = parties.partyID
//               JOIN
//                   voting_districts ON party_results.vd_numberID = voting_districts.vd_number
//               JOIN
//                   municipalities ON voting_districts.municipalityID = municipalities.municipalityID
//               JOIN
//                   provinces ON municipalities.provinceID = provinces.provinceID
//               GROUP BY
//                   provinces.province_name,
//                   parties.party_name
//               ORDER BY
//                   provinces.province_name,
//                   total_votes DESC;`;
