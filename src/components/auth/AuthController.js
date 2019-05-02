import User from '../user/userModel';
import JsonResponse from '../../util/JsonResponse';
import * as httpStatus from '../../util/httpStatus';
import passport from '../../config/passport';
import AppError from '../../handlers/AppError';

class AuthController {
    async login(req, res, next) {
        const data = req.body || {};

        if (!data.email || !data.password) {
            return res.status(httpStatus.UNPROCESSABLE).json(
                // serialize response to JSON
                JsonResponse.fail(
                    'email or password cannot be blank',
                    httpStatus.UNPROCESSABLE,
                    data
                )
            );
        }

        passport.authenticate('local', {
            session: false,
        }, (err, user, info) => {
            if (err)
                return next(new AppError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true));

            if (!user) {
                return res.status(info.status || httpStatus.NOT_FOUND)
                    .json(JsonResponse.error(info.message, info.status || httpStatus.NOT_FOUND));
            }

            // login user
            req.login(
                user, {
                    session: false,
                },
                async (err) => {
                    if (err) {
                        return res.status(httpStatus.INTERNAL_SERVER_ERROR)
                            .json(JsonResponse.error(err.message, httpStatus.INTERNAL_SERVER_ERROR));
                    }
                    const serializedUser = user.serializeAuthenticatedUser();

                    // save refreshtoken
                    user.refreshToken = serializedUser.refreshToken;
                    await user.save();

                    // login successful
                    return res.status(httpStatus.OK)
                        .json(JsonResponse.success(
                            'Login successful',
                            httpStatus.OK,
                            serializedUser));
                },
            );
        })(req, res);
    }

    async register(req, res, next) {
        const data = req.body || {};

        const exists = await User.findOne({
            email: data.email,
        });

        if (exists) {
            return res.status(httpStatus.BAD_REQUEST).json(
                JsonResponse.fail('email already taken', httpStatus.BAD_REQUEST)
            );
        }

        const user = new User(data);

        user.save(async (err, user) => {
            if (err)
                return next(new AppError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true));

            const serializedUser = user.serializeAuthenticatedUser();
            // save refreshtoken
            user.refreshToken = serializedUser.refreshToken;
            await user.save();
            return res.status(httpStatus.OK).json(
                JsonResponse.success('Registration successful', httpStatus.OK, serializedUser)
            );
        });
    }

    checkToken(req, res, next) {
        passport.authenticate('jwt', {
            session: false,
        }, (err, user, info = {}) => {
            if (err) {
                return next(new AppError(err.message || 'An error occurred!', httpStatus.INTERNAL_SERVER_ERROR, true));
            }
            if (!user) {
                if (info.name === 'TokenExpiredError') {
                    return res.status(info.status || httpStatus.UNAUTHORIZED)
                        .json(
                            JsonResponse.fail(
                                'TokenExpiredError: Your token has expired. Please generate a new one',
                                info.status || httpStatus.UNAUTHORIZED
                            )
                        );
                } else {
                    return next(new AppError(info.message, info.status, true, 'Authentication Error.'));
                }
            }
            req.user = user;
            next();
        })(req, res, next);
    }

    // validate POST register request
    validate(req, res, next) {
        req.sanitizeBody('firstName');
        req.sanitizeBody('lastName');
        req.checkBody('firstName', 'first name cannot be blank')
            .trim()
            .notEmpty();
        req.checkBody('lastName', 'last name cannot be blank')
            .trim()
            .notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody(
            'password',
            'Password must be at least 6 characters long'
        ).len({
            min: 6,
        });
        req.checkBody(
            'passwordConfirmation',
            'Passwords do not match'
        ).notEmpty();
        req.checkBody('passwordConfirmation', 'Passwords do not match').equals(
            req.body.password
        );
        req.sanitizeBody('email').normalizeEmail({
            gmail_remove_dots: false,
            gmail_remove_subaddress: false,
        });

        const errors = req.validationErrors();

        if (errors) {
            return res.status(httpStatus.UNPROCESSABLE)
                .json(JsonResponse.fail('Validation error', httpStatus.UNPROCESSABLE, errors));
        }
        next();
    }
}


export default new AuthController();