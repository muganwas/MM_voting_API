require('dotenv').config();
const moment = require('moment');
const { messages } = require('../_helpers/constants');
const { database } = require('firebase-admin');
const { retrieveCampaign } = require('./campaigns.service');
const db = database();

async function createNomination({ judgeId, campaignId, categoryId, alignment, objectives, implementation, impact, why_win, comment }) {
    try {
        if (!judgeId || !campaignId || !alignment || !objectives || !implementation || !categoryId || !impact || !why_win || !comment) return { result: false, message: messages.NOM_REQUIRED };
        if (
            typeof Number(alignment) !== 'number' ||
            typeof Number(objectives) !== 'number' ||
            typeof Number(implementation) !== 'number' ||
            typeof Number(impact) !== 'number' ||
            typeof Number(why_win) !== 'number'
        )
            return { result: false, message: messages.NOM_RATING_FORMAT };

        const { result, message } = await retrieveCampaign({ campaignId });
        if (!result) return { result, message }; //Campaign doesn't exist

        const baseRef = db.ref();
        const snapshot = await baseRef.once('value');
        const baseVal = snapshot.val();
        const timeStamp = moment.now();
        const total = Number(alignment) + Number(objectives) + Number(implementation) + Number(impact) + Number(why_win);
        if (baseVal && snapshot.hasChild('nominations')) {
            const nominationRef = baseRef.child('nominations');
            nominationRef.push({ judgeId, campaignId, alignment, objectives, categoryId, implementation, impact, why_win, total, comment, timeStamp })
        }
        else
            baseRef.child('nominations').push({ judgeId, campaignId, alignment, objectives, categoryId, implementation, impact, why_win, total, comment, timeStamp });
        return { result: true, message: messages.NOM_CREATED, data: { judgeId, campaignId, alignment, objectives, categoryId, implementation, impact, why_win, total, comment, timeStamp } };

    } catch (e) {
        return { result: false, message: e.message };
    }
}

async function updateNomination({ nominationId, details }) {
    try {
        if (!nominationId || !details || typeof details !== 'object') return { result: false, message: messages.NOM_UPDATE_REQUIRED };
        const ref = db.ref(`nominations/${nominationId}`);
        const snapshot = await ref.once('value');
        if (!snapshot.val()) return { result: false, message: messages.NONEXISTENT_NOM };
        const updates = await ref.update(details);
        return { result: true, message: messages.NOM_UPDATE_SUCCESS, data: updates };

    } catch (e) {
        return { result: false, message: e.message };
    }
}
async function retrieveNominations({ limit = 100, page = 1, judgeId, catId }) {
    try {
        const nLimit = Number(limit);
        const nPage = Number(page);
        const nominationsRef = db.ref('nominations');
        var limitedRef = nominationsRef.orderByChild('timeStamp').limitToLast(nLimit);
        if (judgeId && judgeId !== 'undefined' && judgeId !== 'null') limitedRef = nominationsRef.orderByChild('judgeId').equalTo(judgeId);
        if (nPage > 1) {
            var tempRef = nominationsRef.orderByChild('timeStamp').limitToLast(nLimit * (Number(page) - 1));
            if (judgeId && judgeId !== 'undefined' && judgeId !== 'null') tempRef = nominationsRef.orderByChild('judgeId').equalTo(judgeId).limitToLast(nLimit * (Number(page) - 1));
            const tempResp = await tempRef.once('value');
            const tempRespVal = tempResp.val();
            const tempRespValArr = Object.keys(tempRespVal);
            const start = tempRespValArr.shift();
            limitedRef = nominationsRef.orderByChild('timeStamp').endBefore(start).limitToLast(nLimit);
        }
        const countResp = await nominationsRef.once('value');
        const resp = await limitedRef.once('value');
        const nominationCount = countResp.numChildren();
        const pages = (nominationCount - ((nPage - 1) * nLimit)) / nLimit;
        const data = resp.val();
        var dataArray = Object.values(data);
        if (catId && catId !== 'undefined' && catId !== 'null') {
            dataArray = dataArray.filter(n => n.categoryId === catId);
            dataArray.sort((n, nn) => nn.total - n.total);
        }
        return { result: true, message: messages.NOMS_FETCHED, data: dataArray, metadata: { page, pages, limit } };
    } catch (e) {
        return { result: false, message: e.message };
    }
}

async function retrieveNomination({ nominationId }) {
    try {
        if (!nominationId) return { result: false, message: messages.NO_NOM_ID };
        const nominationRef = db.ref(`nominations/${nominationId}`);
        const response = await nominationRef.once('value');
        const data = response.val();
        return { result: true, message: messages.NOM_FETCHED, data };
    } catch (e) {
        return { result: false, message: e.message };
    }
}
async function deleteNomination({ nominationId }) {
    try {
        if (!nominationId) return { result: false, message: messages.NO_NOM_ID };
        const nominationRef = db.ref(`nominations/${nominationId}`);
        await nominationRef.remove();
        return { result: true, message: messages.NOM_DELETED };
    } catch (e) {
        return { result: false, message: e.message };
    }
}

module.exports = {
    createNomination,
    updateNomination,
    retrieveNominations,
    retrieveNomination,
    deleteNomination
}