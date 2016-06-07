'use strict';

class Timer {
    constructor(name, interval, server, channel, message, timerobject) {
        this.name            = name;
        this.interval        = interval;
        this.server          = server;
        this.channel         = channel;
        this.message         = message;
        this.timer           = timerobject;
    }
}

module.exports = Timer;
