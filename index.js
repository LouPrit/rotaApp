const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rotaRoutes = require('./routes/rotaRoutes'); 
const teamRoutes = require('./routes/teamRoutes'); 

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use('/rota', rotaRoutes); //Use our rota routes
app.use('/team', teamRoutes); //Use our rota routes

/**
 * Our error handler middleware, errors processed using 'next' are sent to here.
 * This has to be declared after the other middleware otherwise errors won't be sent here.
 */
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(`Woops! Something broke:
     ${err}`);
})

app.listen(PORT, () => {
  console.log('Server listening on port: ', PORT);
});