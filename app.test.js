'use strict';

const request = require('supertest')

const app = require('./app');

app.TESTING = true;

// -------------------------------------------------------

describe('Test /pieces service', () => {

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

})

// ----------------------------------------------------------

describe('Test /pieces/search{piece} service', () => {

    test('GET /pieces/search{piece} succeeds', () => {
        return request(app)
            .get('/pieces/search?search_term=Autumn_Leaves')
            .expect(200)
    })

    test('GET /pieces/search{piece} returns JSON', () => {
        return request(app)
            .get('/pieces/search?search_term=Autumn Leaves')
            .expect('Content-type', /json/)
    })

    test('GET /pieces/search{autumn_leaves} includes Autumn Leaves', () => {
        return request(app)
            .get('/pieces/search?search_term=Autumn Leaves')
            .expect(/Autumn Leaves/);
    });

    test('GET /pieces/search handles missing parameter', () => {
        return request(app)
            .get('/pieces/search')
            .expect(200);
    });

})

// ---------------------------------------------------------

describe('Test /pieces/:id service', () => {

    test('GET /pieces/:id succeeds', () => {
        return request(app)
            .get('/pieces/1')
            .expect(200);
    });

    test('GET /pieces/:id returns JSON', () => {
        return request(app)
            .get('/pieces/1')
            .expect('Content-type', /json/);
    });

    test('GET /pieces/:id returns correct piece', () => {
        return request(app)
            .get('/pieces/1')
            .expect(res => {
                expect(res.body.title).toBe('Autumn Leaves');  // See reference line: 238
            });
    });

    test('GET /pieces/:id invalid id returns 400', () => {
        return request(app)
            .get('/pieces/abc')
            .expect(400);
    });

    test('GET /pieces/:id not found returns 404', () => {
        return request(app)
            .get('/pieces/999')
            .expect(404);
    });

});

// --------------------------------------------------------------

describe('Test /pieces/:piece_id/comments service', () => {

    test('/pieces/:piece_id/comments succeeds', () => {
        return request(app)
            .get('/pieces/1/comments')
            .expect(200)
    })

    test('/pieces/:piece_id/comments returns JSON', () => {
        return request(app)
            .get('/pieces/1/comments')
            .expect('Content-type', /json/)
    })

    test('GET /pieces/:piece_id/comments returns correct comments', () => {
        return request(app)
            .get('/pieces/1/comments')
            .expect(res => {
                expect(res.body[0].piece_id).toBe(1)
            });
    }); 

    test('GET /pieces/:piece_id/comments invalid id returns 400', () => {
        return request(app)
            .get('/pieces/abc/comments')
            .expect(400);
    });

    test('GET /pieces/:piece_id/comments not found returns 404', () => {
        return request(app)
            .get('/pieces/999/comments')
            .expect(404);
    });

});


// ---------------------------------------------------------------------

describe('Test /pieces/:piece_id/comments/:id service', () => {

    test('GET specific comment succeeds', () => {
        return request(app)
            .get('/pieces/1/comments/1')
            .expect(200);
    });

    test('GET specific comment returns JSON', () => {
        return request(app)
            .get('/pieces/1/comments/1')
            .expect('Content-type', /json/);
    });

    test('GET specific comment returns correct content', () => {
        return request(app)
            .get('/pieces/1/comments/1')
            .expect(res => {
                expect(res.body.content).toBe('Loved the improvisation section!');
            });
    });

    test('GET invalid comment id returns 400', () => {
        return request(app)
            .get('/pieces/1/comments/abc')
            .expect(400);
    });

    test('GET comment not found returns 404', () => {
        return request(app)
            .get('/pieces/1/comments/999')
            .expect(404);
    });

});

// ----------------------------------------------------------

describe('Test POST /pieces/:piece_id/comments/add', () => {

    test('POST comment succeeds', () => {
        return request(app)
            .post('/pieces/1/comments/add')
            .send({
                content: "Test comment",
                author_name: "Tester",
                date_posted: "2026-03-19"
            })
            .expect(201);
    });

    test('POST comment returns JSON', () => {
        return request(app)
            .post('/pieces/1/comments/add')
            .send({
                content: "Another test",
                author_name: "Tester",
                date_posted: "2026-03-19"
            })
            .expect('Content-type', /json/);
    });

    test('POST comment missing content returns 400', () => {
        return request(app)
            .post('/pieces/1/comments/add')
            .send({
                author_name: "Tester",
                date_posted: "2026-03-19"
            })
            .expect(400);
    });

    test('POST comment invalid piece_id returns 400', () => {
        return request(app)
            .post('/pieces/abc/comments/add')
            .send({
                content: "Test",
                author_name: "Tester",
                date_posted: "2026-03-19"
            })
            .expect(400);
    });

    test('POST comment piece not found returns 404', () => {
        return request(app)
            .post('/pieces/999/comments/add')
            .send({
                content: "Test",
                author_name: "Tester",
                date_posted: "2026-03-19"
            })
            .expect(404);
    });

});

/* 
Using .expect(res => {expect(res.body[0].piece_id).toBe(1)});
Source: ChatGPT (OpenAI)
Prompt: "How can I check the contents of a JSON response array in Supertest using Jest?"
Reponse: 

    test('GET returns correct data', () => {
      return request(app)
       .get('/data')
        .expect(200)
        .expect(res => {
            expect(res.body).toBeInstanceOf(Array); // check it's an array
            expect(res.body.length).toBeGreaterThan(0); // not empty
            expect(res.body[0].id).toBe(correct_id); // check first value of array
        });
});
*/