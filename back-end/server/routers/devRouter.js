const router = require('express').Router();
const {getAllTweets, resetUser, deleteUser, getNumOfTweets} = require('../controllers');
const crawlTwitter = require('../../seed/tweetCrawler.js');
const seedDB = require('../../seed/test.seed.js');

router.get('/tweets', getAllTweets);
router.get('/numoftweets', getNumOfTweets);
router.get('/reset/:username', resetUser);
router.delete('/delete/:username', deleteUser);
router.get('/crawlTwitter/:count', crawlTwitter);
router.get('/seedDB', seedDB);
//Seed DB endpoint

module.exports = router; 
