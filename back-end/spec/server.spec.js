const {expect} = require('chai');
const request = require('supertest');
const app = require('../server/server')
describe('API', () => {
    describe('GET tweets/:username', () => {
        it('returns with a status code of 200', () => {
            return request(app)
                .get('/api/tweets/dennis')
                .expect(200);
        })
        it('returns an array', () => {
             const numbOfTweets = 5;
            return request(app)
            .get(`/api/tweets/dennis?count=${numbOfTweets}`)
            .then(res => {
                const tweetData = res.body[0]
                expect(res.body).to.be.an('array')
                expect(res.body.length).to.equal(numbOfTweets)
                expect(res.body[0].answers).to.be.an('object')
                expect(res.body[0].answers.choices).to.be.an('array')
            })
            .catch(console.error)
        }).timeout(5000)
    })
    describe('GET user/:username', () => {
        it('returns with a status code of 200', () => {
            return request(app)
            .get('/api/user/olie')
            .expect(200)
            .then(res => {
                const {name, score, completedTweets} = res.body;
                expect(name).to.be.a('string');
                expect(name).to.eql('olie');
                expect(score).to.be.a('string');
                expect(completedTweets).to.be.a('array');
            })
        })
    });
    describe.only('PATCH user/:username', () => {
        it('returns with a status code of 200', () => {
            const patchBody = {
                completedTweets: ['test'],
                score: 1
            }
            return request(app)
            .patch('/api/user/olie')
            .send(patchBody)
            .expect(200)
        })
        it('returns an object containing the updated user', () => {
            const patchBody = {
                completedTweets: ['test'],
                score: 1
            }
            return request(app)
            .get('/dev/reset/olie')
            .then(() => {
                return request(app)
                .patch('/api/user/olie')
                .send(patchBody)
                .expect(200)
            })
            .then(res => {
                const {score, completedTweets} = res.body;
                expect(score).to.equal(1)
                expect(completedTweets).to.eql(['test'])
            })
        })
    })
});

describe('DEV', () => {
    describe('GET reset/:username', () => {
        it('returns witha a status code of 200', () => {
            return request(app)
            .get('/dev/reset/olie')
            .expect(200)
            .then(res => {
                const {name, score, completedTweets} = res.body;
                expect(name).to.equal('olie');
                expect(score).to.equal(0);
                expect(completedTweets).to.eql([]);
            })
        })
    })
})