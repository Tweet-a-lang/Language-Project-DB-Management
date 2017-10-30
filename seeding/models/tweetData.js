const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetDataSchema = new Schema({
  tweet: {
    created_at: {
      type: String,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    entities: {
      type: Schema.Types.Mixed,
      required: true
    },
    user_screen_name: {
      type: String,
      required: true
    },
    user_profile_image: {
      type: String,
      required: true
    },
    topic: {
      type: String,
      required: false,
      default: 'misc'
    }
  },
  wordArr: {
    type: Schema.Types.Mixed,
    required: true
  }
});

module.exports = mongoose.model('tweetData', TweetDataSchema);