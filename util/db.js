const r = require('rethinkdb');
var connection = null;

exports.init = function(callback) {
  if(connection) {
    callback(null, r, connection);
  } else {
    r.connect( {host: 'localhost', port: 28015, db: "omnic"}, function(err, conn) {
        connection = conn;
        callback(err, r, conn);
    });
  }
};