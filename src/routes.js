const dixionaryapi = require('./dixionaryapi.js');
const express = require('express');
const app = dixionaryapi.app;
const router = express.Router();
const database = require('./database.js');
const redis = require('redis');
var Dixionary = database.dixionary;
var client = redis.createClient();

client.on('error', function(err) {
    console.log("Error" + err);
});

router.use('/get', function(req, res) {
    var message = [];
    try {
        var reqmessage = req.body.message.split(' ');
    } catch (e) {
        var reqmessage = [];
        console.log("DixionaryAPI: 400 Bad Request");
        res.status(400).send("400 Bad Request");
    }
    var indexs = 0;
    reqmessage.forEach((word,index,array) => {
        client.get(word, function(clienterr, clientres) {
            if (clientres) {
                indexs++;
                var result = clientres;
                message.push({scammer: result, english: word});
            } else {
                var wait = true;
                Dixionary.findOne({ where: {word: word}}).then(function(result) {
                    if (result) {
                        client.set(word, result.vord);
                        message.push({scammer: result.vord, english: word});
                    } else {
                        message.push({scammer: word, english: word});
                    }
                    indexs++;
                    if ((wait) && indexs == array.length) { res.json(message);};
                })
            }
            if ((!wait) && indexs == array.length) {
                console.log("Done");
                res.json(message);
            }
        });
    });
});


router.use('/fetch', function(req, res) {
    var message = [];
    Dixionary.findAll({}).then(item => {
        item.forEach(entry => {
            message.push({english: entry.word, scammer: entry.vord});
        });
        res.json(message);
    });
});


router.use('/status', function(req, res) {
    var responce = {
        description: "api",
        apiname: "dixionary",
        status: "operational"
    }
    res.json(responce);
});


module.exports = router
