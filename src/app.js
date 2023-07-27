const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();

// Middleware
app.use(cors());
app.use(express.static('static'));
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
// app.use(multer().any());

app.use('', routes);

module.exports = app;
