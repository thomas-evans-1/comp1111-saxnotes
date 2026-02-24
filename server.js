const express = require('express') // Imports express module
const app = express() // Create an express app

// Read data.json data
const data = require('./data.json');

// Middleware
app.use(express.static('client'));

app.get('/', function(req, resp){
   console.log("load homepage")
})

app.get('/pieces', function(req, resp){
    console.log("returns all sax pieces")
    resp.send(data.pieces)
})

app.get('/pieces/:id', function(req, resp){
    console.log("returns a specific sax piece")
    const id = parseInt(req.params.id)
    const piece = data.pieces.find(p => p.id === id); // Find piece whose 'id' matches the param: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
    if (piece === undefined) {
        resp.send({ error: "Piece not found" });
    }
    resp.send(piece)
}

)
app.listen(8090)