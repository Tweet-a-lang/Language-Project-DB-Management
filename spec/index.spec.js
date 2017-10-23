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

    //NEEDS TO SUPPORT SHORT LINKS E.G. bit.ly/1ca2ac
    it('removes links from tweets', () => {
        const testTweet = 'Las pruebas, aquí:  \nhttps://t.co/DCmlYodKeS https://t.co/7hCmciTYUk';
        const answerTweet = 'Las pruebas, aquí:';
        expect(normaliseTweet(testTweet)).to.equal(answerTweet);
    });

    it('removes hashtags from tweets', () => {
        const testTweet = 'Las pruebas, aquí:  #YOLO';
        const answerTweet = 'Las pruebas, aquí:';
        expect(normaliseTweet(testTweet)).to.equal(answerTweet);
    });

    it('removes mentions from tweets', () => {
        const testTweet = 'Las pruebas, aquí: @Sinnedennis';
        const answerTweet = 'Las pruebas, aquí:';
        expect(normaliseTweet(testTweet)).to.equal(answerTweet);
    });
});

describe('#normaliseTweet => #syntaxOfTweet', () => {
    it('should return an array', () => {
        const filteredTweet = normaliseTweet(text);
        syntaxOfTweet(filteredTweet).then(answer => {
            expect(answer).to.be.an('array');
        });
        
    });
})

//To Do's
//Hyperlinks
    //Shortened links
//Symbols