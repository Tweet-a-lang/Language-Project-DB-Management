const fs = require('fs');
const _ = require('underscore');
const LanguageServiceClient = require('@google-cloud/language')
  .LanguageServiceClient;

const language = new LanguageServiceClient();
const translate = require('@google-cloud/translate')();


function syntaxOfTweet(tweetText) {
  
  const document = {
    content: tweetText,
    type: 'PLAIN_TEXT'
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
}

//Ballenas, delfines y marsopas tienen un comportamiento casi humano. Las pruebas, aquí:  \nhttps://t.co/DCmlYodKeS… https://t.co/7hCmciTYUk

function normaliseTweet(tweetObj) {
  
  let tweet = '';
  const tweetText = tweetObj.text;
  const tweetLinks = tweetObj.entities.urls;

  //Removes links from tweet by referencing start and end points in tweetObj
  for (let i = 0; i < tweetLinks.length; i++) {
    if (i === 0) tweet += tweetText.slice(0, tweetLinks[i].indices[0])
    else if(i === tweetLinks.length - 1) tweet += tweetText.slice(tweetLinks[i].indices[1], tweetText.length)
    else tweet += tweetText.slice(tweetLinks[i].indices[1], tweetLinks[i+1].indices[0])
  }

  return tweet.split(' ').filter((word) => {
    return !word.includes('#') && !word.includes('@') ? true : false;
  }).join(' ').trim();
}

function selectWordType(arr, type){
  //Must support fallback option if appropriate word is not available
  const filtered = arr.filter(word => word.type === type)
  return _.sample(filtered).word
}

function translateWord(word) {
  return translate.translate(word, 'en')
  .then(translation => {
    const translatedWord = translation[1].data.translations[0].translatedText
    return translatedWord
  })
  .catch(console.error)
}
module.exports = { syntaxOfTweet, normaliseTweet, selectWordType, translateWord };
