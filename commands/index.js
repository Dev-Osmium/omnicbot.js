const Constants = require('./../constants.js'); 

const   about   = require('./admin/about.js'),
        echo    = require('./util/echo.js');


exports.aliases = {
    "who"           : "about"
};

exports.commands = { 
    "about"         : about,
    "echo"          : echo
};
