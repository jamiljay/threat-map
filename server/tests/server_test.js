// eslint-disable-next-line import/no-extraneous-dependencies
const test = require('ava');
const openSocket = require("socket.io-client");

// eslint-disable-next-line import/no-extraneous-dependencies
const request = require('request-promise');

// TODO: update URL for Test & Prod
let socket = null;


test.before(async t => {
    socket = await openSocket("http://localhost:8080");

    t.pass();
});


test('theatDataRequest', async t => {

    const json = await request('http://localhost:8080/rest/data');

    const data = JSON.parse(json);

    t.true(data.success);
    t.truthy(data.message);
    t.true(data.threats instanceof Array);
    t.true(data.threats.length === 2);
});


test.todo("Configure sockt tests");
