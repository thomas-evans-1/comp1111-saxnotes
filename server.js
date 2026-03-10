const express = require('express') // Imports express module
const app = express() // Create an express app


const data = require('./data.json'); // Read data.json data
app.use(express.static('client')); // Middleware
app.use(express.json());


app.get('/pieces', function (req, resp) {
    console.log("returns all sax pieces")
    resp.send(data.pieces)
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

app.post("/", function (req, resp) {
    console.log("request body", req.body);
    let new_piece = req.body;
    new_piece.id = data.pieces.length
    data.pieces.push(new_piece);
});

// need to find a clever way to allocate ids or otherwise i need to get rid of them? can i just use the title of the piece as that will be unique
// maybe the same with the comments? use someones name in comination wiht piece id? nah


app.get('/pieces/:piece_id/comments', function (req, resp) {
    console.log("return comments for a specific sax piece")
    const piece_id = parseInt(req.params.piece_id)
    const comments = data.comments.filter(c => c.piece_id === piece_id) // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
    if (comments.length === 0) {
        return resp.status(400).json({ error: "Piece not found" });
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

app.post("/pieces/:piece_id/comments", function (req, resp) {
    console.log("request body", req.body);
    const piece_id = parseInt(req.params.piece_id)
    const new_comment = req.body;
    new_comment.id = [].length
    new_comment.piece_id = piece_id;
    data.comments.push(new_comment);
});

app.listen(8090)