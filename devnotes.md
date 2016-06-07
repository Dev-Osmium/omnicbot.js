1. Get node.js
2. install with `node install --save discord.js`
3. When the bot is running, make it join the server. Go to: 
	https://discordapp.com/oauth2/authorize?&client_id=YOURID&scope=bot  (YOURID found in the *My Applications* page of the Developer section of Discord App)
4. It's safe to stop the node.js process without disconnecting/closing the bot first. 


// save JSON string "pretty", \t is tab indentation
JSON.stringify(toStringify, null, "\t")



	"loop": {
		"message": "Attention à tous, ceci est un message répété aux 2 minutes parce que ça me tente pis fuck you that's why. - OMNIC",
		"minutes": 2
	}






	/*
    var acceptedcommands = [".echo", ".invite", ".serverinfo", ".logout", ".fakeuser", ".newname", ".setowner", ".setmod", ".prune", ".addTimer", ".removeTimer", ".tts"];
    var thiscommand = msg.content.split(" ")[0];
	if(msg.content.startsWith(".") && acceptedcommands.indexOf(thiscommand) >= 0) {

		var returnChannel = msg.server.defaultChannel;
		console.log("Message received: " + msg.content);
		if( (ownerUser && msg.author.id !== ownerUser.id) && ( modUser && msg.author.id !== modUser.id) )  {
			bot.reply(msg, "Vous n'êtes pas authorisé à utiliser cette commande.");
	        console.log(msg.author.name + " a tenté d'utiliser la commande: " + msg.content);
		} else {
		
			if( msg.content.startsWith(".tts")) {
				bot.replyTTS( msg, msg.content.substr(msg.content.indexOf(' ')+1));
			}


			if( msg.content.startsWith(".serverinfo")) {
				var command = msg.content.split(" ")[1];
				var reply = "";

				var serverinfo = msg.server;

				if(serverinfo[command] !== null) {
					reply = serverinfo[command];
				}

				if(command === "usercount") {
					reply = "Il y a " + msg.server.members.length + " members on this server.";
				}

				bot.reply(msg, reply);
			}

			if( msg.content.startsWith(".logout")) {
				console.log("Logging Out");
				bot.sendMessage(returnChannel, "Bon c'est chill, je m'en vais on veut pas de moi!");
				bot.logout(()=> {
					console.log("Bye");
					process.exit(0);
				});
			}

			if ( msg.content.startsWith(".fakeuser")) {
				bot.emit('serverNewMember', bot.servers[0], bot.user);
			}

			if (msg.content.startsWith(".newname")) {
				var newname = msg.content.split(" ")[1];
				bot.setNickname(msg.channel.server, newname);
				console.log ("Surnom changé pour : " + newname);
			}

			if(msg.content.startsWith(".setowner")) {
				var ownername = msg.content.split(" ")[1];
				bot.sendMessage(returnChannel, "Le propriétaire de ce bot est maintenant : " + bot.users.get("username", ownername).mention());
				ownerUser = bot.users.get("username", ownername);
			}

			if(msg.content.startsWith(".setmod")) {
				var modname = msg.content.split(" ")[1];
				bot.sendMessage(returnChannel, "Le Modérateur de ce bot est maintenant : " + bot.users.get("username", modname).mention());
				ownerUser = bot.users.get("username", modname);
			}

			if(msg.content.startsWith(".prune")) {
				var msgcount = msg.content.split(" ")[1];
                bot.getChannelLogs(msg.channel, msgcount+1, (err, messages) => {
                    bot.deleteMessages(messages);
                    if(err) {
                    	console.log(err);
                    }
                });
			}
			
		}
	}
	*/