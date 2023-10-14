const express = require('express');
const router = express.Router();
const { validateFirebaseAdmin } = require('../_helpers/functions');
const usersService = require('../services/users.service');

const { enums: { VALIDATION_ERROR, UNAUTHORIZED_ERROR }, messages: { VALIDATION_MESSAGE, UNAUTHORIZED_MESSAGE } } = require('../_helpers/constants');

function authenticate(req, res, next) {
    usersService.authenticate(req.body).then(data => res.json(data)).catch(err => next(err));
}

async function createUser(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { email, password } = req.body;
    usersService.createUser({ email, password }).then(data => res.json(data)).catch(err => next(err));
}

async function adminUserVerify(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { uid, value } = req.body;
    usersService.adminVerifyUser({ uid, value }).then(data => res.json(data)).catch(err => next(err));
}

async function retrieveUsers(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { limit, nextPageToken } = req.query;
    usersService.retrieveUsers({ limit, nextPageToken }).then(data => res.json(data)).catch(err => next(err));
}

async function retrieveUser(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { uid } = req.params;
    usersService.retrieveUser({ uid }).then(data => res.json(data)).catch(err => next(err));
}

async function deleteUser(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { uid } = req.query;
    usersService.deleteUser({ uid }).then(data => res.json(data)).catch(err => next(err));
}

router.post('/authenticate', authenticate);
router.post('/create', createUser);
router.put('/admin-verify-user', adminUserVerify);
router.get('/', retrieveUsers);
router.get('/:uid', retrieveUser);
router.delete('/', deleteUser);

module.exports = router;
