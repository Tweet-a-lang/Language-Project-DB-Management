const router = require('express').Router();
const {getAllTweets, resetUser, deleteUser} = require('../controllers');
const crawlTwitter = require('../../seed/tweetCrawler.js');

router.get('/tweets', getAllTweets);
router.get('/reset/:username', resetUser);
router.delete('/delete/:username', deleteUser);
router.get('/crawlTwitter/:count', crawlTwitter);
//Seed DB endpoint

module.exports = router;