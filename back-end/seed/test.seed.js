const fs = require('fs');
const { Tweets, Users } = require('../models/models.js');

const testTweets = require('./exampleTweets.json');
const testUsers = require('./exampleUsers.json');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const config = require('../server/config');

const translate = require('@google-cloud/translate')();

const { syntaxOfTweet, normaliseTweet, selectWordType, translateWord, randomWords, pickCorrectWord } = require('../server/controllers/utils');



function seedDataBase(tweets, users) {

  if (tweets === undefined && users === undefined) return;

  mongoose.connect(config.url, { useMongoClient: true });

  if (users) {
    Users.collection.drop();
    Promise.all(users)
      .then(data => {
        console.log(`the collection of users was seeded with ${data.length} users`);
        mongoose.disconnect();
      })
      .catch(console.error);
  }

  if (tweets) {
    Tweets.collection.drop();

    Promise.all(tweets)
      .then(data => {
        console.log(`the collection of tweets was seeded with ${data.length} tweets`);
        mongoose.disconnect();
      })
      .catch(console.error);
  }
}

function seedUsers() {

  return testUsers.map((user) => {
    return new Users({
      name: user.name,
      score: user.score,
      avatar: user.avatar,
      completedTweets: user.completedTweets
    })
      .save();
  });
}

function seedTweets(vettedTweets) {

  return vettedTweets.map((tweet) => {
    return new Tweets(tweet).save();
  });
}

function cleanTweets(newTweets) {
  return newTweets.map((tweet) => {
    return {
      created_at: tweet.created_at,
      id: tweet.id,
      text: tweet.text,
      normalisedText: normaliseTweet(tweet),
      entities: tweet.entities,
      user_screen_name: tweet.user.screen_name,
      user_profile_image: tweet.user.profile_image_url,
      topic: tweet.topic
    };
  });
}

function joinTweetToSyntax(filteredSyntaxArr, normalisedTweets) {
  let tweetsAndSyntax = []
  filteredSyntaxArr.forEach((syntaxArr) => {
    normalisedTweets.forEach((tweet) => {
      if (syntaxArr[0].word == tweet.id) {
        tweetsAndSyntax.push(
          {
            tweet,
            wordArr: syntaxArr.slice(1)
          }
        );
      }
    });
  });
  return tweetsAndSyntax;
}

function filterInvalidTweets(data) {
  return data.filter((tweetSyntax) => {
    const syntaxArrayWithoutID = tweetSyntax.slice(1);
    return selectWordType(syntaxArrayWithoutID, 'ADJ') !== null;
  });
}

function vetTweets(newTweets) {
  filteredTweets = [];

  console.log('Unfiltered tweets: ' + newTweets.length);

  normalisedTweets = cleanTweets(newTweets);

  let promiseArr = normalisedTweets.map((tweet) => {
    return syntaxOfTweet(tweet.id + ' ' + tweet.normalisedText);
  });

  Promise.all(promiseArr)
    .then((data) => {

      filteredSyntaxArr = filterInvalidTweets(data);
      filteredTweets = joinTweetToSyntax(filteredSyntaxArr, normalisedTweets);


      const removedTweets = newTweets.length - filteredTweets.length;
      console.log(`Removed ${removedTweets} tweet${removedTweets === 1 ? '' : 's'} leaving ${filteredTweets.length} vetted tweets`);

      seedDataBase(seedTweets(filteredTweets), seedUsers());
    });
}

function seedDBFromJson() {
  vetTweets(testTweets);
}

module.exports = seedDBFromJson;
