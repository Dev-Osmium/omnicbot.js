"use strict"; 

const Constants = require('./../../constants.js'); 

const Command   = require('./../Command.js');
const Timer     = require('./../../util/timers.js');
const config    = require(Constants.Util.CONFIG);
const log = require(Constants.Util.LOGGER);
var globaltimers = {};

const timer = new Command('Generates a timed messages. Usage: `.timer add Name 0 Channel The Messsage` to add (change 0 to number of seconds). `.timer remove Name` to remove it. ', '', 2, null, (bot, msg, suffix) => {
    let parts = suffix.split(" "),
        timerName = parts[1];
    if(parts[0] === "add") {
        let seconds = parts[2],
            channelName = msg.server.channels.get("name", parts[3]),
            message = parts.slice(4).join(" ");
			globaltimers[timerName] = setInterval(function() { 
				bot.sendMessage(channelName, message);
			}, seconds * 1000);
			bot.sendMessage(channelName, "Timer **" + timerName + "** has been added. Use `.timer remove " + timerName + "` to cancel it.");
    } else if(parts[0] === "remove") {
        clearInterval(globaltimers[timerName]);
		bot.reply("Timer " + timerName + " has been canceled.");
		console.log("Cleared Timer: " + timerName);
    } else if (parts[0] === "list") {
        var timers;
        log.info("There are " + globaltimers.length + " active timers.");
        for(timer of globaltimers) timers += timer;
        bot.reply("Current active timers: " + timers);
    } else {
        bot.reply("Timer Command Not Recognized!");
    }

});

module.exports = timer;
