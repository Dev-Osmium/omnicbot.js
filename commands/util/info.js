'use strict';

const Command   = require('./../Command.js');

/*
// Translation stuff
const I18n = require("./util/i18n.js");
const bundle = [];
bundle["fr"] = require("./lang/fr.json");
const langsetup = {};
langsetup.fr = {"locale": "fr-CA", "defaultCurrency": "CAD", "messageBundle": bundle["fr"]};
langsetup.en = {"locale": "en-US", "defaultCurrency": "USD", "messageBundle": bundle["en"]};
*/

var r = null, conn = null;
require("./../../util/db.js").init( (err, redb, connection) => {
	if(err) console.log(err);
	r = redb;
	conn = connection;
});

const tag = new Command('Displays specific text messages.', '', 0, null, (bot, msg, suffix, conf, perm) => {
  //console.log(`User permission level is: ${perm}`);
  if(!suffix) {
  	r.table("tags").filter({server: msg.server.id}).run(conn, (e, c) => {
  	  if(e) {
  	    console.log(e);
  	  } else {
  	    c.toArray( (e, results) => {
      	  bot.reply(msg, `Utilisez \`.tag nomDuTag\` pour appeler un des tag suivants.\nTags disponibles: ${results.map(t=>t.tag).join(", ")}`);
  	      //console.log(JSON.stringify(results));
  	    });
  	  }
	  });
    return;
  }
  
  let params = suffix.split(" ");
  
  if(params[0] === "add"){
    if(perm <= 0) {
      bot.reply(msg, "Commande non authorisée: .tag add");
      return;
    }
    let tagname  = params[1],
        contents = params.slice(2).join(" "),
        serverid = msg.server.id,
        userid   = msg.author.id;
    let query = {tag: tagname, contents: contents, server: serverid, user: userid};
    r.table("tags").insert(query).run(conn, (e, c) => {
      if(e) {
        bot.reply(msg, `Une erreur s'est produite. Oops... \n${e}`);
      } else {
        bot.reply(msg, `Le tag ${tagname} a été ajouté.`);
      }
    });
    
  } else
  
  if(params[0] === "del") {
    if(perm <= 1) {
      bot.reply(msg, "Commande non authorisée: .tag del");
      return;
    } else {
      let tagname  = params[1],
          serverid = msg.server.id;
      //console.log(`Attempting to delete tag ${tagname} from ${serverid}`);
      r.table("tags").filter({tag: tagname, server: serverid}).delete().run(conn, (e, resp) => {
        if(e) {
          bot.reply(msg, `Une erreur s'est produite. Oops... \n${e}`);
        } else if(resp.deleted === 1) {
          bot.reply(msg, `Le tag ${tagname} a été supprimé.`);
        } else {
          bot.reply(msg, `Quelque chose d'innatendu s'est produite! Vas voir la console, boss!...`);
          //console.log(JSON.stringify(resp));
        }
      });
    }

  } else {
    let tagname  = params[0],
        serverid = msg.server.id;
    r.table("tags").filter({tag: tagname, server: serverid}).run(conn, (e, results) => {
        results.toArray( (e, tags) => {
          if(tags[0] && tags[0].tag) {
            bot.sendMessage(msg, "" + tags[0].contents);
          }
          else {
            bot.reply(msg, `Le tag est introuvable. Utilisez \`.tag\` pour une liste de tags.`);
          }
        });

    });
  }
  bot.deleteMessage(msg);
});

module.exports = tag;
