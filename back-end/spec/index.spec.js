const {expect} = require('chai');
const {syntaxOfTweet, normaliseTweet, selectWordType} = require('../index.js');
const exampleTweets = require('../exampleTweets.json');

const text = exampleTweets[0].text;//Math.floor(Math.random() * exampleTweets.length)].text;
const exampleWordTypes = 
[ { word: 'Ballenas', type: 'NOUN' },
{ word: ',', type: 'PUNCT' },
{ word: 'delfines', type: 'NOUN' },
{ word: 'y', type: 'CONJ' },
{ word: 'marsopas', type: 'NOUN' },
{ word: 'tienen', type: 'VERB' },
{ word: 'un', type: 'DET' },
{ word: 'comportamiento', type: 'NOUN' },
{ word: 'casi', type: 'ADV' },
{ word: 'humano', type: 'ADJ' },
{ word: '.', type: 'PUNCT' },
{ word: 'Las', type: 'DET' },
{ word: 'pruebas', type: 'NOUN' },
{ word: ',', type: 'PUNCT' },
{ word: 'aquí', type: 'ADV' },
{ word: ':', type: 'PUNCT' } ]

describe('#syntaxOfTweet', () => {
    it('is a function', () => {
        expect(syntaxOfTweet).to.be.a('function');
    });

    it('returns an array of words and their type', () => {
        syntaxOfTweet(text)
            .then(answer => {
                expect(answer).to.be.a('array');
            })
    })
});

describe('#normaliseTweet', () => {
    it('is a function', () => {
        expect(normaliseTweet).to.be.a('function');
    });

    it('should loop through tweetObj and remove links', () => {
        const testTweet = exampleTweets[0];
        expect(normaliseTweet(testTweet)).to.equal('Ballenas, delfines y marsopas tienen un comportamiento casi humano. Las pruebas, aquí:');
    })
});

describe('#normaliseTweet => #syntaxOfTweet', () => {
    it('should return an array', () => {
        const filteredTweet = normaliseTweet(exampleTweets[0]);
        syntaxOfTweet(filteredTweet).then(answer => {
            expect(answer).to.be.an('array');
        });
        
    });
})

describe.only('#selectWordType', () => {
    it('it should return a string', () => {
        const randomWord = selectWordType(exampleWordTypes, 'ADJ')
        console.log(randomWord)
        expect(randomWord).to.be.a('string')
    })
})
//To Do's

//word, word 
//Symbols
//Edge cases for tweets with no links, or only links