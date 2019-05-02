import express from 'express';
import bodyParser from 'body-parser';
import morganLogger from 'morgan';
import cors from 'cors';
import path from 'path';
import expressValidator from 'express-validator';
import config from './config';
import AppError from './handlers/AppError';
import logger from './util/logger';

// routers
import authRouter from './routes/auth';
import userRouter from './routes/user';

const app = express();

app.use(
    cors({
        maxAge: 1728000,
    }),
);
app.use(morganLogger('dev'));
app.use(
    bodyParser.urlencoded({
        extended: false,
    }),
);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(expressValidator());

//routes
app.get('/', (req, res) => res.send('Node Starter files!'));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

// Handle favicon requests from browsers
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

// Match non existing routes
app.use('*', (req, res, next) => {
    next(new AppError('Invalid url', 400, true));
});

// Error handlers
app.use((err, req, res, next) => {
    if ('development' !== config.env) {
        return next(err);
    }

    logger.error(
        `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${
            req.ip
        } - Stack: ${err.stack}`
    );
    err.stack = err.stack || '';
    let errorDetails = {
        status: 'error',
        message: err.message,
        code: err.statusCode || 500,
        stack: err.stack,
    };

    console.log(errorDetails);

    res.status(err.statusCode || 500);
    return res.json(errorDetails);
});

app.use((err, req, res) => {
    if (!err.isOperational) {
        console.log(
            'An unexpected error occurred please restart the application!',
            '\nError: ' + err.message + ' Stack: ' + err.stack
        );
    }

    logger.error(
        `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${
            req.ip
        } - Stack: ${err.stack}`
    );
    err.stack = err.stack || '';
    let errorDetails = {
        status: 'error',
        message: err.message,
        code: err.statusCode || 500,
    };

    console.log(errorDetails);

    res.status(err.statusCode || 500);
    return res.json(errorDetails);
});

process.on('unhandledRejection', (reason) => {
    throw reason;
});

process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${500} - ${error.message}, Stack: ${error.stack}`);
    process.kill(process.pid, 'SIGTERM');
});

export default app;