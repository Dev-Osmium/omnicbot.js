'use strict';

const Discord   = require('discord.js');
const Constants = require('./../../constants.js'); 
const Command   = require('./../Command.js');
const config    = require(Constants.Util.CONFIG);
const knex      = require('knex')(config.pgconf);

const tags      = new Discord.Cache();


// On Bootup, load all tags.
knex.select().table('tags')
.then( (rows) => {
	for(let row of rows) {
	    tags.add(row);
	}
	console.log(`Loaded a total of ${rows.length} tags from the database`);
});

const tag = new Command('Displays specific text messages.', '', 0, null, (bot, msg, suffix) => {
  if(!suffix) {
    let servertags = tags.filter(t => t.server === msg.server.id);
    bot.reply(msg, `Utilisez \`!info nomDuTag\` pour appeler un des tag suivants.\nTags disponibles: ${servertags.map(t=>t.tag).join(", ")}`);
    return;
  }
  
  let params = suffix.split(" ");
  
  if(params[0] === "add"){
    let tagname  = params[1],
        contents = params.slice(2).join(" "),
        serverid = msg.server.id,
        userid   = msg.author.id;
    let query = {"tag": tagname, "description": contents, "server": serverid, "added_by": userid};
		knex.insert(query, 'id').into('tags')
		.catch( (error) => {
			console.log(error);
		})
		.then( (id) => {
      console.log(`Ajout du tag ${tagname} par ${msg.author.name}\n${contents}`);
      query.id = msg.id;
      tags.add(query);
      bot.reply(msg, `Le tag ${tagname} a été ajouté.`);
		});
  } else
  
  if(params[0] === "del") {
    let tagname  = params[1],
        serverid = msg.server.id;
    knex.select("*").table("tags").where({ "tag": tagname, "server": serverid}).limit(1)
    .then( rows => {
        knex('tags').where('id', rows[0].id).del();
        let delTag = tags.filter(t => t.tag ===tagname&&t.server===serverid);
        tags.remove(delTag);
        bot.reply(msg, `Le tag ${tagname} a été supprimé. Beuh-Bye!.`);
    });
  } else {
    let tagname  = params[0],
        serverid = msg.server.id;
    let myTag = tags.filter(t => (t.tag ===tagname&&t.server===serverid))[0];
    if(!myTag) {
      bot.reply(msg, `Le tag ${tagname} n'a pas été trouvé. Faire \`.info\` pour une liste de tags.`);
    }
    bot.sendMessage(msg, "" + myTag.description);
  }
});

module.exports = tag;
