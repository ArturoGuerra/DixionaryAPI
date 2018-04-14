#!/usr/bin/env nodejs
const http = require('http');
const express = require('express');
const fs = require('fs');
const bodyParser = require("body-parser");
const routes = require('./routes');
const compression = require('compression');
const minify = require('express-minify');
const path = require('path');

const app = exports.app = express();
const httpServer = http.createServer(app);

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000
const socket = process.env.SOCKET || null

app.set('host', host)
app.set('port', port)
app.set('socket', socket)

app.use(bodyParser.json());
app.use(compression());
app.use(minify());
app.use('/api', routes);

function startServer() {
  if (socket) {
    if (fs.existsSync(socket)) {
      fs.unlinkSync(socket)
    }
    httpServer.listen(socket, () => { console.log('Server listening on ' + socket) })
    fs.chmodSync(socket, '0777')
  } else {
    httpServer.listen(port, host, () => {
      console.log('Server listening on ' + host + ':' + port)
    })
  }
}

if (require.main == module) {
    startServer()
}
