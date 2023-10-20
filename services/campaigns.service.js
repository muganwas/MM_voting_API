require('dotenv').config();
const moment = require('moment');
const { messages } = require('../_helpers/constants');
const { createCompany } = require('./companies.service');
const { createAgency } = require('./agencies.service');
const { database } = require('firebase-admin');
const db = database();

async function createCampaign({ name, categoryIds, companyName, intro, agencyName, companyId, brandName, agencyId, emailAddress }) {
    try {
        if (!name || !emailAddress || !categoryIds) return { result: false, message: messages.CAMP_REQUIRED };
        if ((!companyId || !agencyId) && (!agencyName || !companyName)) return { result: false, message: messages.CAMP_REQUIRED };
        if (!Array.isArray(categoryIds)) return { result: false, message: messages.CAMP_CAT_ID_TYPE };
        /** create company if non-existent */
        if (!companyId && companyName) {
            const { data, result } = await createCompany({ name: companyName, brands: [brandName], emailAddress });
            if (result)
                companyId = data.id;
            else return { result: false, message: messages.FAILURE };
        }
        /** end create company */
        /** create agency if non-existent */
        if (!agencyId && agencyName) {
            const { data, result } = await createAgency({ name: agencyName, introduction: intro, emailAddress });
            if (result)
                agencyId = data.id;
            else return { result: false, message: messages.FAILURE };
        }
        /** end create agency */
        const baseRef = db.ref();
        const snapshot = await baseRef.once('value');
        const baseVal = snapshot.val();
        const timeStamp = moment.now();
        // default to company name if brandname not provided
        brandName = brandName || companyName;
        if (baseVal && snapshot.hasChild('campaigns')) {
            const campaignRef = baseRef.child('campaigns');
            campaignRef.push({ name, companyId, categoryIds, brandName, agencyId, emailAddress, timeStamp })
        }
        else
            baseRef.child('campaigns').push({ name, companyId, categoryIds, brandName, agencyId, emailAddress, timeStamp });
        return { result: true, message: messages.CAMP_CREATED, data: { name, companyId, categoryIds, brandName, agencyId, emailAddress, timeStamp } };

    } catch (e) {
        return { result: false, message: e.message };
    }
}

async function updateCampaign({ campaignId, details }) {
    try {
        if (!campaignId || !details || typeof details !== 'object') return { result: false, message: messages.CAMP_UPDATE_REQUIRED };
        const ref = db.ref(`campaigns/${campaignId}`);
        const snapshot = await ref.once('value');
        if (!snapshot.val()) return { result: false, message: messages.NONEXISTENT_CAMP };
        const updates = await ref.update(details);
        return { result: true, message: messages.CAMP_UPDATE_SUCCESS, data: updates };

    } catch (e) {
        return { result: false, message: e.message };
    }
}
async function retrieveCampaigns({ limit = 10, page = 1 }) {
    try {
        const nLimit = Number(limit);
        const nPage = Number(page);
        const campaignsRef = db.ref('campaigns');
        var limitedRef = campaignsRef.orderByChild('timeStamp').limitToLast(nLimit);
        if (nPage > 1) {
            const tempRef = campaignsRef.orderByChild('timeStamp').limitToLast(nLimit * (Number(page) - 1));
            const tempResp = await tempRef.once('value');
            const tempRespVal = tempResp.val();
            const tempRespValArr = Object.keys(tempRespVal);
            const start = tempRespValArr.shift();
            limitedRef = campaignsRef.orderByChild('timeStamp').endBefore(start).limitToLast(nLimit);
        }
        const countResp = await campaignsRef.once('value');
        const resp = await limitedRef.once('value');
        const campaignCount = countResp.numChildren();
        const pages = (campaignCount - ((nPage - 1) * nLimit)) / nLimit;
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
        return { result: true, message: messages.CAMPS_FETCHED, data: dataArray, metadata: { page, pages, limit } };
    } catch (e) {
        return { result: false, message: e.message };
    }
}

async function retrieveCampaign({ campaignId }) {
    try {
        if (!campaignId) return { result: false, message: messages.NO_CAMP_ID };
        const campaignRef = db.ref(`campaigns/${campaignId}`);
        const response = await campaignRef.once('value');
        const data = response.val();
        return { result: true, message: messages.CAMP_FETCHED, data };
    } catch (e) {
        return { result: false, message: e.message };
    }
}
async function deleteCampaign({ campaignId }) {
    try {
        if (!campaignId) return { result: false, message: messages.NO_CAMP_ID };
        const campaignRef = db.ref(`campaigns/${campaignId}`);
        await campaignRef.remove();
        return { result: true, message: messages.CAMP_DELETED };
    } catch (e) {
        return { result: false, message: e.message };
    }
}

module.exports = {
    createCampaign,
    updateCampaign,
    retrieveCampaigns,
    retrieveCampaign,
    deleteCampaign
}