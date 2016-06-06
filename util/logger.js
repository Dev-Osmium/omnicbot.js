const moment = require('moment'),
      chalk  = require('chalk'),
      clk    = new chalk.constructor({enabled: true});
      
// Define the colors
var cyan = clk.bold.cyan,
    green   = clk.bold.green,
    error   = clk.bgRed.black,
    blue    = clk.bold.blue,
    warn    = clk.bgYellow.black,
    magenta = clk.bold.magenta,
    red     = clk.bold.red;

var date = () => {
    return '[' + moment().format('DD.MM HH:mm:ss') + ']';
};

module.exports = {
    info: (message) => {
        console.log(`${date()} ${green(message)}`);
    },
    command: (server, channel, username, command, suffix) => {
        server = server || "PM";
        console.log(`${date()} ${cyan('[' + server + ']' + '(#' + channel + ')')} ${green(username)} -> ${magenta(command)} ${suffix}\n`);
    },
    error: (errorMessage) => {
        console.log(`${date()} ${error(errorMessage)}`);
    },
    warn: (warnMessage) => {
        console.log(`${date()} ${warn(warnMessage)}`);
    },
    ban: (user, server) => {
        console.log(`${date()} ${red(user)} was just banned from ${cyan('[' + server + ']')}`);
    },
    unban: (user, server) => {
        console.log(`${date()} ${green(user)} was just unbanned from ${cyan('[' + server + ']')}`);
    },
    join: (server) => {
        console.log(`${date()} Joined ${cyan('[' + server + ']')}`);
    },
    leave: (server) => {
        console.log(`${date()} Left ${cyan('[' + server + ']')}`);
    }
};