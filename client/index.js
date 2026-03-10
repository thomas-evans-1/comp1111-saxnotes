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
                        <button>Add Comment</button>
                    </div>
                 </div>
                 <div class="piece_details" id="details-${piece.id}"></div>
                 <div id="comments-${piece.id}"</div>
            </div>`
        displayList.innerHTML += pieceDisplayHTML
    }
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
            <ul class="comments_list">
        `
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

window.addEventListener('DOMContentLoaded', async function (event) {
    try {
        let response = await fetch('http://127.0.0.1:8090/pieces');
        let pieces = await response.text();
        console.log(pieces)
        displayPieces(pieces)
    } catch (e) {
        alert(e);
    }
});

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
        alert(e);
    }
}

async function getComments(id) {
    const commentsDiv = document.getElementById(`comments-${id}`);
    if (commentsDiv.innerHTML !== "") {
        commentsDiv.innerHTML = "";
        return;
    }
    try {
        let responce = await fetch(`http://127.0.0.1:8090/pieces/${id}/comments`)
        let comments = await responce.json();
        console.log(comments)
        displayComments(comments)
    } catch (e) {
        alert(e);
    }
}

async function getCommentDetails(piece_id, comment_id) {
    const commentDetailsDiv = document.getElementById(`commentDetails-${comment_id}`);
    if (commentDetailsDiv.innerHTML !== "") {
        commentDetailsDiv.innerHTML = "";
        return;
    }
    try {
        let responce = await fetch(`http://127.0.0.1:8090/pieces/${piece_id}/comments/${comment_id}`)
        let comment = await responce.json()
        console.log(comment)
        displayCommentDetails(comment)
    } catch (e) {
        alert(e)
    }
}









/*

      <form class="add_comment_form">
        <label>Your Name</label>
        <input type="text">
        <label>Comment</label>
        <textarea rows="4"></textarea>
        <button type="submit">Add Comment</button>
      </form>
    </div>*/




