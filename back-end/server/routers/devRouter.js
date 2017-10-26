const router = require('express').Router();
const  {getAllTweets} = require('../controllers');

router.get('/tweets', getAllTweets)

module.exports = router;