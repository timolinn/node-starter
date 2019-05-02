import authCtrl from '../components/auth/AuthController';
import { catchErrors } from '../helpers';

const router = require('express').Router();

router.post('/register', authCtrl.validate, catchErrors(authCtrl.register));
router.post('/login', catchErrors(authCtrl.login));

export default router;
