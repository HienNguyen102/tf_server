exports.connect = function(server){
    var io = require('socket.io')(server);
    var db = require('./db');
    var userList = [];
    var typingUsers = [];
    function updateUserInDB(user_id, socketId ,is_online, done){
        var strQuery = "UPDATE gcm_users SET isOnline = ";
        if (is_online){
            strQuery += "1, socket_id = '" + socketId + "'";
        }else{
            strQuery += "0, socket_id = ''";
        }
        strQuery += " WHERE id = " + user_id;
        db.get().query(strQuery, function(err, rows){
            if (err) throw err;
            done(rows);
        });
    }
    //When disconnect
    function updateUserInDBWhenDisconnect(socketId, done){
        var strQuery = "UPDATE gcm_users SET isOnline = 0, socket_id = '' WHERE socket_id = '" + socketId +"'";
        db.get().query(strQuery, function(err, rows){
            if (err) throw err;
            done(rows);
        });
    }
    function getAllUsersInDB(done){
        db.get().query('SELECT * FROM gcm_users', function(err, rows) {
            if (err) throw err;
            done(rows);
        });
    }

    io.on('connection', function(clientSocket) {
        console.log('user '+clientSocket.id+' connected');
        clientSocket.emit("clientId", clientSocket.id);

        clientSocket.on('disconnect', function(){
            console.log('user '+clientSocket.id+' disconnected');

            /*var clientNickname;
            for (var i=0; i<userList.length; i++) {
            if (userList[i]["id"] == clientSocket.id) {
                userList[i]["isConnected"] = false;
                clientNickname = userList[i]["nickname"];
                break;
            }
            }

            delete typingUsers[clientNickname];
            io.emit("userList", userList);
            io.emit("userExitUpdate", clientNickname);
            io.emit("userTypingUpdate", typingUsers);*/
            updateUserInDBWhenDisconnect(clientSocket.id, function(result){
                console.log("update success when disconnect");
                getAllUsersInDB(function(resultSelect){
                    io.emit("userList", resultSelect);
                });
            });
        });


        clientSocket.on("exitUser", function(clientId, clientNickname){
            var message = "User " + clientNickname + " was disconnected.";
            console.log(message);
            /*for (var i=0; i<userList.length; i++) {
            if (userList[i]["id"] == clientSocket.id) {
                userList.splice(i, 1);
                break;
            }
            }
            io.emit("userExitUpdate", clientNickname);*/
            updateUserInDB(clientId, "", false, function(result){
                getAllUsersInDB(function(resultSelect){
                    io.emit("userList", resultSelect);
                });
            });
        });


        clientSocket.on('chatMessage', function(clientNickname, message){
            var currentDateTime = new Date().toLocaleString();
            delete typingUsers[clientNickname];
            io.emit("userTypingUpdate", typingUsers);
            io.emit('newChatMessage', clientNickname, message, currentDateTime);
        });


        clientSocket.on("connectUser", function(clientId, clientNickname) {
            var message = "User " + clientNickname + " was connected.";
            console.log(message);

            /*var userInfo = {};
            var foundUser = false;
            for (var i=0; i<userList.length; i++) {
                if (userList[i]["nickname"] == clientNickname) {
                userList[i]["isConnected"] = true
                userList[i]["id"] = clientSocket.id;
                userInfo = userList[i];
                foundUser = true;
                break;
                }
            }

            if (!foundUser) {
                userInfo["id"] = clientSocket.id;
                userInfo["nickname"] = clientNickname;
                userInfo["isConnected"] = true
                userList.push(userInfo);
            }

            io.emit("userList", userList);
            io.emit("userConnectUpdate", userInfo)*/
            updateUserInDB(clientId, clientSocket.id, true, function(result){
                getAllUsersInDB(function(resultSelect){
                    io.emit("userList", resultSelect);
                });
            });
        });
        clientSocket.on("twoPeopleStartType", function(senderNick, receiverId, receiverSocketId){
            console.log("User " + senderNick + " is writing a message to id: "+ receiverId +" Socket id: "+receiverSocketId);
            //io.emit("userTypingInConUpdate", typingUsers);
            if (io.sockets.connected[receiverSocketId]) {
                io.sockets.connected[receiverSocketId].emit('twoPeopleTypingUpdate', 'for '+receiverSocketId+' only');
            }
            //io.emit("twoPeopleTypingUpdate", "chao moi nguoi");
        });


        clientSocket.on("startType", function(clientNickname){
            console.log("User " + clientNickname + " is writing a message...");
            typingUsers[clientNickname] = 1;
            io.emit("userTypingUpdate", typingUsers);
        });


        clientSocket.on("stopType", function(clientNickname){
            console.log("User " + clientNickname + " has stopped writing a message...");
            delete typingUsers[clientNickname];
            io.emit("userTypingUpdate", typingUsers);
        }); 
    });
}