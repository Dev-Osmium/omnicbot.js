'use strict';

const Discord   = require('discord.js');
const r = require('rethinkdb');

var connection = null;
r.connect( {host: 'localhost', port: 28015, db: "omnic"}, function(err, conn) {
    if (err) throw err;
    connection = conn;
});

const Command   = require('./../Command.js');

const stats = new Command('Display Stats', '', 1, null, (bot, msg, suffix) => {
	  let query = {ts_stat:  r.now(), "server_id": msg.server.id, "max_users": 0, "playing_ow": 0, "max_online": 0, "partial_groups": 0, "full_groups": 0};
		query.max_users = msg.server.members.length;
		query.playing_ow = msg.server.members.filter(m=> m.game&&m.game.name==="Overwatch").length;
		let max_online = msg.server.members.filter(m => m.status !== "offline").length;
		query.max_online = max_online;
		if(max_online > GLOBAL) GLOBAL.top_users_online = max_online;
		let voiceChans = msg.server.channels.filter(c => c instanceof Discord.VoiceChannel&&c.name!="Absent - AFK");
		query.full_groups = voiceChans.filter(c=>c.members.length > 5).length;
		query.partial_groups = voiceChans.filter(c=>c.members.length<6&&c.members.length>0).length;

    bot.reply(msg, `Il y a eu un maximum de ${global.top_users_online} utilisateurs en ligne. Présentement:\nEn ligne: ${query.max_online} ; Sur Overwatch: ${query.playing_ow} ; Groupes: ${query.partial_groups}/${query.full_groups} (Partiel/Complet)`);
});

module.exports = stats;
