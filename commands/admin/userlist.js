"use strict"; 

const Constants = require('./../../constants.js'); 
const moment		= require('moment');

const Command   = require('./../Command.js');
const config    = require(Constants.Util.CONFIG);

const userlist = new Command('Gets a filtered list of users with certain predefined filters.', '', 2, null, (bot, msg, suffix) => {
	// .userlist 24 hours
	if(suffix) {
		let parts = suffix.split(" "),
			interval = parts[0],
			period = parts[1],
			backto = moment().subtract(interval, period);
		
		let results = msg.server.members.filter(function(member) {
			var joinTime = msg.server.detailsOfUser(member).joinedAt;
			return moment(joinTime) > moment(backto);
		});
		
		if(parts[2] === "-l") {
			bot.sendMessage(msg, "There have been " + results.length + " new users in the last " + interval + " " + period + ". Here they are: ");
			let msgString = "";
			for(let user of results) {
				msgString += user.username + " ; ";
			}

			bot.sendMessage(msg, msgString);
		} else {
			bot.reply(msg, "There have been " + results.length + " new users in the last " + interval + " " + period + ". To see them all, append -l to your query.");
		}
		
	}
});

module.exports = userlist;
