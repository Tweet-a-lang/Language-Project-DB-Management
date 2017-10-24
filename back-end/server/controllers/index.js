// const saveTestData = require('../../seed/test.seed')
const {Users, Tweets} = require('../../models/models');


const getUser = (req, res) => {
    let {username} = req.params
    Users.findOne({name: username})
    .then(data => {
        if(data === null) return addUser(req,res)
        res.send(data)
    })
    .catch(console.error)
}

const addUser = (req, res) => {
    let {username} = req.params;

    const newUser = new Users({name: username.toLowerCase()})
       newUser.save()
        .then(data => {
            res.send(data);
        })
        .catch(console.error)
}

const increaseScore = (req, res) => {
    const {username} = req.params;
    Users.findOneAndUpdate({name: username}, { $inc: {score: 1}}, {new:true})
    .then(data => {
        res.send(data);
    })
    .catch(console.error)
}

const decreaseScore = (req, res) => {
    const {username} = req.params;
    Users.findOneAndUpdate({name: username}, {$inc: {score: -1}}, {new: true})
    .then(data => {
        res.send(data);
    })
    .catch(console.error)
}


const  completedTweet = (req, res) => {
    const {username, id} = req.params;
    Users.findOneAndUpdate({name: username},{$push: {completedTweets: id}}, {new: true})
    .then(data => {
        res.send(data);
    })
    .catch(console.error)
}

const getAllUsers = (req, res) => {
    Users.find()
    .then(data =>{
        res.send(data)
    }).catch(console.error)
}

const getAllTweets = (req, res) => {
    Tweets.find()
    .then(data => {
        res.send(data)
    }).catch(console.error);
}
module.exports = {getUser, addUser, increaseScore, decreaseScore, completedTweet, getAllUsers, getAllTweets}