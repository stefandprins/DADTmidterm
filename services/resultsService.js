const db = require('../models/db');

// --------------------------------------------------------------------------------------------------------
// https://www.bezkoder.com/node-js-rest-api-express-mysql/
// https://github.com/LloydJanseVanRensburg/Node-MySQL-Tut/tree/master
// I used these websites to help and determine the project structure.
// I have also used some parts to program the services
// --------------------------------------------------------------------------------------------------------

// Function to query the database for the province names
const getAllTurnoutMunicipalities = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT 
                      provinces.province_name,
                      municipalities.municipality_name,
                      SUM(voting_districts.registered_voters) AS registered_votes,
                      SUM(voting_districts.total_votes) AS total_votes,
                      ROUND((SUM(voting_districts.total_votes) / SUM(voting_districts.registered_voters) ) *100, 2) AS turnout
                  FROM 
                      voting_districts
                  JOIN 
                      municipalities ON voting_districts.municipalityID = municipalities.municipalityID
                  JOIN
                      provinces ON municipalities.provinceID = provinces.provinceID
                  GROUP BY 
                      municipalities.municipality_name
                  ORDER BY 
                      turnout DESC;`;
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Function to query the database for the province names
const getAllTurnoutProvinces = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT 
                      provinces.province_name,
                      SUM(voting_districts.registered_voters) AS registered_votes,
                      SUM(voting_districts.total_votes) AS total_votes,
                      ROUND((SUM(voting_districts.total_votes) / SUM(voting_districts.registered_voters) ) *100, 2) AS turnout
                  FROM 
                      voting_districts
                  JOIN 
                      municipalities ON voting_districts.municipalityID = municipalities.municipalityID
                  JOIN
                      provinces ON municipalities.provinceID = provinces.provinceID
                  GROUP BY 
                      provinces.province_name
                  ORDER BY 
                      turnout DESC;`;
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Function to query the database for the province names
const getAllSpoiltMunicipalities = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT 
                        provinces.province_name,
                        municipalities.municipality_name,
                        SUM(voting_districts.registered_voters) AS registered_votes,
                        SUM(voting_districts.spoilt_votes) AS spoilt_votes,
                        ROUND((SUM(voting_districts.spoilt_votes) / SUM(voting_districts.registered_voters) ) *100, 2) AS spoilt_percentage
                    FROM 
                        voting_districts
                    JOIN 
                        municipalities ON voting_districts.municipalityID = municipalities.municipalityID
                    JOIN
                        provinces ON municipalities.provinceID = provinces.provinceID
                    GROUP BY 
                        municipalities.municipality_name
                    ORDER BY 
                        spoilt_percentage DESC;`;
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Function to query the database for the province names
const getAllSpoiltProvinces = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT 
                      provinces.province_name,
                      SUM(voting_districts.registered_voters) AS registered_votes,
                      SUM(voting_districts.spoilt_votes) AS total_spoilt_votes,
                      ROUND((SUM(voting_districts.spoilt_votes) / SUM(voting_districts.registered_voters)) * 100, 2) AS spoilt_vote_percentage
                  FROM 
                      voting_districts
                  JOIN 
                      municipalities ON voting_districts.municipalityID = municipalities.municipalityID
                  JOIN
                      provinces ON municipalities.provinceID = provinces.provinceID
                  GROUP BY 
                      provinces.province_name
                  ORDER BY 
                      spoilt_vote_percentage DESC;`;
    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getAllCountryVotes = (provinceID, filter) => {
  return new Promise((resolve, reject) => {
    let params = [];
    // let subqueryWhereClause = '';
    let whereClause = '';
    let limitClause = '';
    if (provinceID && provinceID !== '0') {
      // subqueryWhereClause = 'WHERE municipalities.provinceID = ?';
      whereClause = 'WHERE municipalities.provinceID = ?';
      params.push(provinceID, provinceID);
    }

    if (filter && filter === '1') {
      limitClause = 'LIMIT 3';
    }

    const query = `
                  SELECT
                      parties.party_name,
                      SUM(party_results.party_result) AS total_votes,
                          ROUND(
                              SUM(party_results.party_result) / (
                                  SELECT 
                                      SUM(voting_districts.total_votes)
                                  FROM 
                                      voting_districts
                                  JOIN 
                                      municipalities ON voting_districts.municipalityID = municipalities.municipalityID
                                  ${whereClause}
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
                  GROUP BY 
                      parties.party_name
                  ORDER BY 
                      total_votes DESC
                  ${limitClause}
    `;

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
  getAllTurnoutMunicipalities,
  getAllTurnoutProvinces,
  getAllSpoiltMunicipalities,
  getAllSpoiltProvinces,
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
