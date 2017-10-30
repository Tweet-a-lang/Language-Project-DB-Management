const config = require('./config');
const mongoose = require('mongoose');
const { Tweets, Users } = require('./models/models.js');

const testTweets = require('./data/exampleTweets.json');
const testUsers = require('./data/exampleUsers.json');

const translate = require('@google-cloud/translate')();

const { syntaxOfTweet, normaliseTweet, selectWordType } = require('./utils');

mongoose.Promise = global.Promise;

if (process.env.tweetsFromJSON === true || process.env.usersFromJSON === true) {

    mongoose.connect(config.url, {
        useMongoClient: true
    })
        .then(() => {
            console.log('connected');
        })
        .catch((err) => {
            if (err) console.log('could not connect to the database');
        });
}


function vetTweets(newTweets) {
    filteredTweets = [];

    console.log('Unvetted tweets: ' + newTweets.length);

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
            // seedTweets(filteredTweets)
            seedDataBase(seedTweets(filteredTweets));
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

function filterInvalidTweets(data) {
    return data.filter((tweetSyntax) => {
        const syntaxArrayWithoutID = tweetSyntax.slice(1);
        return selectWordType(syntaxArrayWithoutID, 'ADJ') !== null;
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

function seedTweets(vettedTweets) {

    return vettedTweets.map((tweet) => {
        // console.log(tweet)
        return new Tweets(tweet).save();
    });
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

function seedDataBase(tweets, users) {

    if (tweets === undefined && users === undefined) return;

    mongoose.connect(config.url, { useMongoClient: true });

    if (users) {

        if (+process.env.usersFromJSON) Users.collection.drop();

        Promise.all(users)
            .then(data => {
                console.log(`the DB of users was seeded with ${data.length} users`);
                console.log('Seeding complete!');

                Users.find().count()
                .then(amount => {
                    console.log(`Total of ${amount} users in DB`);
                    mongoose.disconnect();
                });

            })
            .catch(console.error);
    }

    if (tweets) {

        if (+process.env.tweetsFromJSON) Tweets.collection.drop();

        Promise.all(tweets)
            .then(data => {
                console.log(`the DB of tweets was seeded with ${data.length} tweets`);
                console.log('Seeding complete!');

                Tweets.find().count()
                .then(amount => {
                    console.log(`Total of ${amount} users in DB`);
                    mongoose.disconnect();
                });

            })
            .catch(console.error);
    }
}

if (+process.env.tweetsFromJSON) vetTweets(testTweets);
if (+process.env.usersFromJSON) seedDataBase(undefined, seedUsers());


module.exports = vetTweets;
