var express = require('express'),
    _       = require('lodash'),
    config  = require('../config'),
    jwt     = require('jsonwebtoken')
    db      = require('../db');
var app = module.exports = express.Router();
function getConversationDB(user_one, user_two, done) {
  db.get().query('SELECT * FROM conversation WHERE user_one = ? AND user_two = ? LIMIT 1', [user_one, user_two], function(err, rows, fields) {
    if (err) throw err;
    done(rows[0]);
  });
}
app.post('/api/conversation/create', function(req, res) {  
  if (!req.body.user_one || !req.body.user_two) {
    return res.status(400).send("You must send the user one and user two");
  }
  getConversationDB(req.body.user_one, req.body.user_two, function(conversation){
    if(!conversation) {
      conversation = {
        user_one: req.body.user_one,
        user_two: req.body.user_two
      };
      db.get().query('INSERT INTO conversation SET ?', [conversation], function(err, result){
        if (err) throw err;
        console.log("tao cuoc thoai thanh cong");
        /*newUser = {
          id: result.insertId,
          username: user.username,
          password: user.password,
          email: user.email
        };
        res.status(201).send({
          id_token: createToken(newUser)
        });*/
        res.status(201).send({
          msg : "Tao cuoc thoai thanh cong"
        });
      });
    }
    else res.status(400).send("A conversation with two users already exists");
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