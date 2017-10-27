// const saveTestData = require('../../seed/test.seed')
const { Users, Tweets } = require('../../models/models');
const { syntaxOfTweet, normaliseTweet, selectWordType, translateWord, randomWords, pickCorrectWord, filterUnseenTweets } = require('./utils');
const _ = require('underscore');

const getUser = (req, res, next) => {
  let { username } = req.params;
  Users.findOne({ name: username })
    .then(data => {
      if (!data) return next({type: 400});
      else return res.send(data);
    })
    .catch(err => {
      if(err) next({type: 500});
    });
};

const addUser = (req, res, next) => {
  const avatarUrlDefault = 'https://avatars0.githubusercontent.com/u/30082843?s=460&v=4';
  const {
    name, score = 0, completedTweets = [], avatar = avatarUrlDefault
  } = req.body;

  if(!name) return next({type: 400, msg:'missing name'});
  return Users.findOne({name: name})
    .then(user => {
      if(user) return next({type: 400, msg: 'the user already exists'});
      else {
        const newUser = new Users({name, score, completedTweets, avatar});
        newUser.save()
          .then(user => {
            res.send(user);
          })
          .catch(err => {
            if(err) next({type: 500});
          });
      }
    });

};

const completedTweet = (req, res, next) => {
  const { username, id } = req.params;
  Users.findOneAndUpdate({ name: username }, { $push: { completedTweets: id } }, { new: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      if(err) next({type: 500});
    });
};

const getAllUsers = (req, res, next) => {
  Users.find()
    .then(data => {
      res.send(data);
    }).catch(err => {
      if(err) next({type: 500});
    });
};

const getAllTweets = (req, res, next) => {
  Tweets.find()
    .then(data => {
      res.send(data);
    }).catch(err => {
      if(err) next({type: 500});
    });
};

const getUnseenTweets = (req, res ,next) => {

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
      const completedTweets = user.completedTweets;

      //Filters Tweets that have not been seen by the user
      const filteredTweets = filterUnseenTweets(completedTweets, tweets, numOfTweets);
      //Add copy of filtered tweets for future then blocks
      unseenTweets = filteredTweets.concat([]);

      const analysedTweets = filteredTweets.map(tweet => {
        return pickCorrectWord(tweet, 'ADJ');
      });
      return Promise.all(analysedTweets);
    })
    .then(wordArr => {
      const finalResult = unseenTweets.map((tweet, index) => {
        tweet = tweet.toObject();
        tweet.answers = wordArr[index];
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

const patchUser = (req, res, next) => {
  const { username } = req.params;
  const { completedTweets: tweetsDone = [], score = 0 } = req.body;

  Users.findOne({ name: username })
    .then(user => {
      if(user === null ) return next({type: 400});

      const newTweetsDone = [...user.completedTweets, ...tweetsDone];
      const newScore = user.score + score;
      user.completedTweets = newTweetsDone;
      user.score = newScore;

      user.save()
        .then(result => {
          res.send(result);
        })
        .catch(err => {
          if(err) next({type: 500});
        });
    });
};

const resetUser = (req, res, next) => {
  const { username } = req.params;
  Users.findOne({ name: username })
    .then(user => {
      user.score = 0;
      user.completedTweets = [];
      user.save();
      res.send(user);
    }).catch(err => {
      if(err) next({type: 500});
    });
};

const deleteUser = (req, res, next) => {
  const {username} = req.params;
  Users.findOneAndRemove({name: username})
    .then(user => {
      if(user === null) return next({type: 204});
      res.status(200).send(user);
    }).catch(err => {
      if(err) next({type: 500});
    });
};

module.exports = { 
  getUser, 
  addUser, 
  completedTweet, 
  getAllUsers, 
  getAllTweets, 
  getUnseenTweets, 
  getScoreboard, 
  patchUser, 
  resetUser,
  deleteUser
};
