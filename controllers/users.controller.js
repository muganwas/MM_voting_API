const express = require('express');
const router = express.Router();
const { validateFirebaseUser, validateFirebaseAdmin } = require('../_helpers/functions');
const usersService = require('../services/users.service');

const { enums: { VALIDATION_ERROR, UNAUTHORIZED_ERROR }, messages: { VALIDATION_MESSAGE, UNAUTHORIZED_MESSAGE } } = require('../_helpers/constants');

function authenticate(req, res, next) {
    usersService.authenticate(req.body).then(data => res.json(data)).catch(err => next(err));
}

async function createUser(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseUser(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);
    usersService.createUser(req.body).then(data => res.json(data)).catch(err => next(err));
}

async function adminUserVerify(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);
    usersService.adminVerifyUser(req.body).then(data => res.json(data)).catch(err => next(err));
}

router.post('/authenticate', authenticate);
router.post('/create', createUser);
router.post('/admin-verify-user', adminUserVerify);

module.exports = router;
