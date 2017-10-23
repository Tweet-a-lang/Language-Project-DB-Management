const fs = require('fs');
const LanguageServiceClient = require('@google-cloud/language')
  .LanguageServiceClient;

const language = new LanguageServiceClient();

//Ballenas, delfines y marsopas tienen un comportamiento casi humano. Las pruebas, aquí:  \nhttps://t.co/DCmlYodKeS… https://t.co/7hCmciTYUk


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

function normaliseTweet(tweet) {
  return tweet.split(' ').filter((word) => {
    return !word.includes('http') && !word.includes('#') && !word.includes('@') ? true : false;
  }).join(' ').trim();
}

module.exports = { syntaxOfTweet, normaliseTweet };
