var mysql = require('mysql');
var pool  = null;
exports.connect = function() {
  pool = mysql.createPool({
    host     : 'us-cdbr-iron-east-04.cleardb.net',
    user     : 'baa3db16cc2425',
    password : '4fca09ee',
    database : 'heroku_de1b81149bad74b'
  });
}
exports.get = function() {
  return pool;
}