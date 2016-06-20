const moment = require('moment'),
      chalk  = require('chalk'),
      clk    = new chalk.constructor({enabled: true});

var http = require("http");
var express = require("express");
var logger = require("winston");
var winstonWS = require("winston-websocket");

//configure express
var app = express()
  .use(express.static("."));

//create http server
var server = http.createServer(app);

//register websocet transport
logger.add( winstonWS.WSTransport, { wsoptions: { server: server, path: './../logs' } });

//start server
server.listen(process.env.PORT, process.env.IP);
console.log("Server is listening on port 3000");

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
        logger.info(`${date()} ${green(message)}`);
    },
    command: (server, channel, username, command, suffix) => {
        server = server || "PM";
        logger.info(`${date()} ${cyan('[' + server + ']' + '(#' + channel + ')')} ${green(username)} -> ${magenta(command)} ${suffix}\n`);
    },
    error: (errorMessage) => {
        logger.error(`${date()} ${error(errorMessage)}`);
    },
    warn: (warnMessage) => {
        logger.warn(`${date()} ${warn(warnMessage)}`);
    },
    ban: (user, server) => {
        logger.info(`${date()} ${red(user)} was just banned from ${cyan('[' + server + ']')}`);
    },
    unban: (user, server) => {
        logger.info(`${date()} ${green(user)} was just unbanned from ${cyan('[' + server + ']')}`);
    },
    join: (server) => {
        logger.info(`${date()} Joined ${cyan('[' + server + ']')}`);
    },
    leave: (server) => {
        logger.info(`${date()} Left ${cyan('[' + server + ']')}`);
    }
};

