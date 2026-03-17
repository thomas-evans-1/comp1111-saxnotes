const express = require('express') // Imports express module
const app = express() // Create an express app

const data = require('./data.json'); // Read data.json data
const fs = require('fs');

app.use(express.static('client')); // Middleware
app.use(express.json());


app.get('/pieces', function (req, resp) {
    console.log("returns all sax pieces")
    resp.send(data.pieces)
})

app.get('/pieces/search', function (req, resp) {
    console.log("returns sax piece search")
    let search_term = req.query.search_term
    if (!search_term) {
        resp.send(data.pieces)
    }
    let results = data.pieces.filter(item => item.title.toLowerCase().includes(search_term.toLowerCase()))
    resp.send(results)
})


app.get('/pieces/:id', function (req, resp) {
    console.log("returns a specific sax piece")
    const id = parseInt(req.params.id)
    const piece = data.pieces.find(p => p.id === id); // Find piece whose 'id' matches the param: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
    if (!piece) {
        return resp.status(400).json({ error: "Piece not found" });
    }
    resp.status(200).send(piece)
})

app.get('/pieces/:piece_id/comments', function (req, resp) {
    console.log("return comments for a specific sax piece")
    const piece_id = parseInt(req.params.piece_id)
    const comments = data.comments.filter(c => c.piece_id === piece_id) // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
    if (comments.length === 0) {
        return resp.status(400).json({ error: "Comments not found" });
    }
    resp.status(200).send(comments)
})


app.get('/pieces/:piece_id/comments/:id', function (req, resp) {
    console.log("returns details of a specific comment")
    const piece_id = parseInt(req.params.piece_id)
    const id = parseInt(req.params.id)
    const comments = data.comments.find(c => (c.piece_id === piece_id) && (c.id === id))
    if (!comments) {
        return resp.status(400).json({ error: "Piece not found" });
    }
    resp.status(200).send(comments)
})

app.post("/pieces/:piece_id/comments/add", function (req, resp) {
    console.log("request body", req.body);
    const comment = req.body;
    comment.id = Date.now(); // unique ID based on number of milliseconds since 1 Jan 1970: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now

    console.log(comment)

    data.comments.push(comment)

    if (!app.TESTING) {
        fs.writeFileSync('./data.json', JSON.stringify(data, null, 2)); // to not replace all data: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
    }
    resp.json(comment);
});



module.exports = app