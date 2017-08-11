#!/usr/bin/env nodejs
const dixionaryapi = require('./dixionaryapi');
const app = dixionaryapi.app;

app.listen("8080", onListening);

function onListening() {
    console.log("Listening on port 8080");
}
