const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const app = express();
const port = 8088;

app.use(express.static('public'));

const resultsRoutes = require('./routes/resultsRoutes');

// Assign the resultsRoutes to the express application
app.use('/', resultsRoutes);

// Listen to the specified port.
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
