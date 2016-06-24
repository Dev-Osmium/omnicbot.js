'use strict';

const r = require('rethinkdb');

var connection = null;
r.connect( {host: 'localhost', port: 28015, db: "omnic"}, function(err, conn) {
    if (err) throw err;
    connection = conn;
});

const Command   = require('./../Command.js');

const stats = new Command('Display Stats', '', 1, null, (bot, msg, suffix) => {

    r.table("stats").filter({server_id: msg.server.id}).orderBy(r.desc("max_online")).limit(1).run(connection, (e, results) => {
        results.toArray( (e, stats) => {
          if(stats[0] && stats[0].max_online) {
            global.top_users_online = stats[0].max_online;
            bot.reply(msg, `Il y a eu un maximum de ${global.top_users_online} utilisateurs en ligne. Présentement:\nEn ligne: ${stats[0].max_online} ; Sur Overwatch: ${stats[0].playing_ow} ; Groupes: ${stats[0].partial_groups}/${stats[0].full_groups} (Partiel/Complet)`);
          }
        });

    });
});

module.exports = stats;
