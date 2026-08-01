# To-Do List API

A minimal CRUD API for a to-do list, built with Node.js, Express, and Swagger UI.

## Setup

```bash
npm install
npm start
```

Server runs at `http://localhost:3000`.
Interactive Swagger docs at `http://localhost:3000/api-docs`.

## Data shape

```json
{
  "id": 1,
  "item": "Buy milk",
  "done": false
}
```

## Endpoints (5 total)

| Method | Path         | Purpose            | Success | Not found |
|--------|--------------|---------------------|---------|-----------|
| GET    | /todos       | List all items      | 200     | —         |
| GET    | /todos/:id   | Get one item        | 200     | 404       |
| POST   | /todos       | Add a new item       | 200     | —         |
| PUT    | /todos/:id   | Edit an item         | 200     | 404       |
| DELETE | /todos/:id   | Delete an item       | 200     | 404       |

Data is stored in memory (a plain array), so it resets whenever the server restarts. Swap that array for a real database later — the route logic barely has to change.

## Files

- `index.js` — Express app: routes, in-memory data, server bootstrap.
- `openapi.json` — the OpenAPI 3.0 spec (paths, schemas, response codes) that Swagger UI renders. Edit this file directly to change the docs; it's not generated from code comments.
- `package.json` — dependencies (`express`, `swagger-ui-express`).
