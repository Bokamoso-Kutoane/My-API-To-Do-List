# To-Do List API

A small API that manages a to-do list. Create tasks, read them, update them, delete them — the four CRUD operations, nothing more.

<img width="1096" height="544" alt="image" src="https://github.com/user-attachments/assets/ae80673c-d372-4fe4-b62f-f0979c3e9022" />


## Stack

- Node.js
- Express
- Swagger UI (for docs / testing endpoints)

## What it does

- Add an item to the list
- Read the list
- Edit an item
- Delete an item

That's it. No accounts, no extra features. Just CRUD, done properly.

## Why I built it

First time using JavaScript. First time building an API instead of just using one. I still don't fully understand JavaScript — but once you've got a handful of functions written, it stops feeling foreign and starts feeling smooth.

## Notes

- Swagger works, but it's not the interface I want long-term. Might replace it with something else, or at least give an option to view the API a different way.
- This will probably get revisited. Consider it a first pass, not a final one.

## AI vs Me

**What it did better than me:** structured the components better. The UI turned out better too, somehow — not entirely sure how, but sure, I'll take it.

**What it did badly:** weak validation.

**What I think is cooler than what I would've built:** it gave the site a clean view of the list and items. I didn't implement that myself, and honestly, I wish I had.

**What my prompt forgot:** I should've been more specific about the code and the file structure — it tried to cram everything into two files. That one's on me. Everything else was gucci.

**My prompts:**

1. Build a small API that manages a to-do list, it must use Node.js, express and swaggerui. It must use all the CRUD operations, it must use Get, put, delete and post. You must be able to add a new item, you need to be able to edit it and delete it. There must be an id, the item and a done or not boolean. It must use code 200 for deleting and adding to the list, 404 for when the id is not found during editing, and it must have 5 endpoints.

2. Forgot to mention, you can separate the code to index.js and openapi.json for swaggerui.
