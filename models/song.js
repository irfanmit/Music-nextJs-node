
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  path: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Song', songSchema);



