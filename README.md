# Notes Management REST API — Assignment 03

A production-ready **Notes Management REST API** built with **Node.js**, **Express**, and **MongoDB (Mongoose)**. Extends Assignment 02 by adding search functionality using MongoDB `$regex` and combining multiple query concepts (search + filter + sort + pagination) into advanced and master endpoints.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Environment:** dotenv

## Project Structure

```
notes-app/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   └── note.model.js      # Mongoose schema & model
│   ├── controllers/
│   │   └── note.controller.js # All 18 endpoint handlers
│   ├── routes/
│   │   └── note.routes.js     # Express router (correct ordering)
│   ├── middlewares/           # Reserved for future middleware
│   ├── app.js                 # Express app setup
│   └── index.js               # Server entry point
├── .env                       # Environment variables (gitignored)
├── .env.example               # Environment template
└── package.json
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/TrikamDevasi/backend_assignment3.git
cd backend_assignment3/notes-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your MongoDB URI
```

### 4. Run the server

```bash
npm run dev   # development (nodemon)
npm start     # production
```

Server starts on `http://localhost:5000`

### Postman Documentation

- **Published API Docs:** [Postman Documentation](https://documenter.getpostman.com/view/50840761/2sBXwpMWHq)
- **Collection JSON File:** [postman_collection.json](./postman_collection.json)

---

## API Endpoints

### CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/notes` | Create a single note |
| `POST` | `/api/notes/bulk` | Create multiple notes |
| `GET` | `/api/notes` | Get all notes |
| `GET` | `/api/notes/:id` | Get note by ID |
| `PUT` | `/api/notes/:id` | Full replace |
| `PATCH` | `/api/notes/:id` | Partial update |
| `DELETE` | `/api/notes/:id` | Delete single note |
| `DELETE` | `/api/notes/bulk` | Delete multiple notes |

### Search (MongoDB `$regex`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notes/search?q=keyword` | Search in title only |
| `GET` | `/api/notes/search/content?q=keyword` | Search in content only |
| `GET` | `/api/notes/search/all?q=keyword` | Search in title AND content (`$or`) |

### Two Concepts Combined

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notes/filter-sort` | Filter + Sort |
| `GET` | `/api/notes/filter-paginate` | Filter + Paginate |
| `GET` | `/api/notes/sort-paginate` | Sort + Paginate |
| `GET` | `/api/notes/search-filter` | Search + Filter |

### Three Concepts Combined

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notes/search-sort-paginate` | Search + Sort + Paginate |
| `GET` | `/api/notes/filter-sort-paginate` | Filter + Sort + Paginate |

### Master Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notes/query` | Everything — search + filter + sort + paginate |

**Master endpoint params:**
```
?q=keyword&category=work&isPinned=true&sortBy=title&order=asc&page=1&limit=5
```

---

## Note Schema

```js
{
  title:    String  (required),
  content:  String  (required),
  category: String  (enum: "work" | "personal" | "study", default: "personal"),
  isPinned: Boolean (default: false),
  createdAt: Date   (auto),
  updatedAt: Date   (auto)
}
```

## Response Format

```json
{
  "success": true | false,
  "message": "...",
  "data": {} | [] | null
}
```

List endpoints include `count`. Paginated endpoints include a `pagination` object.

## HTTP Status Codes

| Code | When |
|------|------|
| `200` | Successful GET, PUT, PATCH, DELETE |
| `201` | Successful POST |
| `400` | Missing required field, invalid param |
| `404` | Note not found |
| `500` | Server or database error |
