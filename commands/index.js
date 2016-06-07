const Constants = require('./../constants.js'); 

const   about   = require('./admin/about.js'),
        timer   = require('./admin/timer.js'),
        echo    = require('./util/echo.js'),
        info    = require('./util/info.js'),
        reload    = require('./admin/reload.js');


exports.aliases = {
    "who"           : "about"
};

exports.commands = { 
    "about"         : about,
    "echo"          : echo,
    "reload"        : reload,
    "info"          : info,
    "timer"         : timer
};
