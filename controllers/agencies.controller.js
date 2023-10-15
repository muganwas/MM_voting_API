const express = require('express');
const router = express.Router();
const { validateFirebaseAdmin } = require('../_helpers/functions');
const agenciesService = require('../services/agencies.service');

const { enums: { VALIDATION_ERROR, UNAUTHORIZED_ERROR }, messages: { VALIDATION_MESSAGE, UNAUTHORIZED_MESSAGE } } = require('../_helpers/constants');

async function createAgency(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { name, introduction, emailAddress } = req.body;
    agenciesService.createAgency({ name, introduction, emailAddress }).then(data => res.json(data)).catch(err => next(err));
}

async function updateAgency(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { agencyId, details } = req.body;
    agenciesService.updateAgency({ agencyId, details }).then(data => res.json(data)).catch(err => next(err));
}

async function retrieveAgencies(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { limit, page } = req.query;
    agenciesService.retrieveAgencies({ limit, page }).then(data => res.json(data)).catch(err => next(err));
}

async function retrieveAgency(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { agencyId } = req.params;
    agenciesService.retrieveAgency({ agencyId }).then(data => res.json(data)).catch(err => next(err));
}

async function deleteAgency(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { agencyId } = req.query;
    agenciesService.deleteAgency({ agencyId }).then(data => res.json(data)).catch(err => next(err));
}

router.post('/create', createAgency);
router.put('/update', updateAgency);
router.get('/', retrieveAgencies);
router.get('/:agencyId', retrieveAgency);
router.delete('/', deleteAgency);

module.exports = router;
