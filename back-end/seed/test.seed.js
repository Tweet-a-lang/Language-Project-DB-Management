const {Tweets, Users} = require('../models/models.js');

const testData = require('./exampleTweets.json');
const testUsers = require('./exampleUsers.json');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const config = require('../server/config')


function seedDataBase () {
    
    mongoose.connect(config.url, {useMongoClient: true})

    Tweets.collection.drop()
    Users.collection.drop()

    Promise.all(seedUsers())
    .then(data => {
        console.log('the collection of users was seeded with', data.length, 'users')
        mongoose.disconnect()
    })
    .catch(console.error)

    Promise.all(seedTweets())
    .then(data => {
        console.log('the collection of tweets was seeded with', data.length, 'tweets')
        mongoose.disconnect()
    })
    .catch(console.error)
}

function seedUsers () {
    
    return testUsers.map((user) => {
        return new Users({
            name: user.name,
            score: user.score,
            avatar: user.avatar,
            completedTweets: user.completedTweets
        })
        .save()
    });
}

function seedTweets () {
    return testData.map((tweet) => {
        return new Tweets({
          created_at: tweet.created_at,
          id: tweet.id,
          text: tweet.text,
          entities: tweet.entities,
          user_screen_name: tweet.user.screen_name,
          user_profile_image: tweet.user.profile_image_url 
        })
        .save()
    });
}

seedDataBase();