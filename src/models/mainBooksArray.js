const mongoose = require('mongoose');

const mainBookArray = new mongoose.Schema({
    arrayOfIds: Array
})

module.exports = mongoose.model('mainBookArray', mainBookArray);