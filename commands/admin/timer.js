"use strict"; 

const Constants = require('./../../constants.js'); 

const Command   = require('./../Command.js');
//const Timer     = require('./../../util/timers.js');
const config    = require(Constants.Util.CONFIG);
const log = require(Constants.Util.LOGGER);
const Discord = require('discord.js');
var timers = new Discord.Cache();

const timer = new Command('Generates a timed messages. Usage: `.timer add Name 0 Channel The Messsage` to add (change 0 to number of seconds). `.timer remove Name` to remove it. ', '', 2, null, (bot, msg, suffix) => {
    let parts = suffix.split(" "),
        timerName = parts[1];
    log.info("Suffix: " + suffix + " , command: " + parts[0]);
    if(parts[0] === "add") {
        let seconds = parts[2],
            channelName = msg.server.channels.get("name", parts[3]),
            message = parts.slice(4).join(" ");
			let tmpTimer = setInterval(function() { 
				bot.sendMessage(channelName, message);
			}, seconds * 1000);
            let timertemp = {"name": timerName, "interval": seconds, "channel": channelName, "id" : tmpTimer};
            timers.add(timertemp);
			bot.sendMessage(channelName, "Timer **" + timerName + "** has been added. Use `.timer remove " + timerName + "` to cancel it.");
    } else if(parts[0] === "remove") {
        let timertemp = timers.get("name", timerName);
        if(timertemp) {
            clearInterval(timertemp.id);
            timers.remove(timertemp);
    		bot.reply("Timer " + timerName + " has been canceled.", console.log);
    		console.log("Cleared Timer: " + timerName);
        } else {
            bot.reply("Timer not found");
        }
    } else if (parts[0] === "list") {
        var timertxt;
        var timerlength = timers.length;
        log.info("There are " + timerlength + " active timers.");
        for(let thisTimer in timers) {
            timertxt += thisTimer.name;
        }
        bot.reply("Current active timers: " + timertxt, console.log);
    } else {
        bot.reply("Timer Command Not Recognized!", console.log);
    }

});

module.exports = timer;
