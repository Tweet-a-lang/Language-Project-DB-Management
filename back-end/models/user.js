const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: false,
    default: 0
  },
  completedTweets: {
    type: Array,
    required:false,
    default: []
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://avatars0.githubusercontent.com/u/30082843?s=460&v=4'
  }
});

module.exports = mongoose.model('user', UserSchema);