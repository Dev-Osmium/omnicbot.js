"use strict"; 

const moment		= require('moment');
moment.locale('fr');
const r = require('rethinkdb');

const Command   = require('./../Command.js');


var connection = null;
r.connect( {host: 'localhost', port: 28015, db: "omnic"}, function(err, conn) {
    if (err) throw err;
    connection = conn;
});

const lastseen = new Command('Retrieves Battle.net Info + MasterOverwatch Profile Link.', '', 0, null, (bot, msg, suffix, conf) => {
    moment.locale(conf.lang);
    console.log("language is : " + conf.lang);
    if(msg.mentions.length > 0) {
        for(let user of msg.mentions) {
            if(user.status === 'offline') {
              	r.table("users").get(user.id).run(connection, (e, c) => {
              	  if(e) console.log(e);
              	  else {
              	      if(c) bot.reply(msg, `La dernière fois que j'ai vu ${bot.users.get(user.id).username} était: ${moment(c.last_seen).fromNow()}`);
              	      else bot.reply(msg, `Aucune information n'est disponible pour cette utilisateur.`);
              	  }
            	  });
            } else bot.reply(msg, `La dernière fois que j'ai vu ${bot.users.get(user.id).username} était: **maintenant**`);
        }
    } else bot.reply(msg, "Aucun membre spécifié. Utilisez un @mention pour rechercher: `.lastseen @LuckyEvie`");
});

module.exports = lastseen;
