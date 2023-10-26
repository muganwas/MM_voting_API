const express = require('express');
const router = express.Router();
const { validateFirebaseUser } = require('../_helpers/functions');
const nominationsService = require('../services/nominations.service');

const { enums: { VALIDATION_ERROR, UNAUTHORIZED_ERROR }, messages: { VALIDATION_MESSAGE, UNAUTHORIZED_MESSAGE } } = require('../_helpers/constants');

async function createNomination(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseUser(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { judgeId, campaignId, idea, insight, communications_integration, kpis_impact, execution, comment } = req.body;
    nominationsService.createNomination({ judgeId, campaignId, idea, insight, communications_integration, kpis_impact, execution, comment }).then(data => res.json(data)).catch(err => next(err));
}

async function updateNomination(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseUser(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { nominationId, details } = req.body;
    nominationsService.updateNomination({ nominationId, details }).then(data => res.json(data)).catch(err => next(err));
}

async function retrieveNominations(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseUser(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { limit, page, judgeId } = req.query;
    nominationsService.retrieveNominations({ limit, page, judgeId }).then(data => res.json(data)).catch(err => next(err));
}

async function retrieveNomination(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseUser(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { nominationId } = req.params;
    nominationsService.retrieveNomination({ nominationId }).then(data => res.json(data)).catch(err => next(err));
}

async function deleteNomination(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseUser(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { nominationId } = req.query;
    nominationsService.deleteNomination({ nominationId }).then(data => res.json(data)).catch(err => next(err));
}

router.post('/create', createNomination);
router.put('/update', updateNomination);
router.get('/', retrieveNominations);
router.get('/:nominationId', retrieveNomination);
router.delete('/', deleteNomination);

module.exports = router;