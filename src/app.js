const express = require('express');
const routes = require('./routes');
const app = express();

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb' }));


app.use('', routes);

module.exports = app;
