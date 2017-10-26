const router = require('express').Router();
const  {getUser, increaseScore, decreaseScore, completedTweet, getAllUsers, getUnseenTweets, getScoreboard, patchUser} = require('../controllers');

router.get('/user/:username', getUser)
router.get('/user/:username/score_up', increaseScore)
router.get('/user/:username/score_down', decreaseScore)
// router.get('/user/:username/tweet/:id', completedTweet)
router.get('/user', getAllUsers)
router.get('/tweets/:username', getUnseenTweets)



router.get('/scoreboard', getScoreboard)

router.patch('/user/:username', patchUser)
// router.get('scoreboard/:username', getUserScore)
module.exports = router;