const express = require('express');
const router = express.Router();
const { validateFirebaseAdmin } = require('../_helpers/functions');
const campaignsService = require('../services/campaigns.service');

const { enums: { VALIDATION_ERROR, UNAUTHORIZED_ERROR }, messages: { VALIDATION_MESSAGE, UNAUTHORIZED_MESSAGE } } = require('../_helpers/constants');

async function createCampaign(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { name, companyId, brandName, agencyId, emailAddress } = req.body;
    campaignsService.createCampaign({ name, companyId, brandName, agencyId, emailAddress }).then(data => res.json(data)).catch(err => next(err));
}

async function updateCampaign(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { campaignId, details } = req.body;
    campaignsService.updateCampaign({ campaignId, details }).then(data => res.json(data)).catch(err => next(err));
}

async function retrieveCampaigns(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { limit, page } = req.query;
    campaignsService.retrieveCampaigns({ limit, page }).then(data => res.json(data)).catch(err => next(err));
}

async function retrieveCampaign(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { campaignId } = req.params;
    campaignsService.retrieveCampaign({ campaignId }).then(data => res.json(data)).catch(err => next(err));
}

async function deleteCampaign(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { campaignId } = req.query;
    campaignsService.deleteCampaign({ campaignId }).then(data => res.json(data)).catch(err => next(err));
}

router.post('/create', createCampaign);
router.put('/update', updateCampaign);
router.get('/', retrieveCampaigns);
router.get('/:campaignId', retrieveCampaign);
router.delete('/', deleteCampaign);

module.exports = router;
