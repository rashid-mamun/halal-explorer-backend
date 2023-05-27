const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const app = express();

// middleware
app.use(cors());
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb' }));


app.use('', routes);

module.exports = app;
