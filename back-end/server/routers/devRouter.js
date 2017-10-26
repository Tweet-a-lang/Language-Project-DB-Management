const router = require('express').Router();
const  {getAllTweets, resetUser} = require('../controllers');

router.get('/tweets', getAllTweets);
router.get('/reset/:username', resetUser);

module.exports = router;