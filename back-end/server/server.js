const express = require('express');
const app = express();
const PORT = 3001
const config = require('./config');
const mongoose = require('mongoose');
const {getUser, addUser, increaseScore, decreaseScore, completedTweet, getAllUsers, getAllTweets} = require('./controllers')

mongoose.Promise = global.Promise;

mongoose.connect(config.url, {
    useMongoClient:true
})
.then(() => {
    console.log('connected')
})
.catch(console.error);

app.get('/', (req, res) => {
    res.send('the root is working')
})
// app.get('/user', (req, res) => {
//     saveTestData()
//     .then((user) => {
//         res.send(user);
//     })
// })

// app.get('/data', (req, res) => {
//     User.find()
//     .then(data => {
//         res.send(data)
//     })
// })
app.get('/api/user/:username', getUser)
app.get('/api/user/:username/score_up', increaseScore)
app.get('/api/user/:username/score_down', decreaseScore)
app.get('/api/user/:username/tweet/:id', completedTweet)
app.get('/api/user', getAllUsers)

app.get('/api/tweets', getAllTweets)

app.listen(PORT, () => {
    console.log(`THE server is listening on port ${PORT}`)
})