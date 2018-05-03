const dynamo = require('dynamodb');
const Joi = require('joi');

dynamo.AWS.config.update({ region: process.env.REGION })

const dixionary = exports.dixionary = dynamo.define('dixionary', {
  hashKey: 'english',
  timestamps: false,
  schema: {
    english: Joi.string().required(),
    scammer: Joi.string().required()
  },
  tableName: 'dixionary'
})

//dynamo.createTables((err) => {
//  if (err) {
//    console.log('Error creating tables: ', err);
//  } else {
//    console.log('Tables have been created');
//  }
//})
