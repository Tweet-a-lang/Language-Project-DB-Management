const {Tweets} = require('../models/models.js');
const testData = require('./exampleTweets.json');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const config = require('../server/config')


function seedDataBaseTweets () {
    Tweets.collection.drop()
    mongoose.connect(config.url, {useMongoClient: true})

   const tweetPromises =  testData.map((tweet) => {
        return new Tweets({
          created_at: tweet.created_at,
          id: tweet.id,
          text: tweet.text,
          entities: tweet.entities,
          user_screen_name: tweet.user.screen_name,
          user_profile_image: tweet.user.profile_image_url 
        })
        .save()
    })

    return Promise.all(tweetPromises)
    .then(data => {
        console.log('the collection of tweets was seeded with', data.length, 'tweets')
        mongoose.disconnect()
    })
    .catch(console.error)
}

seedDataBaseTweets();


// module.exports = saveTestData;