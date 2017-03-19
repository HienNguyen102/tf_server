var express = require('express'),
    config  = require('../config'),
    jwt     = require('jsonwebtoken')
    db      = require('../db');
var app = module.exports = express.Router();
function getPrivateRoom(user_one, user_two, done){
  db.get().query('SELECT id, is_private FROM room WHERE is_private = 1 AND id IN(SELECT room_id FROM logged_in_user WHERE user_id = ? AND room_id IN(SELECT room_id FROM logged_in_user WHERE user_id = ?))', [user_one, user_two], function(err, rows, fields){
    if(err) throw err;
    done(rows);
  });
}
function isUserInRoom(room_id, user_id, done){
  db.get().query('SELECT room_id FROM logged_in_user WHERE room_id = ? AND user_id = ?', [room_id, user_id], function(err, rows, fields){
    if(err) throw err;
    if(rows.length>0){
      done(true);
    }else{
      done(false);
    }
  });
}
function getRoom(room_id, done){
    db.get().query('SELECT * FROM room WHERE id = ? LIMIT 1', [room_id], function(err, rows, fields){
        if (err) throw err;
        done(rows[0]);
    });
}
function getAllRoomOfUser(user_id, done){
  db.get().query('SELECT * FROM room WHERE id IN(SELECT room_id FROM logged_in_user WHERE user_id = ?)', [user_id], function(err, rows){
    if (err) throw err;
    done(rows);
  });
}
function getGroups(user_id, done){
  db.get().query('select * FROM room WHERE is_private = 0 AND id IN(SELECT room_id FROM logged_in_user WHERE user_id = ?)', [user_id], function(err, rows, fields){
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

//**************Common**************
app.get('/api/chat/rooms/:user_id', function(req, res) {
  getAllRoomOfUser(req.params.user_id, function(result) {
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

app.post('/api/chat/send_message', function(req, res){
  var currentTime = new Date();
  var room_id = req.body.room_id;
  var user_id = req.body.user_id;
  var to_user_id = req.body.to_user_id;
  var text = req.body.text;
  if(!room_id || !user_id || !to_user_id || !text){
    return res.status(400).send("Not enough info for a message");
  }
  db.get().query('UPDATE room SET latest_message = ?, latest_time = ? WHERE id = ?', [text, currentTime.getTime(), room_id], function(err, result){
    if(err) throw err;
  });
  var message = {
    room_id: room_id,
    text: text,
    user_id: user_id,
    to_user_id: to_user_id,
    time_stamp: currentTime.getTime()
  };
  db.get().query('INSERT INTO message SET ?', [message], function(subErr, subRes){
    if (subErr) throw subErr;
    res.status(200).send(subRes);
  });
});
//***********************Common***********************

//*******************Private chat*******************

app.post('/api/chat/create_private_group', function(req, res) {
  var currentTime = new Date();
  var user_one_id = req.body.user_one_id;
  var user_one_name = req.body.user_one_name;
  var user_two_id = req.body.user_two_id;
  var text = req.body.text;
  if(!user_one_id || !user_one_name || !user_two_id || !text){
    return res.status(400).send("Not enough info for create private chat");
  }
  var room = {
      name: user_one_id + "_" + user_two_id,
      created_by: user_one_id,
      is_private: 1,
      owner_name: user_one_name,
      latest_message: text,
      latest_time: currentTime.getTime()
  };
  db.get().query('INSERT INTO room SET ?', [room], function(err, result){
    if (err) throw err;
    var message = {
      room_id: result.insertId,
      text: text,
      user_id: user_one_id,
      to_user_id: user_two_id,
      time_stamp: currentTime.getTime()
    };
    db.get().query('INSERT INTO message SET ?', [message], function(subErr, subRes){
      if (subErr) throw subErr;
    });
    
    db.get().query('INSERT INTO logged_in_user SET room_id = ?, user_id = ?', [result.insertId,user_one_id], function(subErr, resultSub1){
        if (subErr) throw subErr;
    });
    db.get().query('INSERT INTO logged_in_user SET room_id = ?, user_id = ?', [result.insertId,user_two_id], function(subErr, resultSub1){
        if (subErr) throw subErr;
    });
    getRoom(result.insertId, function(newRoomResult){
      res.status(200).send(newRoomResult);
    });
  });
});

//Khi nguoi dung nhan vao Danh Sach Ban Be, mo cua so chat
app.get('/api/chat/get_room/:user_one/:user_two', function(req, res){
  getPrivateRoom(req.params.user_one, req.params.user_two, function(result){
    if(result[0]){
      res.status(200).send(result[0]);
    }else{
      var roomEmpty = {
        id: -1,
        is_private: 0
      }
      res.status(200).send(roomEmpty);
    }
  });
});
//*************************************Private chat*************************************

//####################################################################################################

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
  var owner_name = req.body.owner_name;
  var room_name = req.body.room_name;
  if(!owner_name || !room_name){
    return res.status(400).send("Not enough for create a group");
  }
  var latest_message = owner_name + " create group " + room_name;
  room = {
      name: room_name,
      created_by: arrUser[0],
      is_private: 0,
      owner_name: owner_name,
      latest_message: latest_message,
      latest_time: currentTime.getTime()
  };
  db.get().query('INSERT INTO room SET ?', [room], function(err, result){
    if (err) throw err;
    var message = {
      room_id: result.insertId,
      text: latest_message,
      user_id: arrUser[0],
      to_user_id: 0,
      time_stamp: currentTime.getTime()
    };
    db.get().query('INSERT INTO message SET ?', [message], function(subErr, subRes){
      if (subErr) throw subErr;
    });
    for (var i=0; i< arrUser.length; i++){
        db.get().query('INSERT INTO logged_in_user SET room_id = ?, user_id = ?', [result.insertId, arrUser[i]], function(subErr, resultSub1){
            if (subErr) throw subErr;
        });
    }
    res.status(200).send(result);
  });
});
app.post('/api/chat/rename_group', function(req, res) {
  var currentTime = new Date();
  var room_id = req.body.room_id;
  var user_id = req.body.user_id;
  var username = req.body.username;
  var room_name = req.body.room_name;
  if(!username){
    return res.status(400).send("You must enter your name");
  }
  if(!room_name){
    return res.status(400).send("You must send room name");
  }
  var latest_message = username + " change group name to " + room_name;
  getRoom(room_id, function(room){
    if(room){
      var message = {
        room_id: room_id,
        text: latest_message,
        user_id: user_id,
        to_user_id: 0,
        time_stamp: currentTime.getTime()
      };
      db.get().query('INSERT INTO message SET ?', [message], function(subErr, subRes){
        if (subErr) throw subErr;
      });

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
  var owner_name = req.body.owner_name;
  var kick_out_user_id = req.body.kick_out_user_id;
  var kick_out_username = req.body.kick_out_username;
  if(!owner_id || !owner_name || !kick_out_user_id || !kick_out_username){
    return res.status(400).send("Not enough info for kick out");
  }
  var latest_message = owner_name + " kick out member " + kick_out_username;
  getRoom(room_id, function(room){
    if(room){
    var message = {
        room_id: room_id,
        text: latest_message,
        user_id: owner_id,
        to_user_id: 0,
        time_stamp: currentTime.getTime()
      };
      db.get().query('INSERT INTO message SET ?', [message], function(subErr, subRes){
        if (subErr) throw subErr;
      });
      db.get().query('UPDATE room SET latest_message = ?, latest_time = ? WHERE id = ?', [latest_message, currentTime.getTime(), room_id], function(err, result){
        if(err) throw err;
      });
      db.get().query('DELETE FROM logged_in_user WHERE room_id = ? AND user_id = ?', [room_id, kick_out_user_id], function(err, result){
        if(err) throw err;
        res.status(200).send(result);
      });
    }else{
      res.status(400).send("group doesn't exits");
    }
  });
});
app.post('/api/chat/leave_group', function(req, res){
  var currentTime = new Date();
  var room_id = req.body.room_id;
  var leave_user_id = req.body.leave_user_id;
  var leave_username = req.body.leave_username;
  if(!leave_user_id || !leave_username){
    return res.status(400).send("not enough info for leave group");
  }
  var latest_message = leave_username + " leave group";
  getRoom(room_id, function(room){
    if(room){
    var message = {
        room_id: room_id,
        text: latest_message,
        user_id: leave_user_id,
        to_user_id: 0,
        time_stamp: currentTime.getTime()
      };
      db.get().query('INSERT INTO message SET ?', [message], function(subErr, subRes){
        if (subErr) throw subErr;
      });
      db.get().query('UPDATE room SET latest_message = ?, latest_time = ? WHERE id = ?', [latest_message, currentTime.getTime(), room_id], function(err, result){
        if(err) throw err;
      });
      db.get().query('DELETE FROM logged_in_user WHERE room_id = ? AND user_id = ?', [room_id, leave_user_id], function(err, result){
        if(err) throw err;
        res.status(200).send(result);
      });
    }else{
      res.status(400).send("group doesn't exits");
    }
  });
});
app.post('/api/chat/add_member', function(req, res){
  var currentTime = new Date();
  var room_id = req.body.room_id;
  var user_one = req.body.user_one;//Who add member
  var user_one_name = req.body.user_one_name;
  var user_two = req.body.user_two;
  var user_two_name = req.body.user_two_name;
  if(!user_one || !user_one_name || !user_two || !user_two_name){
    return res.status(400).send("not enough info for add member");
  }
  var latest_message = user_one_name + " add " + user_two_name;
  isUserInRoom(room_id, user_two, function(result){
    if(result){
      res.status(200).send("User already in group");
    }else{
      var message = {
        room_id: room_id,
        text: latest_message,
        user_id: user_one,
        to_user_id: 0,
        time_stamp: currentTime.getTime()
      };
      db.get().query('INSERT INTO message SET ?', [message], function(subErr, subRes){
        if (subErr) throw subErr;
      });
      db.get().query('UPDATE room SET latest_message = ?, latest_time = ? WHERE id = ?', [latest_message, currentTime.getTime(), room_id], function(err, result){
        if(err) throw err;
      });
      db.get().query('INSERT INTO logged_in_user SET room_id = ?, user_id = ? ', [room_id, user_two], function(err, result){
        if(err) throw err;
        res.status(200).send(result);
      });
    }
  });
});
//Delete group and all releative
app.post('/api/chat/delete_group', function(req, res){
  var room_id = req.body.room_id;
  getRoom(room_id, function(room){
    if(room){
      db.get().query('DELETE FROM logged_in_user WHERE room_id = ?', [room_id], function(err, result){
        if(err) throw err;
      });
      db.get().query('DELETE FROM message WHERE room_id = ?', [room_id], function(err, result){
        db.get().query('DELETE FROM room WHERE id = ?', [room_id], function(subErr, subRes){
          res.status(200).send(subRes);
        });
      });
    }else{
      res.status(400).send("group doesn't exits");
    }
  });
});
//----------------------Group----------------------