
/**
 * Configurations of logger.
 */
const winston = require('winston');
const winstonRotator = require('winston-daily-rotate-file');

const consoleConfig = [
    new winston.transports.Console({
        'colorize': true
    })
];

const createLogger = new winston.Logger({
    'transports': consoleConfig
});

const successLogger = createLogger;
successLogger.add(winstonRotator, {
    'name': 'info-file',
    'level': 'info',
    'filename': './logs/info.log',
    'json': false,
    'datePattern': 'yyyy-MM-dd-',
    'prepend': true
});

const debugLogger = createLogger;
debugLogger.add(winstonRotator, {
    'name': 'debug-file',
    'level': 'debug',
    'filename': './logs/debug.log',
    'json': false,
    'datePattern': 'yyyy-MM-dd-',
    'prepend': true
});

const errorLogger = createLogger;
errorLogger.add(winstonRotator, {
    'name': 'error-file',
    'level': 'error',
    'filename': './logs/error.log',
    'json': false,
    'datePattern': 'yyyy-MM-dd-',
    'prepend': true
});

module.exports = {
    'successlog': successLogger,
    'errorlog': errorLogger,
    'debuglog': debugLogger
};
