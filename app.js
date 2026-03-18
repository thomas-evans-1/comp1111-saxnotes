const express = require('express') // Imports express module
const app = express() // Create an express app

const data = require('./data.json'); // Read data.json data
const fs = require('fs');

app.use(express.static('client')); // Middleware
app.use(express.json());


app.get('/pieces', function (req, resp) {
    resp.status(200).send(data.pieces)
})

app.get('/pieces/search', function (req, resp) {
    let search_term = req.query.search_term
    if (!search_term) {
        return resp.status(200).send(data.pieces)
    }
    let results = data.pieces.filter(item => item.title.toLowerCase().includes(search_term.toLowerCase())) // using search logic from stevens code
    resp.status(200).send(results)
})

app.get('/pieces/:id', function (req, resp) {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
        return resp.status(400).json({ error: "Invalid Piece ID" });
    }
    const piece = data.pieces.find(p => p.id === id); // Find piece whose 'id' matches the param: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
    if (!piece) {
        return resp.status(404).json({ error: "Piece ID not found" });
    }
    resp.status(200).send(piece)
})

app.get('/pieces/:piece_id/comments', function (req, resp) {
    const piece_id = parseInt(req.params.piece_id)
    if (isNaN(piece_id)) {
        return resp.status(400).json({ error: "Invalid Piece ID" });
    }
    const piece = data.pieces.find(p => p.piece_id === piece_id)
    if (!piece) {
        return resp.status(404).json({ error: "Piece ID not found" });
    }
    const comments = data.comments.filter(c => c.piece_id === piece_id) // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
    resp.status(200).json(comments)
})

app.get('/pieces/:piece_id/comments/:id', function (req, resp) {
    const piece_id = parseInt(req.params.piece_id)
    if (isNaN(piece_id)) {
        return resp.status(400).json({ error: "Invalid Piece ID" });
    }
    const piece = data.pieces.find(p => p.piece_id === piece_id)
    if (!piece) {
        return resp.status(404).json({ error: "Piece ID not found" });
    }
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
        return resp.status(400).json({ error: "Invalid Comment ID" });
    }
    const comments = data.comments.find(c => (c.piece_id === piece_id) && (c.id === id))
    if (!comments) {
        return resp.status(404).json({ error: "Comment ID not found" });
    }
    resp.status(200).send(comments)
})

app.post("/pieces/:piece_id/comments/add", function (req, resp) {
    const piece_id = parseInt(req.params.piece_id)
    if (isNaN(piece_id)) {
        return resp.status(400).json({ error: "Invalid piece ID" });
    }
    const piece = data.pieces.find(p => p.piece_id === piece_id)
    if (!piece) {
        return resp.status(404).json({ error: "Piece ID not found" });
    }
    const { content, author_name, date_posted } = req.body;
    if (!content || typeof content !== "string" || content.trim() === "") {
        return resp.status(400).json({ error: "Valid content is required" });
    }
    if (!author_name || typeof author_name !== "string" || author_name.trim() === "") {
        return resp.status(400).json({ error: "Valid author name is required" });
    }
    if (!date_posted) {
        return resp.status(400).json({ error: "Date is required" });
    }   
    const comment = {
        id: Date.now(),
        piece_id: piece_id,
        author_name: author_name,
        content: content,
        date_posted: date_posted
    };
    data.comments.push(comment);
    if (!app.TESTING) {
        fs.writeFileSync('./data.json', JSON.stringify(data, null, 2)); // stringify parameters
    }
    resp.status(201).json(comment);
});

module.exports = app





