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
                        <button>Comments</button>
                        <button>Add Comment</button>
                    </div>
                 </div>
                 <div class="piece_details" id="details-${piece.id}"></div>
            </div>`
        displayList.innerHTML += pieceDisplayHTML
    }
}

function displayPieceDetails(piece) {
    const detailsDivHTML = document.getElementById(`details-${piece.id}`)
    displayDetailsHMLT = `
      <p>Composer: ${piece.composer}</p>
      <p>Difficulty: ${piece.difficulty}</p>
      <p>Type: ${piece.type}</p>
      <p>Style: ${piece.style}</p>`
    detailsDivHTML.innerHTML = displayDetailsHMLT
}

// Function that displays the pieces details

// Function that displays commetns

// Function that displays comment detials

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
    try {
        let response = await fetch(`http://127.0.0.1:8090/pieces/${id}`);
        let piece = await response.json();
        console.log(piece);
        displayPieceDetails(piece)
    } catch (e) {
        alert(e);
    }
}

















/*<div class="piece_info">
      <h3>Autumn Leaves</h3>
      <p>Composer: Joseph Kosma</p>
      <p>Difficulty: Intermediate</p>
      <p>Type: Alto Sax</p>
      <p>Style: Jazz</p>
    </div>

    <div class="comments_section">
      <h3>Comments</h3>
      <ul class="comments_list">
        <li>
          <p><strong>Emily</strong> (2026-02-16)</p>
          <p>Great piece! Focus on smooth legato in measure 12.</p>
        </li>
        <li>
          <p><strong>Michael</strong> (2026-02-14)</p>
          <p>The high notes in the bridge are tricky, practice slowly.</p>
        </li>
      </ul>

      <form class="add_comment_form">
        <label>Your Name</label>
        <input type="text">
        <label>Comment</label>
        <textarea rows="4"></textarea>
        <button type="submit">Add Comment</button>
      </form>
    </div>*/




