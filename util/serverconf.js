var r = null, conn = null;
require("./db.js").init( (err, redb, connection) => {
	if(err) console.log(err);
	r = redb;
	conn = connection;
});

var serverconf = new Map();

exports.init = (bot, callback) => {
  if(serverconf.size > 0) {
    return serverconf;
  }
	for(let server of bot.servers) {
  	try {
      r.table("servers").get(server.id).run(conn, (e, resp) => {
        if(e) console.error(`Une erreur s'est produite. Oops... \n${e}`);
        serverconf.set(server.id, resp);
      });
  	} catch (e) {
  		console.error(e);
  		var query = {id: server.id, name: server.name, private_welcome: false, prefix: "|", lang: "en", stats: false, welcome_count: false, admin_role: null, mod_role: null, streaming_role: false};
  		r.table("servers").insert(query).run(conn, (e, resp) => {
  			if(e) console.error(e);
  			serverconf.set(server.id, query);
  		});
  	}
  }
  setTimeout(() => {callback(serverconf)}, 1000);
};

exports.get = (serverid) => {
  if(serverconf.has(serverid)) {
    return serverconf.get(serverid);
  } else {
    return null;
  }
};

exports.set = (serverid, key, value, callback) => {
  if(!serverconf.has(serverid)) {
    let err = `Server ${serverid} not found while trying to set the ${key} conf value to ${value}`;
    console.error(err);
    callback(err);
    return;
  }
  var thisconf = serverconf.get(serverid);
  if(!(key in thisconf)) {
    let err = `The key ${key} was not found in the configuration for the server ${serverid}.`;
    console.error(err);
    callback(err);
    return;
  }
  thisconf[key] = value;
  serverconf.set(serverid, thisconf);
  var query = {};
  query[key] = value;
  r.table("servers").get(serverid).update(query).run(conn, (e, resp) => {
    if(e) console.log(e);
    callback(e);
  });
};