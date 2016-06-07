"use strict"; 

const Discord = require('discord.js');
const uuid = require("node-uuid");

const Constants = require('./../../constants.js'); 

const Command   = require('./../Command.js');
//const Timer     = require('./../../util/timers.js');
const config    = require(Constants.Util.CONFIG);
const log = require(Constants.Util.LOGGER);
var timers = new Discord.Cache();

const timer = new Command('Generates a timed messages. Usage: `.timer add Name 0 Channel The Messsage` to add (change 0 to number of seconds). `.timer remove Name` to remove it. ', '', 2, null, (bot, msg, suffix) => {
    let parts = suffix.split(" "),
        timerName = parts[1];
//    log.info("Suffix: " + suffix + " , command: " + parts[0]);
    if(parts[0] === "add") {
        let seconds = parts[2],
            channelName = msg.server.channels.get("name", parts[3]),
            message = parts.slice(4).join(" ");
			let tmpTimer = setInterval(function() { 
				bot.sendMessage(channelName, message);
			}, seconds * 1000);
			let timerUUID = uuid.v4();
            let timertemp = {"id": timerUUID, "name": timerName, "interval": seconds, "channel": channelName, "timer" : tmpTimer};
            timers.add(timertemp);
			bot.sendMessage(channelName, "Timer **" + timerName + "** (*"+timerUUID+"*) ajouté. utilisez `.timer remove " + timerName + "` pour le supprimer.");
    } else if(parts[0] === "remove") {
        let timertemp = timers.get("name", timerName);
        if(timertemp) {
            clearInterval(timertemp.timer);
            timers.remove(timertemp);
    		bot.reply(msg, "Timer " + timerName + " a été supprimé.");
    		console.log("Cleared Timer: " + timerName);
        } else {
            bot.reply(msg, "Timer introuvable");
        }
    } else if (parts[0] === "list") {
        var timertxt = "";
        var timerlength = timers.length;
        if(timers.length > 0) {
            log.info("There are " + timerlength + " active timers.");
            for(let thisTimer of timers) {
                timertxt += thisTimer.name + " ";
            }
            bot.reply(msg, "Timers actifs présentement: " + timertxt);
        } else {
            bot.reply(msg, "Aucun timer actif en ce moment.")
        }
    } else {
        bot.reply(msg, "Commande pour `timer` non reconnue. Commandes supportées: `add`, `remove`, `list`");
    }

});

module.exports = timer;
