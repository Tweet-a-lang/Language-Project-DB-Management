const {expect} = require('chai');
const {syntaxOfTweet, normaliseTweet} = require('../index.js');
const exampleTweets = require('../exampleTweets.json');

const text = exampleTweets[0].text;//Math.floor(Math.random() * exampleTweets.length)].text;

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

//To Do's
//Hyperlinks
    //Shortened links
    //Use Twitter's links
//Remove puncuation
//word, word 
//Symbols
//Edge cases for tweets with no links, or only links