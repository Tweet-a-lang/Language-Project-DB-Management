const router = require('express').Router();
const  {getUser, addUser, completedTweet, getAllUsers, getUnseenTweets, getScoreboard, patchUser} = require('../controllers');

router.get('/user/:username', getUser);
router.post('/user', addUser);
router.get('/user', getAllUsers);
router.get('/tweets/:username', getUnseenTweets);
router.get('/scoreboard', getScoreboard);
router.patch('/user/:username', patchUser);

module.exports = router;