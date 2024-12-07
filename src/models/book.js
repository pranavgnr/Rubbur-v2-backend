const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    data: String,
    parentId: String,
    ChildrenId: Array
});

module.exports = mongoose.model('Book', bookSchema);