const { get } = require('./database');

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
    let result = await get(word)
    return result.scammer
  } catch (e) {
    return word
  }
}

exports.verifyMessageBody = verifyMessageBody
exports.TranslateBody = TranslateBody
