const mongoose = require('mongoose');

const Link = new mongoose.Schema({
   original: String,
});

module.exports = mongoose.model('Link', Link);