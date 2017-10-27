
const Twit = require('twit');
const T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const topics = {
    // sport: [],
    // news: [],
    food: ['TastyFoodMx', 'GuerreroSagarpa', 'robinfood']
}

function crawlTwitter(req, res) {

    const tweetCount = req.params.count || 5;

    let tweetPromiseArr = [];


    for(key in topics) {
        topics[key].forEach((topicHandle) => {
            tweetPromiseArr.push(T.get(`statuses/user_timeline`, { screen_name: topicHandle, count: tweetCount }));
        })
    }

    // Object.keys(topics).map((topic) => {
    //     for (let i = 0; i < topics[topic].length; i++) {
    //         tweetPromiseArr.push(T.get(`statuses/user_timeline`, { screen_name: topics[topic][i], count: tweetCount }));
    //     }
    // })

    Promise.all(tweetPromiseArr)
        .then((data) => {
            res.send(data)
        })

    //get topic-specific twitter handles
    //get # number of recent tweets
    //get all tweets from DB
    //compare DB and tweets to find new tweets
    //normalise tweets
    //add to DB
}

module.exports = crawlTwitter;
