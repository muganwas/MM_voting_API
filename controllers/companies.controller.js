const express = require('express');
const router = express.Router();
const { validateFirebaseAdmin, validateFirebaseUser } = require('../_helpers/functions');
const companiesService = require('../services/companies.service');

const { enums: { VALIDATION_ERROR, UNAUTHORIZED_ERROR }, messages: { VALIDATION_MESSAGE, UNAUTHORIZED_MESSAGE } } = require('../_helpers/constants');

async function createCompany(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { name, brands, emailAddress } = req.body;
    companiesService.createCompany({ name, brands, emailAddress }).then(data => res.json(data)).catch(err => next(err));
}

async function updateCompany(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { companyId, details } = req.body;
    companiesService.updateCompany({ companyId, details }).then(data => res.json(data)).catch(err => next(err));
}

async function retrieveCompanies(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseUser(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { limit, page } = req.query;
    companiesService.retrieveCompanies({ limit, page }).then(data => res.json(data)).catch(err => next(err));
}

async function retrieveCompany(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseUser(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { companyId } = req.params;
    companiesService.retrieveCompany({ companyId }).then(data => res.json(data)).catch(err => next(err));
}

async function deleteCompany(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { companyId } = req.query;
    companiesService.deleteCompany({ companyId }).then(data => res.json(data)).catch(err => next(err));
}

router.post('/create', createCompany);
router.put('/update', updateCompany);
router.get('/', retrieveCompanies);
router.get('/:companyId', retrieveCompany);
router.delete('/', deleteCompany);

module.exports = router;
