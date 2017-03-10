var express = require('express'),
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
function getRoom(room_id, done){
    //var room_number = Number(room_id);
    db.get().query('SELECT * FROM room WHERE id = ? LIMIT 1', [room_id], function(err, rows, fields){
        if (err) throw err;
        done(rows[0]);
    });
}

app.post('/api/chat/create', function(req, res) {  
  //req.body.user_one la nguoi gui tin
  //req.body.room_id
  //req.body.room_name
  if (!req.body.room_id) {
    return res.status(400).send("Not enough info for create a room");
  }
  getRoom(req.body.room_id, function(room){
    if(!room){
        room = {
            name: req.body.room_name
        };
        db.get().query('INSERT INTO room SET ?', [room], function(err, result){
            if (err) throw err;
            res.status(200).send(result);
        });
    }else{
        //res.status(200).send(room);
        var arrUser = JSON.parse(req.body.room_name);
        for (var i=0; i< arrUser.length; i++){
            console.log(arrUser[i]);
             db.get().query('INSERT INTO logged_in_user SET room_id = ?, user_id = ?', [room.id, arrUser[i]], function(err, result){
                if (err) throw err;
                //res.status(200).send(result);
            });
        }
        //res.status(200).send("ok");
    }
  });
  /*getConversationDB(req.body.user_one, req.body.user_two, function(conversation){
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
    }
  });*/
});