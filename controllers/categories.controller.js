const express = require('express');
const router = express.Router();
const { validateFirebaseAdmin } = require('../_helpers/functions');
const categoriesService = require('../services/categories.service');

const { enums: { VALIDATION_ERROR, UNAUTHORIZED_ERROR }, messages: { VALIDATION_MESSAGE, UNAUTHORIZED_MESSAGE } } = require('../_helpers/constants');

async function createCategory(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { name, desc } = req.query;
    categoriesService.createCategory({ name, desc }).then(data => res.json(data)).catch(err => next(err));
}

async function updateCategory(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { categoryId, details } = req.body;
    categoriesService.updateCategory({ categoryId, details }).then(data => res.json(data)).catch(err => next(err));
}

async function retrieveCategories(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { limit, page } = req.query;
    categoriesService.retrieveCategories({ limit, page }).then(data => res.json(data)).catch(err => next(err));
}

async function retrieveCategory(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { categoryId } = req.params;
    categoriesService.retrieveCategory({ categoryId }).then(data => res.json(data)).catch(err => next(err));
}

async function deleteCategory(req, res, next) {
    if (!req.headers.authorization) return next({ name: VALIDATION_ERROR, message: VALIDATION_MESSAGE }, req, res, next);
    if (!await validateFirebaseAdmin(req.headers.authorization)) return next({ name: UNAUTHORIZED_ERROR, message: UNAUTHORIZED_MESSAGE }, req, res, next);

    const { categoryId } = req.query;
    categoriesService.deleteCategory({ categoryId }).then(data => res.json(data)).catch(err => next(err));
}

router.post('/create', createCategory);
router.put('/update', updateCategory);
router.get('/', retrieveCategories);
router.get('/:categoryId', retrieveCategory);
router.delete('/', deleteCategory);

module.exports = router;
