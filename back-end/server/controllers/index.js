// const saveTestData = require('../../seed/test.seed')
const { Users, Tweets } = require('../../models/models');
const { syntaxOfTweet, normaliseTweet, selectWordType, translateWord, randomWords, pickCorrectWord } = require('./utils');
const _ = require('underscore');

const getUser = (req, res, next) => {
  let { username } = req.params;
  Users.findOne({ name: username })
    .then(data => {
      if (data === null) return next({type: 403});
      else res.send(data);
    })
    .catch(console.error);
};

const addUser = (req, res, next) => {
  const avatarUrlDefault = 'https://avatars0.githubusercontent.com/u/30082843?s=460&v=4';
  // const newUser = new Users({ name: username.toLowerCase() })
  // newUser.save()
  //     .then(data => {
  //         res.send(data);
  //     })
  //     .catch(console.error)
  const {
    name, score = 0, completedTweets = [], avatar = avatarUrlDefault
  } = req.body;
  if(!name) return next({type: 403, msg:'missing name'});
  const newUser = new Users({name, score, completedTweets, avatar});
  newUser.save()
    .then(user => {
      res.send(user);
    })
    .catch(console.error);
};

const increaseScore = (req, res) => {
  const { username } = req.params;
  Users.findOneAndUpdate({ name: username }, { $inc: { score: 1 } }, { new: true })
    .then(data => {
      res.send(data);
    })
    .catch(console.error);
};

const decreaseScore = (req, res) => {
  const { username } = req.params;
  Users.findOneAndUpdate({ name: username }, { $inc: { score: -1 } }, { new: true })
    .then(data => {
      res.send(data);
    })
    .catch(console.error);
};


const completedTweet = (req, res) => {
  const { username, id } = req.params;
  Users.findOneAndUpdate({ name: username }, { $push: { completedTweets: id } }, { new: true })
    .then(data => {
      res.send(data);
    })
    .catch(console.error);
};

const getAllUsers = (req, res) => {
  Users.find()
    .then(data => {
      res.send(data);
    }).catch(console.error);
};

const getAllTweets = (req, res) => {
  Tweets.find()
    .then(data => {
      res.send(data);
    }).catch(console.error);
};

const getUnseenTweets = (req, res) => {

  const numOfTweets = +req.query.count || 5;
  let unseenTweets = [];
  const { username } = req.params;
  return Promise.all([
    Users.findOne({ name: username }),
    Tweets.find()
  ])
    .then((data) => {
      const user = data[0];
      const tweets = data[1];

            
      //Filters Tweets that have not been seen by the user
      const completedTweets = user.completedTweets;
      const filteredTweets = [];

      //Loop through tweets and push to filteredTweets if not seen
      for (let i = 0; i < tweets.length; i++) {
        if (completedTweets.indexOf(tweets[i].tweet.id) === -1) {
          filteredTweets.push(tweets[i]);
        }
        if (filteredTweets.length === numOfTweets) break;
      }

      unseenTweets = filteredTweets.concat([]);

      const analysedTweets = filteredTweets.map(tweet => {
        return pickCorrectWord(tweet, 'ADJ');
      });
      return Promise.all(analysedTweets);
    })
    .then(arr => {
      const finalResult = unseenTweets.map((tweet, index) => {
        tweet = tweet.toObject();
        tweet.answers = arr[index];
        //remove wordArr from client result
        delete tweet.wordArr;
        return tweet;
      });
      res.send(finalResult);
    })
    .catch(console.error);
};

const getScoreboard = (req, res) => {
  Users.find()
    .then(users => {
      const scoresArray = users.map(user => {
        user = user.toObject();
        const { name, score } = user;
        return { name, score };
      })
        .sort((a, b) => {
          return a.score < b.score;
        });
      res.send(scoresArray);
    });
};

const patchUser = (req, res) => {
  const { username } = req.params;
  const { completedTweets: tweetsDone = [], score = 0 } = req.body;
  Users.findOne({ name: username })
    .then(user => {
      const newTweetsDone = [...user.completedTweets, ...tweetsDone];
      const newScore = user.score + score;
      user.completedTweets = newTweetsDone;
      user.score = newScore;
      user.save();
      res.send(user);
    })
    .catch(console.error);
};

const resetUser = (req, res) => {
  const { username } = req.params;
  Users.findOne({ name: username })
    .then(user => {
      user.score = 0;
      user.completedTweets = [];
      user.save();
      res.send(user);
    });
};

module.exports = { getUser, addUser, increaseScore, decreaseScore, completedTweet, getAllUsers, getAllTweets, getUnseenTweets, getScoreboard, patchUser, resetUser };