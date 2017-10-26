
const Twit = require('twit');
const T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

function crawlTwitter (req, res) {
    res.send('Hello, I am a web crawler')
    //get topic-specific twitter handles
    //get # number of recent tweets
    //get all tweets from DB
    //compare DB and tweets to find new tweets
    //normalise tweets
    //add to DB
}

module.exports = crawlTwitter;