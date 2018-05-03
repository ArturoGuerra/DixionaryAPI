const cors = require('cors');
const { Router } = require('express');
const { verifyMessageBody, TranslateBody } = require('./utils/middleware');

const router = Router();

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

module.exports = router
