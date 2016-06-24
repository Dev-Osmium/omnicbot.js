"use strict"; 

const Command   = require('./../Command.js');

function getparams(suffix, num, separator) { 
	let params = [];
	let parts = suffix.split(separator);
	for (let i=0; i < num; i++) params[i] = parts[i];
	params[num] = parts.slice(num).join(" ");
	return params;
}

const timer = new Command('Generates a timed messages. Usage: `.timer add Name 0 Channel The Messsage` to add (change 0 to number of seconds). `.timer remove Name Channel` to remove it. ', '', 2, null, (bot, msg, suffix) => {
  var timers = require('./../../util/timers.js')(bot);
  let command = suffix.split(" ")[0];

  if(command === "add") {
    let params = getparams(suffix, 4, " ");
    console.log(params.join(";"));
    if( timers.add(params[1], params[2], params[4], msg.server.channels.get("name", params[3]).id) ) {
      bot.sendMessage(msg.channel, "Timer **" + params[1] + "** ajouté. utilisez `.timer remove " + params[1] + " " + params[3] + "` pour le supprimer.");
    } else {
      bot.reply(msg, "Erreur lors de l'addition du timer. Voir log.");
    }
  } else
  
  if(command === "del") {
    let params = getparams(suffix, 4, " ");
    if( timers.remove(params[1], msg.server.channels.get("name", params[3]).id)) {
      bot.reply(msg, "Timer " + params[1] + " a été supprimé.");
    } else {
      bot.reply(msg, `Erreur lors de la suppression du timer. Voir log.`);
    }

  } else {
    bot.reply(msg, "Commande pour `timer` non reconnue. Commandes supportées: `add`, `del`");
  }
});
module.exports = timer;
