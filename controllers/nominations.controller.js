const express = require('express');
const router = express.Router();
const { validateFirebaseUser } = require('../_helpers/functions');
const nominationsService = require('../services/nominations.service');

const { enums: { VALIDATION_ERROR, UNAUTHORIZED_ERROR }, messages: { VALIDATION_MESSAGE, UNAUTHORIZED_MESSAGE } } = require('../_helpers/constants');

async function createNomination(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseUser(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { judgeId, campaignId, categoryId, alignment = 0, objectives = 0, implementation = 0, impact = 0, why_win = 0, execution = 0, sustainability = 0, culture = 0, comment } = req.body;
    nominationsService.createNomination({ judgeId, campaignId, categoryId, alignment, objectives, implementation, impact, why_win, execution, sustainability, culture, comment }).then(data => res.json(data)).catch(err => next(err));
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

    const { limit, page, judgeId, catId } = req.query;
    nominationsService.retrieveNominations({ limit, page, judgeId, catId }).then(data => res.json(data)).catch(err => next(err));
}

async function retrieveAggregatedNominations(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseUser(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);
    const { limit } = req.query;
    nominationsService.aggregatedNomintations({ limit }).then(data => res.json(data)).catch(err => next(err));
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
router.get('/aggregated', retrieveAggregatedNominations);
router.get('/:nominationId', retrieveNomination);
router.delete('/', deleteNomination);

module.exports = router;