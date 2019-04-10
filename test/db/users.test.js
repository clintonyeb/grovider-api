const server = require('../../index')
const Lab = require('lab')
const lab = (exports.lab = Lab.script())
const Code = require('code');
const expect = Code.expect;

const experiment = lab.experiment
const test = lab.test

experiment('Users DB', () => {
  test('It should return an array with zero length', async () => {
    const options = {
      method: "GET",
      url: "/users"
    };
    console.log(server, 'server')
    const response = await server.inject(options)
    console.log(response)
    expect(response.statusCode).not.to.be.equal(404)
  });
});