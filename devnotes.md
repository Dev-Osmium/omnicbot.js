1. Get node.js
2. install with `node install --save discord.js`
3. When the bot is running, make it join the server. Go to: 
	https://discordapp.com/oauth2/authorize?&client_id=YOURID&scope=bot  (YOURID found in the *My Applications* page of the Developer section of Discord App)
4. It's safe to stop the node.js process without disconnecting/closing the bot first. 


// save JSON string "pretty", \t is tab indentation
JSON.stringify(toStringify, null, "\t")



function getparams(suffix, num, separator) { 
	var params = [];
	parts = suffix.split(separator);
	for (i=0; i < num; i++) params[i] = parts[i];
	param[num+1] = suffix.split(num).join(" ");
	return params;
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