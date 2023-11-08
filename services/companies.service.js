require('dotenv').config();
const moment = require('moment');
const { messages } = require('../_helpers/constants');
const { database } = require('firebase-admin');
const db = database();

async function createCompany({ name, brands = [], emailAddress }) {
    try {
        if (!name || !emailAddress) return { result: false, message: messages.COMP_REQUIRED };
        const baseRef = db.ref();
        const snapshot = await baseRef.once('value');
        const baseVal = snapshot.val();
        const timeStamp = moment.now();
        var currentCompany;
        if (baseVal && snapshot.hasChild('companies')) {
            const companyRef = baseRef.child('companies');
            await companyRef.push({ name, brands, emailAddress, timeStamp })
        }
        else
            await baseRef.child('companies').push({ name, brands, emailAddress, timeStamp });
        const { data, result } = await retrieveCompanies({});
        if (result) {
            currentCompany = data.find(c => c.timeStamp === timeStamp);
        }
        return { result: true, message: messages.COMP_CREATED, data: currentCompany || { name, brands, emailAddress, timeStamp } };

    } catch (e) {
        return { result: false, message: e.message };
    }
}

async function updateCompany({ companyId, details }) {
    try {
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
async function retrieveCompanies({ limit = 40, page = 1 }) {
    try {
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
        const keysArray = Object.keys(data);
        const dataArray = [];
        /** include firebase key in data object */
        for (let i = 0; i < keysArray.length; i++) {
            const k = keysArray[i];
            const newD = data[k];
            newD['id'] = k;
            dataArray.push(newD)
        }
        return { result: true, message: messages.COMPS_FETCHED, data: dataArray, metadata: { page, pages, limit } };
    } catch (e) {
        return { result: false, message: e.message };
    }
}

async function retrieveCompany({ companyId }) {
    try {
        if (!companyId) return { result: false, message: messages.NO_COMP_ID };
        const companyRef = db.ref(`companies/${companyId}`);
        const response = await companyRef.once('value');
        const data = response.val();
        return { result: true, message: messages.COMP_FETCHED, data };
    } catch (e) {
        return { result: false, message: e.message };
    }
}
async function deleteCompany({ companyId }) {
    try {
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