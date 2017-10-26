// const saveTestData = require('../../seed/test.seed')
const { Users, Tweets } = require('../../models/models');
const { syntaxOfTweet, normaliseTweet, selectWordType, translateWord, randomWords, pickCorrectWord } = require('./utils');

const getUser = (req, res) => {
    let { username } = req.params
    Users.findOne({ name: username })
        .then(data => {
            if (data === null) return addUser(req, res)
            res.send(data)
        })
        .catch(console.error)
};

const addUser = (req, res) => {
    let { username } = req.params;

    const newUser = new Users({ name: username.toLowerCase() })
    newUser.save()
        .then(data => {
            res.send(data);
        })
        .catch(console.error)
};

const increaseScore = (req, res) => {
    const { username } = req.params;
    Users.findOneAndUpdate({ name: username }, { $inc: { score: 1 } }, { new: true })
        .then(data => {
            res.send(data);
        })
        .catch(console.error)
};

const decreaseScore = (req, res) => {
    const { username } = req.params;
    Users.findOneAndUpdate({ name: username }, { $inc: { score: -1 } }, { new: true })
        .then(data => {
            res.send(data);
        })
        .catch(console.error)
};


const completedTweet = (req, res) => {
    const { username, id } = req.params;
    Users.findOneAndUpdate({ name: username }, { $push: { completedTweets: id } }, { new: true })
        .then(data => {
            res.send(data);
        })
        .catch(console.error)
};

const getAllUsers = (req, res) => {
    Users.find()
        .then(data => {
            res.send(data)
        }).catch(console.error)
};

const getAllTweets = (req, res) => {
    Tweets.find()
        .then(data => {
            res.send(data)
        }).catch(console.error);
};

const getUnseenTweets = (req, res) => {
    /*
    Get numb of needed tweets
    Get the username
    Get the users seen tweets from the database
    Get all tweets from database
    filter Tweets based on userSeen Tweets
        Send batch of tweets to natural language processing
        Select and translate a word from each tweet
            Select random words for each Tweet
            Combine and Send

    */
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

            // unseenTweets.forEach((tweet,index) => {
            //     unseenTweets[index] = tweet[index];
            // })


            //Filters Tweets that have not been seen by the user
            const completedTweets = user.completedTweets
            const filteredTweets = [];
            for (let i = 0; i < tweets.length; i++) {
                if (completedTweets.indexOf(tweets[i].id) === -1) {
                    filteredTweets.push(tweets[i])
                }
                if (filteredTweets.length === numOfTweets) break;
            }

                unseenTweets = filteredTweets.concat([]);
 
               const analysedTweets = filteredTweets.map(tweet => {
                   return pickCorrectWord(tweet, 'ADJ')
                })
                return Promise.all(analysedTweets)
        })
        .then(arr => {
            const finalResult = unseenTweets.map((tweet, index) => {
                tweet = tweet.toObject()
                tweet.answers = arr[index]
                return tweet;
            });
            res.send(finalResult)
        })
        .catch(console.error)
};

const getScoreboard = (req, res) => {
    Users.find()
    .then(users => {
        const scoresArray = users.map(user => {
            user = user.toObject();
            const {name, score} = user
            return {name, score}
        })
        .sort((a,b) => {
            return a.score < b.score
        })
        res.send(scoresArray);
    })
}

const patchUser = (req, res) => {
    const {username} = req.params;
    const {completedTweets : tweetsDone} = req.body
    Users.findOne({name: username})
    .then(user => {
        const newTweetsDone = [...user.completedTweets, ...tweetsDone]
        user.completedTweets = newTweetsDone;
        user.save();
        res.send(JSON.stringify(user))
    })
    .catch(console.error)
}

module.exports = { getUser, addUser, increaseScore, decreaseScore, completedTweet, getAllUsers, getAllTweets, getUnseenTweets, getScoreboard , patchUser};