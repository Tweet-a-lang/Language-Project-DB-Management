const router = require('express').Router();
const {getAllTweets, resetUser} = require('../controllers');
const crawlTwitter = require('../../../seed/tweetCrawler.js');

router.get('/tweets', getAllTweets);
router.get('/reset/:username', resetUser);
router.get('/crawlTwitter', crawlTwitter);
//Seed DB endpoint

module.exports = router;