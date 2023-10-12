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
    const { uid, value } = body;
    const verified = Boolean(value);
    if (!uid) return { result: false, message: messages.NO_UID };
    if (typeof verified !== 'boolean') return { result: false, message: messages.NO_VERIFICATION_VALUE };
    const aAuth = admin.auth();
    const response = await aAuth.updateUser(uid, { emailVerified: verified });
    return { result: true, message: messages.VER_SUCCESS, data: response };
}
module.exports = {
    authenticate,
    createUser,
    adminVerifyUser
}