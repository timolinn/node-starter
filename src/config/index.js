import dotenv from 'dotenv';
import path from 'path';

const currentEnv = process.env.NODE_ENV || 'development';
const defaultEnvPath = path.resolve(__dirname, '..', '..', '.env');
const envPath = defaultEnvPath;

console.log(`Loading .env from '${envPath}'`);
dotenv.config({
    path: envPath,
});

const defaultVars = {
    // env: process.env.NODE_ENV,
    server: {
        port: process.env.PORT,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    database: {
        uri: process.env.DATABASE_URL,
        mongoUri: process.env.MONGODB_URI,
    },
    logger: {
        level: process.env.LOGGER_LEVEL,
    },
    url: process.env.BASE_URL,
};


export default Object.assign({
    env: currentEnv,
}, defaultVars);