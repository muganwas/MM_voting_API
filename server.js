require('dotenv').config();
require('rootpath')();
const livereload = require('livereload');
const connectLiveReload = require("connect-livereload");
const express = require('express');
const admin = require("firebase-admin");
const firebase = require("firebase/app");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./_helpers/error-handler');

//const httpServer = require('http').createServer({}, app);
const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : (process.env.PORT || 8080);


/** firebase */
const serviceAccount = require("./adminSDK.js").vars;
const jsonServiceAcount = JSON.parse(JSON.stringify(serviceAccount));
const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DB_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
};
firebase.initializeApp(config);
admin.initializeApp({
    credential: admin.credential.cert(jsonServiceAcount),
    databaseURL: process.env.FIREBASE_DB_URL
});

/** middleware */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

/** controllers */
app.use('/api/v1/users', require('./controllers/users.controller'));
app.use('/api/v1/companies', require('./controllers/companies.controller'));
app.use('/api/v1/agencies', require('./controllers/agencies.controller'));
app.use('/api/v1/campaigns', require('./controllers/campaigns.controller'));
app.use('/api/v1/categories', require('./controllers/categories.controller'));
app.use('/api/v1/nominations', require('./controllers/nominations.controller'));
app.use('/admin', require('./controllers/admin.views.controller'));
app.use('/jury', require('./controllers/jury.views.controller'));
app.use(express.static(__dirname + '/public'));
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
    const livereloadServer = livereload.createServer();
    livereloadServer.watch(__dirname + "/public");
    livereloadServer.server.once("connection", () => {
        setTimeout(() => {
            livereloadServer.refresh("/");
        }, 100);
    });
    app.use(connectLiveReload());
}

app.listen(PORT, function () {
    console.log('Server listening on port: ' + PORT);
});
