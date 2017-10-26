
const _ = require('underscore');
const LanguageServiceClient = require('@google-cloud/language')
  .LanguageServiceClient;

const language = new LanguageServiceClient();
const translate = require('@google-cloud/translate')();
const ranWords = require('random-words');


function syntaxOfTweet(tweetText) {
  const document = {
    content: tweetText,
    type: 'PLAIN_TEXT',
    language: 'es'
  }

  return language.analyzeSyntax({ document: document })
    .then(results => {

      return results[0].tokens.map((word) => {
        return {
          word: word.text.content,
          type: word.partOfSpeech.tag
        };
      })
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
};

function normaliseTweet(tweetObj) {
  let tweet = '';
  const tweetText = tweetObj.text;
  const tweetLinks = tweetObj.entities.urls;

  //Removes links from tweet by referencing start and end points in tweetObj
  for (let i = 0; i < tweetLinks.length; i++) {
    if (i === 0) tweet += tweetText.slice(0, tweetLinks[i].indices[0])
    else if (i === tweetLinks.length - 1) tweet += tweetText.slice(tweetLinks[i].indices[1], tweetText.length)
    else tweet += tweetText.slice(tweetLinks[i].indices[1], tweetLinks[i + 1].indices[0])
  }

  if (tweet.length === 0) tweet = tweetText;

  return tweet.split(' ').filter((word) => {
    return !word.includes('#') && !word.includes('@') ? true : false;
  }).join(' ').trim();
};

function selectWordType(arr, type) {
  //Must support fallback option if appropriate word is not available
  let filtered = arr.filter(word => word.type === type)
  if (filtered.length === 0) filtered = arr.filter(word => word.type === 'VERB')
  if (filtered.length === 0) return null;
  const randomWord = _.sample(filtered).word
  return randomWord
};

function translateWord(word) {
  return translate.translate(word, 'en')
    .then(translation => {
      const translatedWord = translation[1].data.translations[0].translatedText
      return translatedWord
    })
    .catch(console.error)
};

function pickCorrectWord(tweet, type) {
  const finalResult = {};

  const word = selectWordType(tweet.wordArr, type);
  return translateWord(word)
    .then((translatedWord) => {
      finalResult.translatedWord = translatedWord;

      let choices = []; choices.length = 4;
      for (let i = 0; i < choices.length; i++) {
        if (i === 0) choices[i] = { text: translatedWord, result: true }
        else choices[i] = { text: ranWords(), result: false }
      }
      finalResult.choices = choices;
      return finalResult;
    })
}

function filterUnseenTweets(completedTweets, tweets, numOfTweets) {
  const filteredTweets = [];

  //Loop through tweets and push to filteredTweets if not seen
  for (let i = 0; i < tweets.length; i++) {
    if (completedTweets.indexOf(tweets[i].tweet.id) === -1) {
      filteredTweets.push(tweets[i])
    }
    if (filteredTweets.length === numOfTweets) break;
  }

  return filteredTweets;
}


module.exports = { syntaxOfTweet, normaliseTweet, selectWordType, translateWord, pickCorrectWord, filterUnseenTweets };
