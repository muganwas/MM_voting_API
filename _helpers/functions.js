require('dotenv').config();
const admin = require('firebase-admin');

module.exports.validateFirebaseUser = async (bearerToken) => {
    const idToken = bearerToken.split(" ")[1];
    try {
        const result = await admin.auth().verifyIdToken(idToken);
        if (result.uid)
            return true;
        return false;
    } catch (e) {
        return false;
    }
}

module.exports.validateFirebaseAdmin = async (bearerToken) => {
    const idToken = bearerToken.split(" ")[1];
    try {
        const result = await admin.auth().verifyIdToken(idToken);
        if (result.uid && result.email === process.env.FIREBASE_ADMIN_EMAIL)
            return true;
        return false;
    } catch (e) {
        return false;
    }
}