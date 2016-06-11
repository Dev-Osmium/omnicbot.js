"use strict"; 

const Constants = require('./../../constants.js'); 
const moment		= require('moment');
moment.locale("fr");

const Command   = require('./../Command.js');
const config    = require(Constants.Util.CONFIG);

const userlist = new Command('Gets a filtered list of users with certain predefined filters.', '', 2, null, (bot, msg, suffix) => {
	// .userlist 24 hours
	if(suffix) {
		let parts = suffix.split(" "),
			interval = parts[0],
			period = parts[1],
			backto = moment().locale("fr").subtract(interval, period);
		
		if(parts[2] === "-i") {
			
		}
		
		let results = msg.server.members.filter(function(member) {
			var joinTime = msg.server.detailsOfUser(member).joinedAt;
			return moment(joinTime) > moment(backto);
		});
		
		if(parts[2] === "-l") {
			bot.sendMessage(msg, `Il y a eu **${results.length}** nouveaux membres qui ont rejoint le serveur depuis **${interval} ${period}**:`);
			let msgString = "";
			for(let user of results) {
				msgString += user.username + " ; ";
			}

			bot.sendMessage(msg, msgString);
		} else {
			bot.reply(msg, `Il y a eu **${results.length}** nouveaux membres qui ont rejoint le serveur depuis **${interval} ${period}**. Pour les voir, ajoute -l à la fin de la commande.`);
		}
		
	}
});

module.exports = userlist;
