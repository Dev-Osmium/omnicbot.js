"use strict"; 

const Discord = require('discord.js');
const Constants = require('./../../constants.js'); 

const Command   = require('./../Command.js');
const config    = require(Constants.Util.CONFIG);
const knex = require('knex')(config.pgconf);

function getparams(suffix, num, separator) { 
	let params = [];
	let parts = suffix.split(separator);
	for (let i=0; i < num; i++) params[i] = parts[i];
	params[num] = parts.slice(num).join(" ");
	return params;
}

const timer = new Command('Generates a timed messages. Usage: `.timer add Name 0 Channel The Messsage` to add (change 0 to number of seconds). `.timer remove Name` to remove it. ', '', 2, null, (bot, msg, suffix) => {
    //let params = suffix.split(" ");
    let params = getparams(suffix, 4, " ");
    //console.log(`Timer command: ${params[0]}`); // timer ${params[1]}
    console.log(params.join(";"));
    var timers = require('./../../util/timers.js')(bot);

    if(params[0] === 'add') {
        if( timers.add(params[1], params[2], params[4], msg.server.channels.get("name", params[3]).id) ) {
            bot.sendMessage(msg.channel, "Timer **" + params[1] + "** ajouté. utilisez `.timer remove " + params[1] + " " + params[3] + "` pour le supprimer.");
        }
    } else if (params[0] === 'remove') {
        if( timers.remove(params[1], msg.server.channels.get("name", params[3]).id)) {
            bot.reply(msg, "Timer " + params[1] + " a été supprimé.");
        }
    }

/*    let parts = suffix.split(" "),
        timerName = parts[1];
//    log.info("Suffix: " + suffix + " , command: " + parts[0]);
    if(parts[0] === "add") {
        let seconds = parts[2],
            channelName = msg.server.channels.get("name", parts[3]),
            message = parts.slice(4).join(" ");
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

*/
});
module.exports = timer;
