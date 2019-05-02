import userCtrl from '../components/user/UserController';
import authCtrl from '../components/auth/AuthController';
import { catchErrors } from '../helpers';

const router = require('express').Router();

router.get('/', authCtrl.checkToken, catchErrors(userCtrl.getAll));

export default router;
