const {expect} = require('chai');
const {syntaxOfTweet, normaliseTweet, selectWordType, translateWord, randomWords, pickCorrectWord} = require('../tweetAnalysis.js');
// const exampleTweets = require('../exampleTweets.json');
const _ = require('underscore')
const axios = require('axios')
// const text = exampleTweets[0].text;//Math.floor(Math.random() * exampleTweets.length)].text;
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

describe.only('#syntaxOfTweet', () => {
    let text;
    beforeEach(() => {
         axios.get('http://localhost:3001/api/tweets')
        .then(data => {
            text = data
        })
        .catch(console.error)

    }) 
    it('is a function', () => {
        expect(syntaxOfTweet).to.be.a('function');
    });

    it('returns an array of words and their type', () => {
        let tweetText = text
        console.log(tweetText)
        return syntaxOfTweet(tweetText)
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
        const answer = 'Ballenas, delfines y marsopas tienen un comportamiento casi humano. Las pruebas, aquí:';
        expect(normaliseTweet(testTweet)).to.equal(answer);
    })
    it('should return a string when there are no links in the tweet', () => {
        const testTweet = exampleTweets[0];
        testTweet.entities.urls = [];
        expect(normaliseTweet(testTweet)).to.equal(testTweet.text)
    })
});

describe('#normaliseTweet => #syntaxOfTweet', () => {
    it('should return an array', () => {
        const filteredTweet = normaliseTweet(exampleTweets[0]);
        return syntaxOfTweet(filteredTweet).then(answer => {
            expect(answer).to.be.an('array');
        });
        
    });
})

describe('#selectWordType', () => {
    it('it should return a string', () => {
        const randomWord = selectWordType(exampleWordTypes, 'ADJ')
        console.log(randomWord)
        expect(randomWord).to.be.a('string')
    })
})

describe('#translateWord', () => {
    it('should return a string', () => {
        return translateWord('hola')
        .then((word) => {
            console.log(word)
            expect(word).to.equal('Hello')
        })
    })
    it('translates a word chosen from a tweet', () => {
        return translateWord('manzanas')
        .then((word) => {
            console.log(word)
            expect(word).to.equal('apples')
        })
    })
    it('translates a chosen verb from a tweet', () => {
        return translateWord('juego')
        .then((word) => {
            console.log(word)
            expect(word).to.equal('game')
        });
    });
});

describe('#normaliseTweet => #syntaxOfTweet => #selectWordType => #translateWord', () => {
    it('it returns a string', () => {
        const filteredTweet = normaliseTweet(exampleTweets[0]);
        return syntaxOfTweet(filteredTweet)
            .then(arr => {
                return selectWordType(arr, 'ADJ')
            })
            .then(str => {
                return translateWord(str)
            })
            .then(result => {
                expect(result).to.equal('human')
            })
    });
});

describe('#randomWords', () => {
    it('it returns an array', () => {
        const result = randomWords(5);
        expect(result).to.be.a('array');
        expect(result.length).to.equal(5);
    });
});

describe('#pickCorrectWord', () => {
    it('returns an object with correct word and an array of choices', () => {
        const tweet = exampleTweets[0]
        return pickCorrectWord(tweet, 'ADJ')
        .then(choices => {
            expect(choices).to.be.a('object')
            expect(choices.chosenWord).to.be.a('string')
            expect(choices.chosenWord).to.equal('humano')
            expect(choices.translatedWord).to.be.a('string')
            expect(choices.translatedWord).to.equal('human')
        })
    });
});
//To Do's

//word, word 
//Symbols
//Edge cases for tweets with no links, or only links