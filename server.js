require('dotenv').config();
require('rootpath')();
const express = require('express');
const admin = require("firebase-admin");
const firebase = require("firebase/app");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./_helpers/error-handler');
const httpServer = require('http').createServer({}, app);

const serviceAccount = require("./adminSDK.js").vars;
const jsonServiceAcount = JSON.parse(JSON.stringify(serviceAccount));
const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DB_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
};

/**firebase initialization */
firebase.initializeApp(config);
admin.initializeApp({
    credential: admin.credential.cert(jsonServiceAcount),
    databaseURL: process.env.FIREBASE_DB_URL
});

const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : (process.env.PORT || 8080);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// add controllers
app.use('/api/v1/users', require('./controllers/users.controller'));

app.use(errorHandler);
httpServer.listen(PORT, function () {
    console.log('Server listening on port: ' + PORT);
});
