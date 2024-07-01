const express = require('express');
const path = require('path');
const app = express();
const port = 8088;

// --------------------------------------------------------------------------------------------------------
// I used one of my previous projects to start the  coding of this project.
// The code was modified for this project
// --------------------------------------------------------------------------------------------------------

// Set the static path to public
app.use(express.static('public'));

// Create the path for the routes
const resultsRoutes = require('./routes/resultsRoutes');

// Assign the resultsRoutes to the express application
app.use('/', resultsRoutes);

// Listen to the specified port.
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
