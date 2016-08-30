"use strict"; 

const Command   = require('./../Command.js');

const _get     = require('./get.js'),
      _set     = require('./set.js');
      
var commands = {
	"get"  : _get,
	"set"  : _set
};

var stringCommands = [];
for(let command in commands) {
    stringCommands.push('*' + command + '*');
}

const setting = new Command('Set bot configurations per server. Must be used from a server!', stringCommands.join(' | '), 2, commands, (bot, msg, suffix, conf) => {
	//Nothing to see here, move along.
});

module.exports = setting;
