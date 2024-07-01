--
-- I created the SQL queries for creating a database and inserting the tables.
--

-- Create the database called election_results.
CREATE DATABASE IF NOT EXISTS election_results;

-- Select the database
USE election_results;

-- Create the table for the provinces
CREATE TABLE IF NOT EXISTS provinces (
    provinceID INTEGER PRIMARY KEY AUTO_INCREMENT,
    province_name VARCHAR(255) UNIQUE NOT NULL
);

-- Create the table for the municipalities
CREATE TABLE IF NOT EXISTS municipalities (
    municipalityID INTEGER PRIMARY KEY AUTO_INCREMENT,
    municipality_name VARCHAR(255) UNIQUE NOT NULL,
    provinceID INTEGER NOT NULL,

    -- Define the foreign
    FOREIGN KEY (provinceID) REFERENCES provinces(provinceID)
);

-- Create the table for the voting districts
CREATE TABLE IF NOT EXISTS voting_districts (
    vd_number INTEGER PRIMARY KEY NOT NULL,
    vs_name VARCHAR(255) NOT NULL,
    registered_voters INTEGER NOT NULL,
    spoilt_votes INTEGER NOT NULL,
    total_votes INTEGER NOT NULL,
    municipalityID INTEGER NOT NULL,

    -- Define the foreign
    FOREIGN KEY (municipalityID) REFERENCES municipalities(municipalityID)
);

-- Create the table for the parties
CREATE TABLE IF NOT EXISTS parties (
    partyID INTEGER PRIMARY KEY AUTO_INCREMENT,
    party_name VARCHAR(255) NOT NULL
);

-- Create the table for party results.
CREATE TABLE IF NOT EXISTS party_results (
    vd_numberID INTEGER,
    partyID INTEGER,
    party_result INTEGER NOT NULL,
    

    -- Define the foreign
    FOREIGN KEY (vd_numberID) REFERENCES voting_districts(vd_number),
    FOREIGN KEY (partyID) REFERENCES parties(partyID),

    -- Define a composite primary key
    PRIMARY KEY (vd_numberID, partyID)
);

-- Create an index on these column names to improve speed
CREATE INDEX idx_provinceID ON municipalities(provinceID);
CREATE INDEX idx_municipalityID ON voting_districts(municipalityID);
CREATE INDEX idx_vd_numberID ON voting_districts(vd_number);
CREATE INDEX idx_partyID ON parties(partyID);