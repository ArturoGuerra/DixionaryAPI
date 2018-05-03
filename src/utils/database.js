const { dixionary } = require('../models');

function get (word) {
  return new Promise((resolve, reject) => {
    dixionary.get(word, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve({
          scammer: result ? result.get('scammer') : word,
          english: word
        })
      }
    })
  })
}

function set (english, scammer) {
  return new Promise((resolve, reject) => {
    dixionary.create({ english: english, scammer: scammer }, { overwrite: false }, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

exports.get = get
exports.set = set
