import passport from 'passport';
import passportJWT from 'passport-jwt';
import passportLocalStrategy from 'passport-local';
import User from '../components/user/userModel';
import config from '.';

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
                        });
                    }

                    if (!user.comparePassword(password)) {
                        return done(null, false, {
                            message: 'Incorrect email or password.',
                        });
                    }

                    return done(null, user, {
                        message: 'Logged In Successfully',
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
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                })
                .catch((err) => {
                    return done(err, false);
                });
        },
    ),
);

export default passport;