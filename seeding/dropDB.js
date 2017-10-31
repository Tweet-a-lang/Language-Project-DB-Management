const config = require('./config');
const mongoose = require('mongoose');
const { Tweets, Users } = require('./models/models.js');
mongoose.Promise = global.Promise;

mongoose.connect(config.url, {
    useMongoClient: true
})
    .then(() => {
        dropDB();
    })
    .catch((err) => {
        if (err) console.log('could not connect to the database');
    });

function dropDB() {
    Users.collection.drop();
    console.log('Users table dropped');
    Tweets.collection.drop();
    console.log('Tweets table dropped');
    // mongoose.disconnect();
}

