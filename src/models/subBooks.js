const mongoose = require('mongoose');

const subBookSchema = mongoose.Schema({
    data: String,
    parentId: String,
    ChildrenId: Array
});

module.exports = mongoose.model('subBook',subBookSchema);