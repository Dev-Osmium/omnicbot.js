"use strict"; 

const Discord = require('discord.js');
const uuid = require("node-uuid");
const moment = require("moment");

const Constants = require('../constants.js'); 

const config    = require(Constants.Util.CONFIG);
const log = require(Constants.Util.LOGGER);

const r = require('rethinkdb');

var connection = null;
r.connect( {host: 'localhost', port: 28015, db: "omnic"}, function(err, conn) {
    if (err) throw err;
    connection = conn;
});

var timers = new Discord.Cache();

module.exports = function(bot){
  var module = {};

  module.add = function(name, interval, message, channel) {
      
    let timerUUID = uuid.v4();
    
    let tmpTimer = setInterval(function() { 
    	bot.sendMessage(channel, message);
    }, interval * 1000);
    let timertemp = {"id": timerUUID, "name": name, "interval": interval, "channel": channel, "timer" : tmpTimer};
    
    timers.add(timertemp);
    
    let query = {name: name, message: message, channel: channel, interval: interval};
    r.table("tags").insert(query).run(connection, (e, c) => {
      if(e) {
        log.error(e);
        return false;
      } else {
		  log.info("Timer Added, query: " + JSON.stringify(c));	
		  return true;
        
      }
    });
  };

  module.stop = function(name, channel) {


    r.table("timers").filter({name: name, channel: channel}).run(connection, (e, results) => {
        results.toArray( (e, timers) => {
          if(timers[0] && timers[0].tag) {
            let stopTimer = timers.filter(t => timers[0].name===name&&timers[0].channel===channel);
            log.info(JSON.parse(stopTimer))
            if(!stopTimer.name) return false;
            return true;
          }
          else {
            return false;
          }
        });

    });

  };
  
  module.loadall = function() {
    r.table('timers').run(connection, (error, rows) => {
      rows.toArray( (e, tags) => {
      
      rows.map(t => {
        let timerChannel = bot.channels.get("id", t.channel);
        let message = t.message;
        let interval = t.interval;
        let tmpTimer = setInterval(function() { 
        	bot.sendMessage(timerChannel, message);
        }, interval * 1000);
        
        let query = {"id": t.id, "name": t.name, "interval": t.interval, "channel": t.channel, "timer" : tmpTimer};
		    bot.sendMessage("189542410622205952", `Timer ${t.name} a été rétabli après un redémarrage du bot.`);
        timers.add(query);
      });
    });
  });

};

return module;
};