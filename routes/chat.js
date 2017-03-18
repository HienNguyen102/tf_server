var express = require('express'),
    config  = require('../config'),
    jwt     = require('jsonwebtoken')
    db      = require('../db');
var app = module.exports = express.Router();
function getRoomId(user_one, user_two, done){
  db.get().query('SELECT * FROM logged_in_user WHERE user_id = ? AND room_id IN(SELECT room_id FROM logged_in_user WHERE user_id = ?) AND room_id IN(select room_id from logged_in_user group by room_id HAVING count(room_id)=2)', [user_one, user_two], function(err, rows, fields){
    if(err) throw err;
    done(rows);
  });
}
function getRoom(room_id, done){
    db.get().query('SELECT * FROM room WHERE id = ? LIMIT 1', [room_id], function(err, rows, fields){
        if (err) throw err;
        done(rows[0]);
    });
}
function getAllRooms(done){
  db.get().query('SELECT * FROM room', function(err, rows){
    if (err) throw err;
    done(rows);
  });
}
function getGroups(user_id, done){
  db.get().query('select * FROM room WHERE id IN( SELECT room_id FROM logged_in_user WHERE user_id = ? AND room_id IN( select room_id from logged_in_user group by room_id HAVING count(room_id)>2))', [user_id], function(err, rows, fields){
    if(err) throw err;
    done(rows);
  });
}
function getAllMessages(room_id, done){
  db.get().query('SELECT * FROM message WHERE room_id = ?',[room_id], function(err, rows){
    if (err) throw err;
    done(rows);
  });
}

function leaveGroup(group_id, user_id, done){
  db.get().query('', [group_id, user_id], function(err, row){
    if(err) throw err;
    done(row)
  });
}

app.post('/api/chat/create', function(req, res) {
  /*if (!req.body.room_id) {
    return res.status(400).send("Not enough info for create a room");
  }*/
  var currentTime = new Date();
  getRoom(req.body.room_id, function(room){
    if(!room){
        room = {
            name: req.body.room_name,
            latest_message: req.body.text,
            latest_time: currentTime.getTime()
        };
        db.get().query('INSERT INTO room SET ?', [room], function(err, result){
          if (err) throw err;
          var arrUser = JSON.parse(req.body.users);
          for (var i=0; i< arrUser.length; i++){
              console.log(arrUser[i]);
              db.get().query('INSERT INTO logged_in_user SET room_id = ?, user_id = ?', [result.insertId, arrUser[i]], function(err, resultSub1){
                  if (err) throw err;
              });
          }
          var message = {
            room_id: result.insertId,
            text: req.body.text,
            user_id: arrUser[0],
            to_user_id: arrUser[1],
            time_stamp: currentTime.getTime()
          };
          db.get().query('INSERT INTO message SET ?', [message], function(err, resultSub2){
            res.status(200).send(resultSub2);
          });
        });
    }else{
        var arrUser = JSON.parse(req.body.users);
        var message = {
          room_id: room.id,
          text: req.body.text,
          user_id: arrUser[0],
          to_user_id: arrUser[1],
          time_stamp: currentTime.getTime()
        };
        //Update latest_message of room
        db.get().query("UPDATE room SET latest_message = ?, latest_time = ? WHERE id = ?", [req.body.text, currentTime.getTime(), room.id], function(err, result){
          if (err) throw err;
        });
        db.get().query('INSERT INTO message SET ?', [message], function(err, result){
          res.status(200).send(result);
        });
    }
  });
});

app.get('/api/chat/rooms', function(req, res) {
  getAllRooms(function(result) {
      res.status(200).send(result);
  });
});

app.get('/api/chat/get_messages/:room_id', function(req, res) {
  if (!req.params.room_id) {
    return res.status(400).send("You must send a user id");
  }
  getAllMessages(req.params.room_id ,function(result) {
      res.status(200).send(result);
  });
});
app.get('/api/chat/get_room/:user_one/:user_two', function(req, res){
  getRoomId(req.params.user_one, req.params.user_two, function(result){
    res.status(200).send(result[0]);
  });
});
//-----------Group-----------
app.get('/api/chat/get_group/:user_id', function(req, res){
  getGroups(req.params.user_id, function(result){
    res.status(200).send(result);
  });
});
app.post('/api/chat/create_group', function(req, res) {
  var currentTime = new Date();
  var arrUser = JSON.parse(req.body.users);
  if(arrUser.length<=2){
    return res.status(400).send("Group need 3 people or more");
  }
  var latest_message = arrUser[0] + " create group " + req.body.room_name;
  room = {
      name: req.body.room_name,
      created_by: arrUser[0],
      latest_message: latest_message,
      latest_time: currentTime.getTime()
  };
  db.get().query('INSERT INTO room SET ?', [room], function(err, result){
    if (err) throw err;
    for (var i=0; i< arrUser.length; i++){
        db.get().query('INSERT INTO logged_in_user SET room_id = ?, user_id = ?', [result.insertId, arrUser[i]], function(err, resultSub1){
            if (err) throw err;
        });
    }
    res.status(200).send(result);
  });
});
app.post('/api/chat/rename_group', function(req, res) {
  var currentTime = new Date();
  var room_id = req.body.room_id;
  var user_id = req.body.user_id;
  var room_name = req.body.room_name;
  var latest_message = user_id + " change group name to " + room_name;
  getRoom(room_id, function(room){
    if(room){
      db.get().query('UPDATE room SET name = ?, latest_message = ?, latest_time = ? WHERE id = ?', [room_name, latest_message, currentTime.getTime(), room_id], function(err, result){
        if(err) throw err;
        res.status(200).send(result);
      });
    }else{
      res.status(400).send("group doesn't exits");
    }
  });
});
app.post('/api/chat/kick_out_member', function(req, res){
  var currentTime = new Date();
  var room_id = req.body.room_id;
  var owner_id = req.body.owner_id;
  var user_id = req.body.user_id;
  var latest_message = owner_id + " kick out member " + user_id;
  getRoom(room_id, function(room){
    if(room){
      db.get().query('UPDATE room SET latest_message = ?, latest_time = ? WHERE id = ?', [latest_message, currentTime.getTime(), room_id], function(err, result){
        if(err) throw err;
      });
      db.get().query('DELETE FROM logged_in_user WHERE room_id = ? AND user_id = ?', [room_id, user_id], function(err, result){
        if(err) throw err;
        res.status(200).send(result);
      });
    }else{
      res.status(400).send("group doesn't exits");
    }
  });
});
//----------------------Group----------------------