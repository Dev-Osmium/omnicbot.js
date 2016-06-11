"use strict"; 

const Discord = require('discord.js'),
	  bot     = new Discord.Client({forceFetchUsers: true, autoReconnect: true, guildCreateTimeout: 2000});

// Get DB and logger paths
const Constants = require('./constants.js');
const config = require(Constants.Util.CONFIG);
const log = require(Constants.Util.LOGGER);

// Database stuff
const db           = require('./util/dbcheck.js');
// Load all the commands + aliases
const commands = require('./commands/index.js').commands,
	  aliases  = require('./commands/index.js').aliases;

// get String Formatting from this (util.format)
const util = require( "util" );
var newusers = new Discord.Cache();
//var serverSettings = db.serverSettings();

// Catch discord.js errors
bot.on('error', e => { log.error(e); });

bot.on("ready", () => {
	log.info("Prêt à servir dans " + bot.channels.length + " canaux sur " + bot.servers.length + " serveur.");

	/*for(let server of bot.servers) {
		if (!serverSettings[server.id]) {
			log.warn(`Server ${server.name} not setup!`);
		}
	}
	for(let server of bot.servers) {
		let adminMembers = server.usersWithRole(server.roles.get("name", config.ownerRole));
		for(let admin of adminMembers) { 
			log.info(admin.username + " added to Admin list on " + server.name);
		}
		let modMembers = server.usersWithRole(server.roles.get("name", config.modRole));
		for (let mod of modMembers) {
			log.info(mod.username + " added to Mod list on " + server.name);
		}
	}*/
});

//when the bot disconnects
bot.on("disconnected", () => {
	//alert the console
	log.warn('Disconnected'); 
});

/* Message handling */
bot.on('message', msg => {
	//Ignore if msg is from self or bot account
	if(msg.author.id == bot.user.id || msg.author.bot) return;
	
	if(msg.server)
		db.createServer(msg.server);
		
	if(msg.content.startsWith(config.prefix)) {
		var command  = msg.content.substring(config.prefix.length).split(" ")[0].toLowerCase();
		var suffix   = msg.content.substring(command.length + 2).trim();
		var username = msg.server && msg.server.detailsOf(msg.author).nick ? msg.server.detailsOf(msg.author).nick : msg.author.username;
		
		// Set alias to command if there is one
		command = aliases[command] || command;
		
		//If command found
		if(commands[command]) {
			var cData = commands[command];
			
			//Sub commands
			if(commands[command].inheritance && suffix) {
				var inCommand = suffix.split(" ")[0].toLowerCase();
				if(commands[command].inheritance[inCommand]) {
					cData = commands[command].inheritance[inCommand];
				}
			}

			var userPermissionLevel = 0;
			if(msg.server) {
				var userRoles = msg.server.rolesOf(msg.author);
				var perm1 = msg.server.roles.get('name', 'Modérateur');
				var perm2 = msg.server.roles.get('name', 'Administrateur');
				var perm3 = config.ownerId;
				
				//log.warn(perm1 + " ; " + perm2 + " ; " + perm3);

				userPermissionLevel = perm1 && bot.memberHasRole(msg.author, perm1) && userPermissionLevel < 1 ? 1 : userPermissionLevel;
				userPermissionLevel = perm2 && bot.memberHasRole(msg.author, perm2) && userPermissionLevel < 2 ? 2 : userPermissionLevel;
			}
			userPermissionLevel = msg.author.id == perm3 ? 3 : userPermissionLevel;
			
			if(cData.permissionLevel <= userPermissionLevel) {
				cData.handler(bot, msg, suffix);
				log.command(msg.server, (msg.channel.name || msg.channel.id), msg.author.username, command, suffix);
			}
			else
				bot.sendMessage(msg.channel, `**${username}**, vous n'êtes pas authorisé à utiliser la commande \`${command}\``);
		}
		//bot.deleteMessage(msg);
	} 
});

