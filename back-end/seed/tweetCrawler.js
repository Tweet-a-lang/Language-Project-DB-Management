const vetTweets = require('./test.seed.js');
const { Tweets, Users } = require('../models/models.js');
const { syntaxOfTweet, normaliseTweet, selectWordType, translateWord, randomWords, pickCorrectWord, filterUnseenTweets } = require('../server/controllers/utils');
const Twit = require('twit');
const fs = require('fs');
const T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

function getTweets(handle, topic, count) {
    return T.get(`statuses/user_timeline`, { screen_name: handle, count: count })
        .then(rawTweets => {
            return rawTweets.data.map((tweet) => {
                tweet.topic = topic;
                return tweet;
            })
        })
}

function crawlTwitter(req, res, next) {

    const topics = {
        food: ['TastyFoodMx'], //FOOD
        sport: ['GuerreroSagarpa'], //SPORT
        film: ['robinfood']  //FILM
    }

    const tweetCount = req.params.count || 5;
    let newTweetArr = [];

    let tweetPromiseArr = [];

    for (key in topics) {
        const topicPromises = topics[key].map((handle) => {
            return getTweets(handle, key, tweetCount)
        })
        tweetPromiseArr = tweetPromiseArr.concat(topicPromises)
        
    }

    Promise.all(tweetPromiseArr)
        .then(data => {

            newTweetArr = data.reduce((acc, tweetsByTopic) => {
                return acc.concat(tweetsByTopic)
            }, []);

            console.log(`newTweetArr length is ${newTweetArr.length}`);

            Tweets.find()
            .then(DBTweets => {

                console.log(`DBTweetArr length is ${DBTweets.length}`)
                
                let filteredTweets = newTweetArr.concat();
                newTweetArr.forEach((newTweet, i) => {
                    DBTweets.forEach((DBTweet) => {
                        if (DBTweet.id === newTweet.id) filteredTweets.splice(i, 1);
                    })
                })

                console.log(`${filteredTweets.length} new tweets to add`)
                vetTweets(newTweetArr);
            })

        })
        .catch(err => {
            if (err) console.log(err)
        })
}

module.exports = crawlTwitter;
