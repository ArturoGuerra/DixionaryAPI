const { Router } = require('express');
const database = require('./database.js');
const redis = require('redis');

const router = Router();
const Dixionary = database.dixionary;
const client = redis.createClient();

client.on('error', function(err) {
    console.log("Error" + err);
});

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
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

function getIndex(index) {
  return index * 20
}

router.use('/fetch', function(req, res) {
  let params = {}
  if (req.query.index) {
    let raw_index = parseInt(req.query.index)
    let index = getIndex(raw_index)
    params.offset = index
    params.limit = 20
  }
  console.log(params);
  var message = [];
  Dixionary.findAll(params).then(item => {
    item.forEach(entry => {
      message.push({ english: entry.word, scammer: entry.vord });
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
