var express = require('express'),
    _       = require('lodash'),
    config  = require('../config'),
    jwt     = require('jsonwebtoken')
    db      = require('../db');
var app = module.exports = express.Router();
function getConversationDB(user_one, user_two, done) {
  db.get().query('SELECT * FROM conversation WHERE (user_one = ? AND user_two = ?) OR (user_two = ? AND user_one = ?) LIMIT 1', [user_one, user_two, user_one, user_two], function(err, rows, fields) {
    if (err) throw err;
    done(rows[0]);
  });
}
function getConversationReplyDB(c_id, done) {
  db.get().query('SELECT * FROM conversation_reply WHERE c_id_fk = ?', [c_id], function(err, rows) {
    if (err) throw err;
    done(rows);
  });
}
app.post('/api/conversation/create', function(req, res) {  
  //req.body.user_one la nguoi gui tin
  if (!req.body.user_one || !req.body.user_two || !req.body.reply) {
    return res.status(400).send("Not enough info for create a conversation");
  }
  getConversationDB(req.body.user_one, req.body.user_two, function(conversation){
    if(!conversation) {
      conversation = {
        user_one: req.body.user_one,
        user_two: req.body.user_two
      };
      db.get().query('INSERT INTO conversation SET ?', [conversation], function(err, result){
        if (err) throw err;
        conversation_reply = {
          c_id_fk: result.insertId,
          reply: req.body.reply,
          user_id_fk: req.body.user_one
        };
        db.get().query('INSERT INTO conversation_reply SET ?', [conversation_reply], function(subErr, subResult){
          if (subErr) throw subErr;
        });
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
    } else{//Da ton tai thi luu vao bang conversation_reply
      conversation_reply = {
          c_id_fk: conversation.c_id,
          reply: req.body.reply,
          user_id_fk: req.body.user_one
        };
      db.get().query('INSERT INTO conversation_reply SET ?', [conversation_reply], function(subErr, subResult){
        if (subErr) throw subErr;
        //res.status(200).send(subResult);
        getConversationReplyDB(conversation.c_id, function(subResult2) {
            res.status(200).send(subResult2);
        });
      });
      /*res.status(201).send({
        msg : "Reply thanh cong"
      });*/
    }
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