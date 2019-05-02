import mongoose from 'mongoose';
import config from './config';
import app from './app';
import logger from './util/logger';

// stop ensureIndex deprecation warning
mongoose.set('useCreateIndex', true);

// Connect to our Database and handle any bad connections
mongoose.Promise = global.Promise;
mongoose.connect(config.database.uri || config.database.mongoUri, {
    useNewUrlParser: true,
}).then(() => {
    console.log('Database connection created.');
}).catch(err => {
    console.log(`Something went wrong while i tried connecting to the database→ ${err.message}`);
});

app.set('port', config.server.port || 7777);
const server = app.listen(app.get('port') || 7777, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});

// Gracefull shut downs
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received.');
    logger.info('Closing http server.');
    server.close(() => {
        logger.info('Http server closed.');
        // boolean means [force]
        mongoose.connection.close(false, () => {
            logger.info('MongoDb connection closed.');
            logger.info(' Alright! Bye!');
        });
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received.');
    logger.info('Closing http server.');
    server.close(() => {
        logger.info('Http server closed.');
        // boolean means [force]
        mongoose.connection.close(false, () => {
            logger.info('MongoDb connection closed.');
            logger.info(' Alright! Bye!');
        });
    });
});