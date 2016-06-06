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
const reload = require("require-reload");

var globaltimers = [];

// Catch discord.js errors
bot.on('error', e => { log.error(e); });



bot.on("ready", () => {
	log.info("Prêt à servir dans " + bot.channels.length + " canaux sur " + bot.servers.length + " serveur.");
	for(let server of bot.servers) {
		let adminMembers = server.usersWithRole(server.roles.get("name", config.ownerRole));
		for(let admin of adminMembers) { 
			log.info(admin.username + " added to Admin list on " + server.name);
		}
		let modMembers = server.usersWithRole(server.roles.get("name", config.modRole));
		for (let mod of modMembers) {
			log.info(mod.username + " added to Mod list on " + server.name);
		}
	}
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
				var perm1 = msg.server.roles.get('name', 'Bot User');
				var perm2 = msg.server.roles.get('name', 'Bot Moderator');
				var perm3 = config.ownerId;
				
				userPermissionLevel = perm1 && bot.memberHasRole(msg.author, perm1) && userPermissionLevel < 1 ? 1 : userPermissionLevel;
				userPermissionLevel = perm2 && bot.memberHasRole(msg.author, perm2) && userPermissionLevel < 2 ? 2 : userPermissionLevel;
			}
			userPermissionLevel = msg.author.id == config.ownerId ? 3 : userPermissionLevel;
			
			if(cData.permissionLevel <= userPermissionLevel) {
				cData.handler(bot, msg, suffix);
				log.command(msg.server, (msg.channel.name || msg.channel.id), msg.author.username, command, suffix);
			}
			else
				bot.sendMessage(msg.channel, `**${username}**, you're not allowed to use \`${command}\``);
		}
	} 
});

/*
bot.on("serverNewMember", (server, user) => {
	console.log("Nouvel Utilisateur! " + user.username);
	var message = util.format(Settings.welcome.message, user.username);
	var messageRecipient = (Settings.welcome.inPrivate ? user : server.channels.get("name", Settings.welcome.channel));
	bot.sendMessage(messageRecipient, message);
	
	var milestoneStep = Settings.milestone.step;
	var milestoneMessage = Settings.milestone.message;
	if(server.members.length % milestoneStep == 0) {
		bot.sendMessage(server.defaultChannel, util.format(milestoneMessage, server.members.length));
	}
});*/

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