require('dotenv').config();
const admin = require('firebase-admin');
const { signInWithEmailAndPassword, getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { messages, regexes } = require('../_helpers/constants');
const auth = getAuth();

async function authenticate(body) {
    try {
        const { email, password } = body;
        if (!email || !password) return { result: false, message: messages.EMAIL_PASSWORD_REQUIRED };
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await user.getIdToken();
        return { result: true, data: { email, phoneNumber: user.phoneNumber, verified: user.emailVerified, username: user.displayName, idToken, refreshToken: user.refreshToken, uid: user.uid } };
    } catch (e) {
        return { result: false, message: e.message };
    }
}
async function createUser(body) {
    try {
        const { email, password } = body;
        if (!email.match(regexes.EMAIL)) return { result: false, messages: messages.NOT_EMAIL };
        if (!password.match(regexes.PASSWORD)) return { result: false, messages: messages.PASSWORD_FORMAT };
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        const idToken = await user.getIdToken();
        return { result: true, message: messages.REG_SUCCESS, data: { email, username: user.displayName, idToken, refreshToken: user.refreshToken, uid: user.uid } };
    } catch (e) {
        return { result: false, message: e.message };
    }
}
async function adminVerifyUser(body) {
    try {
        const { uid, value } = body;
        const verified = Boolean(value);
        if (!uid) return { result: false, message: messages.NO_UID };
        if (typeof verified !== 'boolean') return { result: false, message: messages.NO_VERIFICATION_VALUE };
        const aAuth = admin.auth();
        const response = await aAuth.updateUser(uid, { emailVerified: verified });
        return { result: true, message: messages.VER_SUCCESS, data: response };
    } catch (e) {
        return { result: false, message: e.message };
    }
}
async function retrieveUsers(query) {
    try {
        const { limit = 20, nextPageToken } = query;
        const nLimit = Number(limit);
        const aAuth = admin.auth();
        const response = await aAuth.listUsers(nLimit, nextPageToken);
        return { result: true, message: messages.USERS_RETRIEVED, data: response.users, metaData: { limit, nextPageToken: response.pageToken } };
    } catch (e) {
        return { result: false, message: e.message };
    }
}
async function retrieveUser(params) {
    try {
        const { uid } = params;
        if (!uid) return { result: false, message: messages.NO_UID };
        const aAuth = admin.auth();
        const response = await aAuth.getUser(uid);
        return { result: true, message: messages.USERS_RETRIEVED, data: response };
    } catch (e) {
        return { result: false, message: e.message };
    }
}
async function deleteUser(query) {
    try {
        const { uid } = query;
        if (!uid) return { result: false, message: messages.NO_UID };
        const aAuth = admin.auth();
        // deleteUser method returns nothing
        await aAuth.deleteUser(uid);
        return { result: true, message: messages.USER_DELETED };
    } catch (e) {
        return { result: false, message: e.message };
    }
}
module.exports = {
    authenticate,
    createUser,
    adminVerifyUser,
    retrieveUsers,
    retrieveUser,
    deleteUser
}