const fs = require('fs');

let JSONData = require('./data/exampleTweets.json');

JSONData = JSONData.map((tweet) => {
    tweet.topic = 'news';
    return tweet;
})

fs.writeFile('./Hello.JSON', JSON.stringify(JSONData), 'utf8', (err) => {
    if(err) console.log(err);

    console.log('File saved')
} )