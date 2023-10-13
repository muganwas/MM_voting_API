const express = require('express');
const router = express.Router();
const { validateFirebaseAdmin } = require('../_helpers/functions');
const companiesService = require('../services/companies.service');

const { enums: { VALIDATION_ERROR, UNAUTHORIZED_ERROR }, messages: { VALIDATION_MESSAGE, UNAUTHORIZED_MESSAGE } } = require('../_helpers/constants');

async function createCompany(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);
    companiesService.createCompany(req.body).then(data => res.json(data)).catch(err => next(err));
}

async function updateCompany(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);
    companiesService.updateCompany(req.body).then(data => res.json(data)).catch(err => next(err));
}

async function retrieveCompanies(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);
    companiesService.retrieveCompanies(req.query).then(data => res.json(data)).catch(err => next(err));
}

async function retrieveCompany(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);
    companiesService.retrieveCompany(req.params).then(data => res.json(data)).catch(err => next(err));
}

async function deleteCompany(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);
    companiesService.deleteCompany(req.query).then(data => res.json(data)).catch(err => next(err));
}

router.post('/create', createCompany);
router.put('/update', updateCompany);
router.get('/', retrieveCompanies);
router.get('/:companyId', retrieveCompany);
router.delete('/', deleteCompany);

module.exports = router;
