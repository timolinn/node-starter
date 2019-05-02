import passport from 'passport';
import passportJWT from 'passport-jwt';
import passportLocalStrategy from 'passport-local';
import User from '../components/user/userModel';
import config from '.';
import * as httpStatus from '../util/httpStatus';

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
const LocalStrategy = passportLocalStrategy.Strategy;


passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: false,
    },
    (email, password, done) => {
        return User.findOne({
            email,
        })
            .then((user) => {
                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect email or password.',
                        status: httpStatus.BAD_REQUEST,
                    });
                }

                if (!user.comparePassword(password)) {
                    return done(null, false, {
                        message: 'Incorrect email or password.',
                        status: httpStatus.BAD_REQUEST,
                    });
                }

                return done(null, user, {
                    message: 'Logged In Successfully',
                    status: httpStatus.OK,
                });
            })
            .catch((err) => {
                return done(err);
            });
    },
    ),
);

passport.use(
    new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwt.secret,
    },
    function (jwtPayload, done) {
        //find the user in db if needed
        return User.findById(jwtPayload.id)
            .then((user) => {
                if (user) {
                    return done(null, user, {
                        message: 'Success',
                        status: httpStatus.OK,
                    });
                } else {
                    return done(null, false, {
                        message: 'Could not be authenticated or invalid token',
                        status: httpStatus.BAD_REQUEST,
                    });
                }
            })
            .catch((err) => {
                return done(err, false);
            });
    },
    ),
);

export default passport;