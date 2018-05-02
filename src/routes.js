const cors = require('cors');
const { Router } = require('express');
const database = require('./database.js');

const router = Router();
const Dixionary = database.dixionary;

router.use(cors())

router.get('/get', verifyMessageBody, TranslateBody, async (req, res) => {
  res.json(req.message);
});


router.get('/translate', verifyMessageBody, TranslateBody, async (req, res) => {
  let message = req.message
  let result = ''

  for (let i =0; i < message.length; i++) {
    result = result + ' ' + message[i].scammer
  }

  let parsed = result.replace(/(^\s+|\s+$)/g,'')

  res.send(parsed)
})

router.get('/fetch', (req, res) => {
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

function getIndex (index) {
  return index * 20
}

function verifyMessageBody (req, res, next) {
  try {
    let message = req.query.message.split(' ');
    req.message = message;
    next()
  } catch (e) {
    console.log("DixionaryAPI: 400 Bad Request");
    res.status(400).send("400 Bad Request");
  }
}

async function Translate (word) {
  try {
    let result = await Dixionary.findOne({ where: { word: word } })
    return result.vord
  } catch (e) {
    return word
  }
}

async function TranslateBody (req, res, next) {
  let message = []
  let req_message = req.message

  for (let i = 0; i < req_message.length; i++) {
    let word = req_message[i]
    let vord = await Translate(word)
    message.push({ scammer: vord, english: word })
  }

  req.message = message
  next()
}

module.exports = router
