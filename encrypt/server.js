const Express = require("express");
const BodyParser = require("body-parser");
const bcrypt = require('bcrypt');

const PORT = 3000; // most be in a config file
const SALT_RAUNDS = 10;

var app = Express();
app.use(BodyParser.json());

app.post('/sign-up', (req, res) => {
  let pass = req.body.pass;
  bcrypt.hash(pass, SALT_RAUNDS, function(err, hash) {
    // Store hash password into DB.
    res.json(hash);
  });
});

app.post('/sign-in', (req, res) => {
  let pass = req.body.pass;
  bcrypt.hash(pass, SALT_RAUNDS, function(err, hash) {
    // Check generated hash with stored hash
    let dbUserPasswordHash = 'some.hash';
    if (dbUserPasswordHash == hash) {
      res.json("json.web.token");
    } else {
      res.status(403).json("Invalid email or password.");
    }
  });
});

app.listen(PORT, () => {
  console.log("Server listen on port " + PORT);
});