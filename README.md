# To-Do List API

A small API that manages a to-do list. Create tasks, read them, update them, delete them — the four CRUD operations, nothing more.

<img width="1096" height="544" alt="image" src="https://github.com/user-attachments/assets/ae80673c-d372-4fe4-b62f-f0979c3e9022" />

## Stack

- Node.js
- Express
- better-sqlite3
- Swagger UI (for docs / testing endpoints)

## What it does

- Add an item to the list
- Read the list
- Edit an item
- Delete an item

That's it. No accounts, no extra features. Just CRUD, done properly.

## Why I built it

First time using JavaScript. First time building an API instead of just using one. I still don't fully understand JavaScript — but once you've got a handful of functions written, it stops feeling foreign and starts feeling smooth.

## Database

The task list originally lived in a plain JavaScript array — which meant every restart wiped it clean. That's now backed by a real SQLite database instead.

**Why SQLite:** no server to install, no config, nothing to run alongside the app — it's a single file. For a small API like this, that's the whole point: persistence without the overhead of standing up a real database server.

**Where it lives:** `tasks.db`, sitting at the project root, next to `index.js`. It's created automatically the first time the app runs — nobody needs to make it by hand.

**How to run it:**
```
npm install
node index.js
```
That's it. The database file and the `tasks` table are both created automatically on first run, and three example tasks get seeded in — but only if the table's empty, so restarting never duplicates them.

**Database viewer screenshot:** *(pending — need to open `tasks.db` in DB Browser for SQLite and capture it)*

**Example query I ran manually:** *(pending — will drop in a real query + result once I've actually poked the database directly, per Stage 4)*

## Notes

- Swagger works, but it's not the interface I want long-term. Might replace it with something else, or at least give an option to view the API a different way.
- This will probably get revisited. Consider it a first pass, not a final one.

## AI vs Me

*(Covers the original CRUD build — the SQLite work above was written by hand, with guidance, not AI-generated, so it's not part of this comparison.)*

**What it did better than me:** structured the components better. The UI turned out better too, somehow — not entirely sure how, but sure, I'll take it.

**What it did badly:** weak validation.

**What I think is cooler than what I would've built:** it gave the site a clean view of the list and items. I didn't implement that myself, and honestly, I wish I had.

**What my prompt forgot:** I should've been more specific about the code and the file structure — it tried to cram everything into two files. That one's on me. Everything else was gucci.

**My prompts:**

1. Build a small API that manages a to-do list, it must use Node.js, express and swaggerui. It must use all the CRUD operations, it must use Get, put, delete and post. You must be able to add a new item, you need to be able to edit it and delete it. There must be an id, the item and a done or not boolean. It must use code 200 for deleting and adding to the list, 404 for when the id is not found during editing, and it must have 5 endpoints.

2. Forgot to mention, you can separate the code to index.js and openapi.json for swaggerui.

## Database

The task list originally lived in a plain JavaScript array, which was then upgraded to SQLite. It is now backed by a robust **PostgreSQL** database running in a Docker container.

**How to start the database:**
Make sure Docker is running, then execute this command to spin up the Postgres container with a persistent volume:

```
docker run --name taskdb -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=tasks -p 5432:5432 -v taskdata:/var/lib/postgresql -d postgres
```

**How to run the app:**

```
npm install
node index.js
```
