'use strict';

const request = require('supertest')

const app = require('./app');

// set flag so the app knows not to save new data to file
app.TESTING = true;

describe('Test the pieces service', () => {

    test('GET /pieces succeeds', () => {
        return request(app)
	    .get('/pieces')
	    .expect(200);
    });

    test('GET /pieces returns JSON', () => {
        return request(app)
	    .get('/pieces')
	    .expect('Content-type', /json/);
    });

    test('GET /pieces includes Autumn Leaves', () => {
        return request(app)
	    .get('/pieces')
	    .expect(/Autumn Leaves/);
    });
