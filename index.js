const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const app = express();
const port = 8088;

// Mustache
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));
// Import route definitions from routes/resultsRoutes
const resultsRoutes = require('./routes/resultsRoutes');

// Assign the resultsRoutes to the express application
app.use('/', resultsRoutes);

// Listen to the specified port.
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
