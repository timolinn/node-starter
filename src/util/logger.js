const winston = require('winston');
const appRoot = require('app-root-path');

const options = {
    error: {
        level: 'error',
        filename: `${appRoot}/logs/error.log`,
        handleExceptions: true,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.uncolorize(),
            winston.format.simple(),
        ),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    },
    combined: {
        level: 'info',
        filename: `${appRoot}/logs/app.log`,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.uncolorize(),
            winston.format.simple(),
        ),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        levels: winston.config.npm.levels,
        handleExceptions: true,
        json: false,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.cli()
        ),
    },
};

// instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.File(options.error),
        new winston.transports.File(options.combined),
        new winston.transports.Console(options.console),
    ],
    exitOnError: false, // do not exit on handled exceptions
});

export default logger;