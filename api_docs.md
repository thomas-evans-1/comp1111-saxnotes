# SaxNotes API Documentation

**SaxNotes** is a community web application for saxophone players to discover saxophone pieces and share performance notes.

The site allows users to:

- Browse saxophone pieces  
- View details about each piece (composer, difficulty, style)  
- Read or add comments about how the piece feels to play  
- Share common challenges and practice tips  

The **SaxNotes API** provides access to a collection of saxophone musical pieces and associated user comments.

---

## Contents

1. [Pieces](#pieces)
    1. [GET All Pieces](#get-all-pieces)
    2. [GET Piece By Title Search](#get-piece-by-title-search)
    3. [GET Piece By ID](#get-piece-by-id)
2. [Comments](#comments)
    1. [GET Comments By Piece ID](#get-comments-by-piece-id)
    2. [GET Piece Comment By ID](#get-piece-comment-by-id)
    3. [POST Comment](#post-comment)


---

## Pieces
The **Pieces** entity represents musical pieces stored in the SaxNotes system.

Each piece contains descriptive information such as:

- Title  
- Composer  
- Difficulty level  
- Instrument type  
- Musical style  

SaxNotes allows users to:

- Retrieve all pieces  
- Retrieve a specific piece by ID  
- Search for pieces by title  
- Access related comments for a piece  

#### Piece Data Model
Each piece object contains the following fields:

| Field | Type | Description |
|------|------|-------------|
| id | integer | Unique identifier for the piece |
| title | string | Title of the musical piece |
| composer | string | Name of the composer |
| difficulty | string | Difficulty level (e.g., Beginner, Intermediate, Advanced) |
| sax_type | string | Type of saxophone (e.g., Alto, Tenor, Baritone) |
| style | string | Musical style or genre (e.g., Jazz, Classical) |


#### Example Piece Object

```json
{
  "id": 1,
  "title": "Autumn Leaves",
  "composer": "Joseph Kosma",
  "difficulty": "Intermediate",
  "sax_type": "Alto",
  "style": "Jazz"
}
```

---

### GET All Pieces

#### Description

Returns the full list of available musical pieces.

**Method:** `GET`  
**Path:** `{{baseURL}}/pieces`


#### Responses

| Status | Description |
|-------|-------------|
| 200 OK | Successfully returned the list |



#### Example Request

```
http://127.0.0.1/pieces
```


#### Example Response

```json
[
  {
    "id": 1,
    "title": "Autumn Leaves",
    "composer": "Joseph Kosma",
    "difficulty": "Intermediate",
    "sax_type": "Alto",
    "style": "Jazz"
  },
  {
    "id": 2,
    "title": "Blue Bossa",
    "composer": "Kenny Dorham",
    "difficulty": "Beginner",
    "sax_type": "Tenor",
    "style": "Bossa Nova"
  },
  {
    "id": 3,
    "title": "Take Five",
    "composer": "Paul Desmond",
    "difficulty": "Advanced",
    "sax_type": "Alto",
    "style": "Cool Jazz"
  }
]
```

---

### GET Piece By Title Search

#### Description

Search for pieces using a free-text term.

**Method:** `GET`  
**Path:** `{{baseURL}}/pieces/search`

#### Query Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| search_term | string | Yes | Text to search for |

#### Responses

| Status | Description |
|-------|-------------|
| 200 OK | Matching pieces returned |
| 200 OK (empty) | No matches found |
| 200 OK (no term) | Returns all pieces |

#### Example Request

```
http://127.0.0.1:8090/pieces/search?search_term=autumn%20leaves
```

#### Example Response

```json
[
  {
    "id": 1,
    "title": "Autumn Leaves",
    "composer": "Joseph Kosma",
    "difficulty": "Intermediate",
    "sax_type": "Alto",
    "style": "Jazz"
  }
]
```

---

### GET Piece By ID

#### Description

Retrieves a piece using its unique ID.

**Method:** `GET`  
**Path:** `{{baseURL}}/pieces/:id`

#### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | integer | Yes | Piece ID |

#### Responses

| Status | Description |
|-------|-------------|
| 200 OK | Piece returned |
| 400 Bad Request | Invalid ID |
| 404 Not Found | Piece not found |

#### Example Request

```
http://127.0.0.1:8090/pieces/1
```

#### Example Response

```json
{
  "id": 1,
  "title": "Autumn Leaves",
  "composer": "Joseph Kosma",
  "difficulty": "Intermediate",
  "sax_type": "Alto",
  "style": "Jazz"
}
```

---

## Comments

The **Comments** entity represents user feedback linked to pieces.

Each comment contains:

- Comment text  
- Author name  
- Date posted  

Users can:

- Retrieve comments for a piece  
- View comment details  
- Create new comments  

Comments always belong to an existing piece.

#### Comment Data Model

| Field | Type | Description |
|------|------|-------------|
| id | integer | Comment ID |
| piece_id | integer | Related piece ID |
| author_name | string | Author display name |
| content | string | Comment text |
| date_posted | string (YYYY-MM-DD) | Creation date |

#### Example Comment Object

```json
{
  "id": 1773936169356,
  "piece_id": 1,
  "author_name": "Example Name",
  "content": "Example Content",
  "date_posted": "2026-03-21"
}
```

---

### GET Comments By Piece ID

#### Description

Returns all comments for a piece.

**Method:** `GET`  
**Path:** `{{baseURL}}/pieces/:piece_id/comments`

#### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| piece_id | integer | Yes | Piece ID |

#### Responses

| Status | Description |
|-------|-------------|
| 200 OK | Comments returned |
| 200 OK (empty) | No comments |
| 400 Bad Request | Invalid ID |
| 404 Not Found | Piece not found |

#### Example Response

```json
[
  {
    "id": 1,
    "piece_id": 1,
    "author_name": "Alice",
    "content": "Loved the improvisation section!",
    "date_posted": "2026-02-24"
  },
  {
    "id": 2,
    "piece_id": 1,
    "author_name": "Bob",
    "content": "Challenging but rewarding.",
    "date_posted": "2026-02-23"
  }
]
```

---

### GET Piece Comment By ID

#### Description

Retrieves a single comment.

**Method:** `GET`  
**Endpoint:** `{{baseURL}}/pieces/:piece_id/comments/:id`

#### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| piece_id | integer | Yes | Piece ID |
| id | integer | Yes | Comment ID |

#### Responses

| Status | Description |
|-------|-------------|
| 200 OK | Comment returned |
| 400 Bad Request | Invalid ID |
| 404 Not Found | Comment not found |

#### Example Response

```json
{
  "id": 1,
  "piece_id": 1,
  "author_name": "Alice",
  "content": "Loved the improvisation section!",
  "date_posted": "2026-02-24"
}
```

---

### POST Comment

#### Description

Creates a new comment.

**Method:** `POST`  
**Endpoint:** `{{baseURL}}/pieces/:piece_id/comments/add`


#### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| piece_id | integer | Yes | Piece ID |

#### Request Body

**Content-Type:** `application/json`

| Field | Type | Required | Description |
|------|------|----------|-------------|
| content | string | Yes | Comment text |
| author_name | string | Yes | Author name |
| date_posted | string (YYYY-MM-DD) | Yes | Date posted |

#### Example Body

```json
{
  "content": "Example Content",
  "author_name": "Example Name",
  "date_posted": "2026-03-21"
}
```

#### Example Success Response

```json
{
  "id": 1773936169356,
  "piece_id": 1,
  "author_name": "Example Name",
  "content": "Example Content",
  "date_posted": "2026-03-21"
}
```

---
