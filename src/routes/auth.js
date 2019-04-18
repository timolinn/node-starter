const router = require('express').Router();
const {
  auth,
} = require('../components/auth/AuthController');
const {
  catchErrors,
} = require('../helpers');

export default router;
