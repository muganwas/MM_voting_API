require('dotenv').config();
const moment = require('moment');
const { messages } = require('../_helpers/constants');
const { database } = require('firebase-admin');
const db = database();

async function createAgency(body) {
    try {
        const { name, introduction, emailAddress } = body;
        if (!name || !emailAddress || !introduction) return { result: false, message: messages.AGEN_REQUIRED };
        const baseRef = db.ref();
        const snapshot = await baseRef.once('value');
        const baseVal = snapshot.val();
        const timeStamp = moment.now();
        if (baseVal && snapshot.hasChild('agencies')) {
            const agencyRef = baseRef.child('agencies');
            agencyRef.push({ name, introduction, emailAddress, timeStamp })
        }
        else
            baseRef.child('agencies').push({ name, introduction, emailAddress, timeStamp });
        return { result: true, message: messages.AGEN_CREATED, data: { name, introduction, emailAddress, timeStamp } };

    } catch (e) {
        return { result: false, message: e.message };
    }
}

async function updateAgency(body) {
    try {
        const { agencyId, details } = body;
        if (!agencyId || !details || typeof details !== 'object') return { result: false, message: messages.AGEN_UPDATE_REQUIRED };
        const ref = db.ref(`agencies/${agencyId}`);
        const snapshot = await ref.once('value');
        if (!snapshot.val()) return { result: false, message: messages.NONEXISTENT_AGEN };
        const updates = await ref.update(details);
        return { result: true, message: messages.AGEN_UPDATE_SUCCESS, data: updates };

    } catch (e) {
        return { result: false, message: e.message };
    }
}
async function retrieveAgencies(query) {
    try {
        const { limit = 10, page = 1 } = query;
        const nLimit = Number(limit);
        const nPage = Number(page);
        const agenciesRef = db.ref('agencies');
        var limitedRef = agenciesRef.orderByChild('timeStamp').limitToLast(nLimit);
        if (nPage > 1) {
            const tempRef = agenciesRef.orderByChild('timeStamp').limitToLast(nLimit * (Number(page) - 1));
            const tempResp = await tempRef.once('value');
            const tempRespVal = tempResp.val();
            const tempRespValArr = Object.keys(tempRespVal);
            const start = tempRespValArr.shift();
            limitedRef = agenciesRef.orderByChild('timeStamp').endBefore(start).limitToLast(nLimit);
        }
        const countResp = await agenciesRef.once('value');
        const resp = await limitedRef.once('value');
        const agencyCount = countResp.numChildren();
        const pages = (agencyCount - ((nPage - 1) * nLimit)) / nLimit;
        const data = resp.val();
        const dataArray = Object.values(data);
        return { result: true, message: messages.AGENS_FETCHED, data: dataArray, metadata: { page, pages, limit } };
    } catch (e) {
        return { result: false, message: e.message };
    }
}

async function retrieveAgency(params) {
    try {
        const { agencyId } = params;
        if (!agencyId) return { result: false, message: messages.NO_AGEN_ID };
        const agencyRef = db.ref(`agencies/${agencyId}`);
        const response = await agencyRef.once('value');
        const data = response.val();
        return { result: true, message: messages.AGEN_FETCHED, data };
    } catch (e) {
        return { result: false, message: e.message };
    }
}
async function deleteAgency(query) {
    try {
        const { agencyId } = query;
        if (!agencyId) return { result: false, message: messages.NO_AGEN_ID };
        const agencyRef = db.ref(`agencies/${agencyId}`);
        await agencyRef.remove();
        return { result: true, message: messages.AGEN_DELETED };
    } catch (e) {
        return { result: false, message: e.message };
    }
}

module.exports = {
    createAgency,
    updateAgency,
    retrieveAgencies,
    retrieveAgency,
    deleteAgency
}