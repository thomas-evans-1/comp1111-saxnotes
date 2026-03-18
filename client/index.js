function displayPieces(pieces) {
    let displayList = document.getElementById('piece_list')
    displayList.innerHTML = ""
    for (let piece of JSON.parse(pieces)) {
        let pieceDisplayHTML = `
            <div class="piece_info">
                <div class="piece_header">
                    <h3>${piece.title}</h3>
                    <div class="button_group">
                        <button onclick="getPieceDetails(${piece.id})">Piece Details</button> 
                        <button onclick="getComments(${piece.id})">Comments</button>
                        <button onclick="displayCommentForm(${piece.id})">Add Comment</button>
                    </div>
                 </div>
                 <div class="piece_details" id="details-${piece.id}"></div>
                 <div id="comments-${piece.id}"></div>
                 <div id="comment_form_div-${piece.id}"></div>
            </div>`
        displayList.innerHTML += pieceDisplayHTML
    }
}

function showError(message) {
    document.getElementById("alert").textContent = "Error: " + message;
    document.getElementById("alert").classList.remove("d-none"); // class list 
    setTimeout(() => { document.getElementById("alert").classList.add("d-none") }, 4000); // timeout function: https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
}

function displayPieceDetails(piece) {
    const detailsDiv = document.getElementById(`details-${piece.id}`)
    displayDetails = `
      <p>Composer: ${piece.composer}</p>
      <p>Difficulty: ${piece.difficulty}</p>
      <p>Type: ${piece.sax_type}</p>
      <p>Style: ${piece.style}</p>`
    detailsDiv.innerHTML = displayDetails
}

function displayComments(comments) {
    const commentsDiv = document.getElementById(`comments-${comments[0].piece_id}`) // all commetns returned have the same piece ID so it doesnt matter
    commentsDiv.innerHTML = ""
    let commentsList = `
        <div class="comments_section">
            <h3>Comments</h3>
            <ul class="comments_list">`
    for (let comment of comments) {
        let commentListItem = `
        <li>
            <div class="comment_text">
                <p>${comment.content}</p>
                <div id="commentDetails-${comment.id}"></div>
            </div>
            <button onclick="getCommentDetails(${comment.piece_id}, ${comment.id})">Comment Details</button>
        </li>`
        commentsList += commentListItem
    }
    commentsList += `
            </ul>
        </div>`
    commentsDiv.innerHTML = commentsList
}

function displayCommentDetails(comment) {
    console.log(comment)
    const commentDetailsDiv = document.getElementById(`commentDetails-${comment.id}`)
    commentDetailsDiv.innerHTML = `<p><strong>${comment.author_name}</strong> (${comment.date_posted})</p>`
}

function displayCommentForm(piece_id) {
    const commentFormDiv = document.getElementById(`comment_form_div-${piece_id}`)
    if (commentFormDiv.innerHTML !== "") {
        commentFormDiv.innerHTML = "";
        return;
    }
    commentFormDiv.innerHTML = `
     <form id="comment_form-${piece_id}" class="comment_form">
        <label>Your Name</label>
        <input type="text" name="author_name">
        <label>Date</label>
        <input type="date" name="date_posted">
        <label>Comment</label>
        <textarea rows="4" name="content"></textarea>
        <button type="submit">Add Comment</button>
      </form>`
    const form = document.getElementById(`comment_form-${piece_id}`);
    form.addEventListener('submit', function (event) {
        postComment(event, piece_id);
    })
}

window.addEventListener('DOMContentLoaded', async function (event) {
    try {
        let response = await fetch('http://127.0.0.1:8090/pieces');
        let pieces = await response.text();
        console.log(pieces)
        displayPieces(pieces)
    } catch (e) {
        showError("Cannot connect to server...")
    }
});

const search_input = document.getElementById("search_input")

search_input.addEventListener("input", async function (event) {
    console.log("searched")
    const search_term = search_input.value
    console.log(search_term)
    try {
        let response = await fetch(`http://127.0.0.1:8090/pieces/search?search_term=${search_term}`)
        let pieces = await response.text()
        displayPieces(pieces)
    } catch (e) {
        showError("Cannot connect to server...")
    }
})

async function getPieceDetails(id) {
    const detailsDiv = document.getElementById(`details-${id}`)
    if (detailsDiv.innerHTML !== "") {
        detailsDiv.innerHTML = "";
        return;
    }
    try {
        let response = await fetch(`http://127.0.0.1:8090/pieces/${id}`);
        let piece = await response.json();
        console.log(piece);
        displayPieceDetails(piece)
    } catch (e) {
        showError("Cannot connect to server...")
    }
}

async function getComments(id) {
    const commentsDiv = document.getElementById(`comments-${id}`);
    if (commentsDiv.innerHTML !== "") {
        commentsDiv.innerHTML = "";
        return;
    }
    try {
        let response = await fetch(`http://127.0.0.1:8090/pieces/${id}/comments`);
        let comments = await response.json();
        console.log("Comments:", comments);
        if (comments.length === 0) {
            commentsDiv.innerHTML = "<p>No comments yet</p>"
        } else {
        displayComments(comments);
        }
    } catch (e) {
        showError("Cannot connect to server...")
    }
}

async function getCommentDetails(piece_id, comment_id) {
    const commentDetailsDiv = document.getElementById(`commentDetails-${comment_id}`);
    if (commentDetailsDiv.innerHTML !== "") {
        commentDetailsDiv.innerHTML = "";
        return;
    }
    try {
        let response = await fetch(`http://127.0.0.1:8090/pieces/${piece_id}/comments/${comment_id}`)
        let comment = await response.json()
        console.log(comment)
        displayCommentDetails(comment)
    } catch (e) {
        showError("Cannot connect to server...")
    }
}

async function postComment(event, piece_id) {
    event.preventDefault(); // stops the page from reloading

    const form = event.target // 

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries())

    try {
        const response = await fetch(`http://127.0.0.1:8090/pieces/${piece_id}/comments/add`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
        const responseBody = await response.json() // ICHANGES THIS FROM .TEXT to .JSON
        if (response.ok) {
            form.reset() // reset function: https://www.w3schools.com/jsref/met_form_reset.asp
        }
        else {
            alert('Error: ' + responseBody.error);
        }
    } catch (e) {
        showError("Cannot connect to server...")
    }
}



