/*var express = require('express');
var router = express.Router();

// GET users listing.
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;*/
var express = require('express'),
    _       = require('lodash'),
    config  = require('../config'),
    jwt     = require('jsonwebtoken'),
    express_jwt     = require('express-jwt'),
    db      = require('../db');
var app = module.exports = express.Router();
var secretKey = "don't share this key";
function createToken(user) {
  return jwt.sign(_.omit(user, 'password'), config.secretKey, { expiresIn: 60*60*5 });
}
var jwtCheck = express_jwt({
  secret: config.secretKey
});
function getUserDB(username, done) {
  db.get().query('SELECT * FROM gcm_users WHERE username = ? LIMIT 1', [username], function(err, rows, fields) {
    if (err) throw err;
    done(rows[0]);
  });
}
function getUsersDB(user_id, done){
  //console.log(user_id);
    db.get().query('SELECT * FROM gcm_users WHERE NOT (id = ?)', user_id, function(err, rows) {
        if (err) throw err;
        done(rows);
    });
}
app.post('/api/user/create', function(req, res) {  
  if (!req.body.username || !req.body.password) {
    return res.status(400).send("You must send the username and the password");
  }
  getUserDB(req.body.username, function(user){
    if(!user) {
      user = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
      };
      db.get().query('INSERT INTO gcm_users SET ?', [user], function(err, result){
        if (err) throw err;
        newUser = {
          id: result.insertId,
          username: user.username,
          password: user.password,
          email: user.email
        };
        res.status(201).send({
          id_token: createToken(newUser)
        });
      });
    }
    else res.status(400).send("A user with that username already exists");
  });
});
app.post('/api/user/login', function(req, res) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send("You must send the username and the password");
  }
  getUserDB(req.body.username, function(user){
    if (!user) {
      return res.status(401).send("The username is not existing");
    }
    if (user.password !== req.body.password) {
      return res.status(401).send("The username or password don't match");
    }
    res.status(201).send({
      id_token: createToken(user)
    });
  });
});
app.get('/user/check/:username', function(req, res) {
  if (!req.params.username) {
    return res.status(400).send("You must send a username");
  }
  getUserDB(req.params.username, function(user){
    if(!user) res.status(201).send({username: "OK"});
    else res.status(400).send("A user with that username already exists");
  });
});

app.use('/api/user/get_users', jwtCheck);

app.get('/api/user/get_users/:user_id', function(req, res) {
  console.log(req.params.user_id);
  if (!req.params.user_id) {
    return res.status(400).send("You must send a user id");
  }
  getUsersDB(req.params.user_id ,function(result) {
      res.status(200).send(result);
  });
});