const saveTestData = require('../../seed/test.seed')
const {Users} = require('../../models/models');


const getUser = (req, res) => {
    let {username} = req.params
    Users.findOne({name: username})
    .then(data => {
        res.send(data)
    })
    .catch(console.error)
}

const addUser = (req, res) => {
    let {username} = req.params;
    // return Users.save({
    //     name: username.toLowerCase()
    // })
    // .then(data => {
    //     res.send(data)
    // })
    // .catch(console.error)
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
module.exports = {getUser, addUser, increaseScore, decreaseScore}