require('dotenv').config();
module.exports = {
    vars: {
        "type": "service_account",
        "project_id": "mmvoting-74a0b",
        "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
        "private_key": (process.env.FIREBASE_ADMIN_PRIVATE_KEY).replace(/\\n/g, '\n'),
        "client_email": "firebase-adminsdk-prgr1@mmvoting-74a0b.iam.gserviceaccount.com",
        "storage_bucket": process.env.FIREBASE_STORAGE_BUCKET,
        "client_id": "109850905398504908210",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-prgr1%40mmvoting-74a0b.iam.gserviceaccount.com",
        "universe_domain": "googleapis.com"
    }
};