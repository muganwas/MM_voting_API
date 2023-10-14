require('dotenv').config();
const moment = require('moment');
const { messages } = require('../_helpers/constants');
const { database } = require('firebase-admin');
const db = database();

async function createCampaign(body) {
    try {
        const { name, companyId, brandName, agencyId, emailAddress } = body;
        if (!name || !emailAddress || !companyId || !agencyId) return { result: false, message: messages.CAMP_REQUIRED };
        const baseRef = db.ref();
        const snapshot = await baseRef.once('value');
        const baseVal = snapshot.val();
        const timeStamp = moment.now();
        if (baseVal && snapshot.hasChild('campaigns')) {
            const campaignRef = baseRef.child('campaigns');
            campaignRef.push({ name, companyId, brandName, agencyId, emailAddress, timeStamp })
        }
        else
            baseRef.child('campaigns').push({ name, companyId, brandName, agencyId, emailAddress, timeStamp });
        return { result: true, message: messages.CAMP_CREATED, data: { name, companyId, brandName, agencyId, emailAddress, timeStamp } };

    } catch (e) {
        return { result: false, message: e.message };
    }
}

async function updateCampaign(body) {
    try {
        const { campaignId, details } = body;
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
async function retrieveCampaigns(query) {
    try {
        const { limit = 10, page = 1 } = query;
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
        const dataArray = Object.values(data);
        return { result: true, message: messages.CAMPS_FETCHED, data: dataArray, metadata: { page, pages, limit } };
    } catch (e) {
        return { result: false, message: e.message };
    }
}

async function retrieveCampaign(params) {
    try {
        const { campaignId } = params;
        if (!campaignId) return { result: false, message: messages.NO_CAMP_ID };
        const campaignRef = db.ref(`campaigns/${campaignId}`);
        const response = await campaignRef.once('value');
        const data = response.val();
        return { result: true, message: messages.CAMP_FETCHED, data };
    } catch (e) {
        return { result: false, message: e.message };
    }
}
async function deleteCampaign(query) {
    try {
        const { campaignId } = query;
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