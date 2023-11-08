require('dotenv').config();
const moment = require('moment');
const { messages } = require('../_helpers/constants');
const { database } = require('firebase-admin');
const db = database();

async function createCategory({ name, desc }) {
    try {
        if (!name || !desc) return { result: false, message: messages.CAT_REQUIRED };
        const baseRef = db.ref();
        const snapshot = await baseRef.once('value');
        const baseVal = snapshot.val();
        const timeStamp = moment.now();
        if (baseVal && snapshot.hasChild('categories')) {
            const categoryRef = baseRef.child('categories');
            categoryRef.push({ name, desc, timeStamp })
        }
        else
            baseRef.child('categories').push({ name, desc, timeStamp });
        return { result: true, message: messages.CAT_CREATED, data: { name, desc, timeStamp } };

    } catch (e) {
        return { result: false, message: e.message };
    }
}

async function updateCategory({ categoryId, details }) {
    try {
        if (!categoryId || !details || typeof details !== 'object') return { result: false, message: messages.CAT_UPDATE_REQUIRED };
        const ref = db.ref(`categories/${categoryId}`);
        const snapshot = await ref.once('value');
        if (!snapshot.val()) return { result: false, message: messages.NONEXISTENT_CAT };
        const updates = await ref.update(details);
        return { result: true, message: messages.CAT_UPDATE_SUCCESS, data: updates };

    } catch (e) {
        return { result: false, message: e.message };
    }
}
async function retrieveCategories({ limit = 40, page = 1 }) {
    try {
        const nLimit = Number(limit);
        const nPage = Number(page);
        const categoriesRef = db.ref('categories');
        var limitedRef = categoriesRef.orderByChild('timeStamp').limitToLast(nLimit);
        if (nPage > 1) {
            const tempRef = categoriesRef.orderByChild('timeStamp').limitToLast(nLimit * (Number(page) - 1));
            const tempResp = await tempRef.once('value');
            const tempRespVal = tempResp.val();
            const tempRespValArr = Object.keys(tempRespVal);
            const start = tempRespValArr.shift();
            limitedRef = categoriesRef.orderByChild('timeStamp').endBefore(start).limitToLast(nLimit);
        }
        const countResp = await categoriesRef.once('value');
        const resp = await limitedRef.once('value');
        const categoryCount = countResp.numChildren();
        const pages = (categoryCount - ((nPage - 1) * nLimit)) / nLimit;
        const data = resp.val();
        const keysArray = Object.keys(data);
        const dataArray = [];
        /** include firebase key in data object */
        for (let i = 0; i < keysArray.length; i++) {
            const k = keysArray[i];
            const newD = data[k];
            newD['id'] = k;
            dataArray.push(newD)
        }
        return { result: true, message: messages.CATS_FETCHED, data: dataArray, metadata: { page, pages, limit } };
    } catch (e) {
        return { result: false, message: e.message };
    }
}

async function retrieveCategory({ categoryId }) {
    try {
        if (!categoryId) return { result: false, message: messages.NO_CAT_ID };
        const categoryRef = db.ref(`categories/${categoryId}`);
        const response = await categoryRef.once('value');
        const data = response.val();
        return { result: true, message: messages.CAT_FETCHED, data };
    } catch (e) {
        return { result: false, message: e.message };
    }
}
async function deleteCategory({ categoryId }) {
    try {
        if (!categoryId) return { result: false, message: messages.NO_CAT_ID };
        const categoryRef = db.ref(`categories/${categoryId}`);
        await categoryRef.remove();
        return { result: true, message: messages.CAT_DELETED };
    } catch (e) {
        return { result: false, message: e.message };
    }
}

module.exports = {
    createCategory,
    updateCategory,
    retrieveCategories,
    retrieveCategory,
    deleteCategory
}