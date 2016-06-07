const Constants = require('./../constants.js'); 

const   about   = require('./admin/about.js'),
        timer   = require('./admin/timer.js'),
        echo    = require('./util/echo.js'),
        info    = require('./util/info.js'),
        play    = require('./util/play.js'),
        reload    = require('./admin/reload.js');


exports.aliases = {
    "who"           : "about",
    "youtube"       : "play"
};

exports.commands = { 
    "about"         : about,
    "echo"          : echo,
    "reload"        : reload,
    "info"          : info,
    "play"          : play,
    "timer"         : timer
};
