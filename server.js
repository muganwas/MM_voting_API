require('dotenv').config();
require('rootpath')();
const express = require('express');
const admin = require("firebase-admin");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./_helpers/error-handler');
const httpServer = require('http').createServer({}, app);

const serviceAccount = require("./adminSDK.js").vars;
const jsonServiceAcount = JSON.parse(JSON.stringify(serviceAccount));

const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : (process.env.PORT || 8080);

admin.initializeApp({
    credential: admin.credential.cert(jsonServiceAcount),
    databaseURL: process.env.FIREBASE_DB_URL
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// add controllers
app.use('/api/v1/users', require('./controllers/users.controller'));

app.use(errorHandler);
httpServer.listen(PORT, function () {
    console.log('Server listening on port: ' + PORT);
});
