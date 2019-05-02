import jwt from 'jsonwebtoken';
import config from '../config';

export function signJWT(data, expiresIn = 86400) { // expiresIn default to 24 hours
    return jwt.sign(data, config.jwt.secret, { expiresIn });
}