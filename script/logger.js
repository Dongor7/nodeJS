const log4js = require('log4js');

log4js.configure({
    appenders: {
        infoFile: {
            type: 'file',
            filename: './txt/info.log'
        },
        console: {
            type: 'console'
        }
    },
    categories: {
        default: {
            appenders: ['infoFile','console'],
            level: 'all'
        }
    }
});

const logger = log4js.getLogger('log');

module.exports = logger;