// Custom Code for streaming users! 
/*

bot.on("presence", (o, n) => (n.game && n.game.name === "Overwatch" && n.game.url ? bot.addMemberToRole : o && o.game === "Overwatch" && o.game.url ? bot.removeRoleFromMember : () => {})(o, JSON.stringify(o.game) !== JSON.stringify(n.game) && "streamer role ID"));
bot.on("presence", (o, n) => bot[n.game && n.game.name === "Overwatch" && n.game.url ? "addMemberToRole" : "removeMemberFromRole"](n, overwatchRole));


bot.on("presence", (o, n) => bot[n.game && n.game.name === "Overwatch" && n.game.url ? "addMemberToRole" : "removeMemberFromRole"](n, bot.servers.find(s => s.members.get("id", n.id) && s.roles.get("name", overwatchServerRoleMap[s.id])).roles.get(overwatchServerRoleMap[s.id])));
where overwatchServerRoleMap is a map where {"serverID": "roleID"}

var streamingusers = [];
bot.on("presence", (userold, usernew) => {
	if(userold.game === usernew.game) return;

	if(usernew.game && usernew.game.type == 1 && usernew.game.name.indexOf("Overwatch") > -1) {
		for(let server of bot.servers) {
			let role = server.roles.get("name", "En Ondes");
			if(role) {
				bot.addMemberToRole(usernew, role, (err) => {
					if (err)
						log.error(`Could not add Streamer to server role on ${server.name} because of:\n${err}`);
				});
			}
		}
		streamingusers.push(usernew.id);
	} else if (streamingusers.indexOf(usernew.id)) {
		for(let server of bot.servers) {
			let role = server.roles.get("name", "En Ondes");
			bot.removeMemberFromRole(usernew, role);
			streamingusers.splice(streamingusers.indexOf(usernew.id), 1);
		}
	}
});*/

bot.on('raw', (event) => {
  if(event.t === "PRESENCE_UPDATE") { 
	  	let server = bot.servers.get("id", event.d.guild_id),
	  		member = server.members.get("id", event.d.user.id),
	  		role = server.roles.get("name", "En Ondes");
	  if(!role) { 
	  	log.error(`Role was not found when attempting to upgrade Streamer user on ${server.name}`);
	  	return;
	  }
  	if(event.d.game && event.d.game.type == 1 && event.d.game.name.indexOf("Overwatch") > -1) {
	  	bot.addMemberToRole(member, role, (err) => {
			if (err)
				log.error(`Could not add Streamer to server role on ${server.name} because of:\n${err}`);
		});
	  	log.info(`${member.name} has started streaming on ${event.d.game.url}`);
  	} else {
  		bot.removeMemberFromRole(member, role);
  	}
  }
});


bot.on("serverNewMember", (server, user) => {
	log.info("Nouvel Utilisateur! " + user.username);
	
	var message = util.format(config.welcome.message, user.username);
	var messageRecipient = (config.welcome.inPrivate ? user : server.channels.get("name", config.welcome.channel));
	bot.sendMessage(messageRecipient, message);

	newusers.add(user);
	log.info(newusers.length + " new users in buffer");

	if(newusers.length >= 10) {
		var userlist = [];
		for(let user of newusers) {
			userlist.push(user.mention());
			newusers.remove(user);
		}
		bot.sendMessage(server.defaultChannel, `Souhaitez la bienvenue à nos plus récents membres!\n ${userlist.join(", ")}`);
	}

	var milestoneStep = config.milestone.step;
	var milestoneMessage = config.milestone.message;
	if(server.members.length % milestoneStep == 0) {
		bot.sendMessage(server.defaultChannel, util.format(milestoneMessage, server.members.length));
	}
});

bot.loginWithToken(config.discordToken);

process.on('SIGINT', () => {
    setTimeout(() => {
        process.exit(1);
    }, 5000);
    console.log("Logging out.");
    bot.setStatus("offline", null);
    bot.logout(()=> {
        console.log("Bye");
        process.exit(0);
    });
});