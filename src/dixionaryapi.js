#!/usr/bin/env nodejs
const http = require('http');
const express = require('express');
const fs = require('fs');
const redis = require('redis');
const bodyParser = require("body-parser");
const routes = require('./routes');
const compression = require('compression');
const minify = require('express-minify');
const path = require('path');

const app = exports.app = express();

app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(minify());
app.use('/api', routes);

function startServer() {
    // Creates unix socket
    var socketfile = path.join(__dirname, "dixionaryapi.sock");
    fs.unlink(socketfile, (err) => {
        if (err) {
            console.log("Socket file doesn't exist");
        } else {
            console.log("Removed socket file");
        }
    });
    var server = http.createServer(app);
    server.listen(socketfile);
    server.on('listening', onListening);
    function onListening() {
        fs.chmodSync(socketfile, '775');
        console.log("Started unix socked");
    };

    // Deletes socket file
    function servershutdown () {
        server.close();
    }
    process.on('SIGINT', servershutdown);
}

if (require.main == module) {
    startServer()
}
