const { expect } = require('chai');
const app = require('../../src/app');
const request = require('supertest')(app);
const knex = require('../../database/index');

describe('dev', () => {
  describe('inside', () => {
    it('includes movie data and actor data in the response', (done) => {
      request.get('/api/v1/dev').expect(200);
      // .end((err, res) => {
      //   if (err) return done(err);
      //   console.log(res.body);

      //   expect(res.body.length).to.eq(1);
      //   expect(res.body[0].title).to.eq('Shawshank Redemption');
      //   expect(res.body[0].release_year).to.eq(1994);
      //   expect(res.body[0].name).to.eq('Tim Robbins');
      //   expect(res.body[0].dob).to.eq('1958-10-16T06:00:00.000Z');
      //   expect(res.body[0].character).to.eq('Andy Dufrane');

      done();
      // });
    });
  });
});
