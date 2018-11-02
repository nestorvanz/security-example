const Express = require("express");
const JWT = require("jsonwebtoken");
const PORT = 3000; // most be in a config file
const SECRET_STRING = "my_super_secret_string"; // Most be in a config file

// Add this function to a component
function generateToken(data, next) {
  let payload = { data: data };
  JWT.sign(payload, SECRET_STRING, {
    expiresIn: '100d'
  }, next);
}

// Add this middleware function to a component
function verifyToken(req, res, next) {
  try {
    let token = req.headers.authorization.replace('Bearer ', '');
    let payload = JWT.verify(token, SECRET_STRING);
    req.session = {
      userID: payload.data.uid
    };
    next();
  } catch (error) {
    res.status(401).json("Session has expired.");
  }
}

var app = Express();

// Create API for sign in
app.post('/auth', (req, res) => {
  // Check user auth process
  let data = { uid: "thisissomeid" };
  generateToken(data, (err, token) => {
    res.json(token);
  });
});

// API for test token session
app.get('/example', verifyToken, (req, res) => {
  res.json("pass authorization for user: " + req.session.userID);
});

app.listen(PORT, () => {
  console.log("Server listen on port " + PORT);
});