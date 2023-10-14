require('dotenv').config();
const moment = require('moment');
const { messages } = require('../_helpers/constants');
const { database } = require('firebase-admin');
const db = database();

async function createCompany(body) {
    try {
        const { name, emailAddress } = body;
        if (!name || !emailAddress) return { result: false, message: messages.COMP_REQUIRED };
        const baseRef = db.ref();
        const snapshot = await baseRef.once('value');
        const baseVal = snapshot.val();
        const timeStamp = moment.now();
        if (baseVal && snapshot.hasChild('companies')) {
            const companyRef = baseRef.child('companies');
            companyRef.push({ name, emailAddress, timeStamp })
        }
        else
            baseRef.child('companies').push({ name, emailAddress, timeStamp });
        return { result: true, message: messages.COMP_CREATED, data: { name, emailAddress, timeStamp } };

    } catch (e) {
        return { result: false, message: e.message };
    }
}

async function updateCompany(body) {
    try {
        const { companyId, details } = body;
        if (!companyId || !details || typeof details !== 'object') return { result: false, message: messages.COMP_UPDATE_REQUIRED };
        const ref = db.ref(`companies/${companyId}`);
        const snapshot = await ref.once('value');
        if (!snapshot.val()) return { result: false, message: messages.NONEXISTENT_COMP };
        const updates = await ref.update(details);
        return { result: true, message: messages.COMP_UPDATE_SUCCESS, data: updates };

    } catch (e) {
        return { result: false, message: e.message };
    }
}
async function retrieveCompanies(query) {
    try {
        const { limit = 10, page = 1 } = query;
        const nLimit = Number(limit);
        const nPage = Number(page);
        const companiesRef = db.ref('companies');
        var limitedRef = companiesRef.orderByChild('timeStamp').limitToLast(nLimit);
        if (nPage > 1) {
            const tempRef = companiesRef.orderByChild('timeStamp').limitToLast(nLimit * (Number(page) - 1));
            const tempResp = await tempRef.once('value');
            const tempRespVal = tempResp.val();
            const tempRespValArr = Object.keys(tempRespVal);
            const start = tempRespValArr.shift();
            limitedRef = companiesRef.orderByChild('timeStamp').endBefore(start).limitToLast(nLimit);
        }
        const countResp = await companiesRef.once('value');
        const resp = await limitedRef.once('value');
        const companyCount = countResp.numChildren();
        const pages = (companyCount - ((nPage - 1) * nLimit)) / nLimit;
        const data = resp.val();
        const dataArray = Object.values(data);
        return { result: true, message: messages.COMPS_FETCHED, data: dataArray, metadata: { page, pages, limit } };
    } catch (e) {
        return { result: false, message: e.message };
    }
}

async function retrieveCompany(params) {
    try {
        const { companyId } = params;
        if (!companyId) return { result: false, message: messages.NO_COMP_ID };
        const companyRef = db.ref(`companies/${companyId}`);
        const response = await companyRef.once('value');
        const data = response.val();
        return { result: true, message: messages.COMP_FETCHED, data };
    } catch (e) {
        return { result: false, message: e.message };
    }
}
async function deleteCompany(query) {
    try {
        const { companyId } = query;
        if (!companyId) return { result: false, message: messages.NO_COMP_ID };
        const companyRef = db.ref(`companies/${companyId}`);
        await companyRef.remove();
        return { result: true, message: messages.COMP_DELETED };
    } catch (e) {
        return { result: false, message: e.message };
    }
}

module.exports = {
    createCompany,
    updateCompany,
    retrieveCompanies,
    retrieveCompany,
    deleteCompany
}