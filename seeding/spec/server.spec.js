const {expect} = require('chai');
const request = require('supertest');
const app = require('../server/server');
const {describe, it} = require('mocha');
describe('API', () => {
  describe('GET tweets/:username', () => {
    it('returns with a status code of 200', () => {
      return request(app)
        .get('/api/tweets/Olie')
        .expect(200);
    });
    it('returns an array', () => {
      const numbOfTweets = 5;
      return request(app)
        .get(`/api/tweets/dennis?count=${numbOfTweets}`)
        .then(res => {
          const tweetData = JSON.parse(res.text);

          expect(tweetData).to.be.an('array');
          expect(tweetData.length).to.equal(numbOfTweets);
          expect(tweetData[0].answers).to.be.an('object');
          expect(tweetData[0].answers.choices).to.be.an('array');
        });
    }).timeout(5000);
  });
  describe('GET user/:username', () => {
    it('returns with a status code of 200', () => {
      return request(app)
        .get('/api/user/olie')
        .expect(200)
        .then(res => {
          const {name, score, completedTweets} = res.body;
          expect(name).to.be.a('string');
          expect(name).to.eql('olie');
          expect(score).to.be.a('number');
          expect(completedTweets).to.be.a('array');
        });
    });
    it('returns a 400 error if the user is not found', () => {
      return request(app)
        .get('/api/user/booboo')
        .expect(400);
    });
  });
  describe('POST user/', () => {
    it('returns with a status code of 200', () => {
      return request(app)
        .post('/api/user')
        .send({
          name: 'boo boo'
        })
        .expect(200)
        .then(res => {
          const {name} = res.body;
          expect(name).to.equal('boo boo');
        });
    });
    it('returns with a 400 error if posting with no name', () => {
      return request(app)
        .post('/api/user')
        .send()
        .expect(400);
    });
    it('returns with a 400 error if posting a duplicate name', () => {
      return request(app)
        .post('/api/user')
        .send({
          name: 'olie'
        })
        .expect(400);
    });
  });
  describe('PATCH user/:username', () => {
    it('returns with a status code of 200', () => {
      const patchBody = {
        completedTweets: ['test'],
        score: 1
      };
      return request(app)
        .patch('/api/user/olie')
        .send(patchBody)
        .expect(200);
    });
    it('returns an object containing the updated user', () => {
      const patchBody = {
        completedTweets: ['test'],
        score: 1
      };
      return request(app)
        .get('/dev/reset/olie')
        .then(() => {
          return request(app)
            .patch('/api/user/olie')
            .send(patchBody)
            .expect(200);
        })
        .then(res => {
          const {score, completedTweets} = res.body;
          expect(score).to.equal(1);
          expect(completedTweets).to.eql(['test']);
        });
    });
    it('returns a 400 error if patching a user that does not exist', () => {
      return request(app)
        .patch('/api/user/testUser')
        .send({})
        .expect(400);
    });
  });
});

describe('DEV', () => {
  describe('GET reset/:username', () => {
    it('returns with a status code of 200', () => {
      return request(app)
        .get('/dev/reset/olie')
        .expect(200)
        .then(res => {
          const {name, score, completedTweets} = res.body;
          expect(name).to.equal('olie');
          expect(score).to.equal(0);
          expect(completedTweets).to.eql([]);
        });
    });
  });
  describe('DELETE delete/:username', () => {
    it('returns with a status code of 200 for successful deletion', () => {
      return request(app)
        .post('/api/user')
        .send({
          name: 'boo boo'
        })
        .then(() => {
          return request(app)
            .delete('/dev/delete/boo boo')
            .expect(200);
        });
    });
    it('returns with a status code of 204 when trying to delete a user that does not exist', () => {
      return request(app)
        .delete('/dev/delete/doesnotexist')
        .expect(204);
    });
  });
});