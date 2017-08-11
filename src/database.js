const Sequelize = require('sequelize');
const sequelize = new Sequelize('dixionary', 'dixionary', 'D!x!0nary', {host: 'mysqldb.local', dialect: 'mysql'});

const Dixionary = exports.dixionary = sequelize.define('dixionary', {
    word: { type: Sequelize.STRING , primaryKey: true},
    vord: { type: Sequelize.STRING }
    },{
    freezeTableName: true,
    TableName: 'dixionary',
    timestamps: false}
);




