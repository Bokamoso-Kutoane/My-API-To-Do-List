const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openApiSpec = require('./openapi.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ---------------------------------------------------------------------------
// "Database" — an in-memory array. Resets every time the server restarts.
// Swap this for a real DB later without touching the route logic much.
// ---------------------------------------------------------------------------
let todos = [
  { id: 1, item: 'Learn Express routing', done: false },
  { id: 2, item: 'Wire up Swagger UI', done: true },
];
let nextId = 3; // simple auto-increment counter for new items

// ---------------------------------------------------------------------------
// Swagger UI — served straight from the static openapi.json spec.
// No code-comment parsing here; the spec is just JSON that swagger-ui-express
// renders as an interactive docs page.
// ---------------------------------------------------------------------------
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// ---------------------------------------------------------------------------
// Routes — 5 endpoints total, covering GET, POST, PUT, DELETE
// ---------------------------------------------------------------------------

// GET /todos — list every to-do item
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

// GET /todos/:id — fetch a single to-do item
app.get('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: `Todo with id ${id} not found` });
  }

  res.status(200).json(todo);
});

// POST /todos — add a new to-do item
app.post('/todos', (req, res) => {
  const { item, done } = req.body;

  if (!item || typeof item !== 'string') {
    return res.status(400).json({ error: '"item" is required and must be a string' });
  }

  const newTodo = {
    id: nextId++,
    item,
    done: typeof done === 'boolean' ? done : false,
  };

  todos.push(newTodo);
  res.status(200).json(newTodo);
});

// PUT /todos/:id — edit an existing to-do item
app.put('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: `Todo with id ${id} not found` });
  }

  const { item, done } = req.body;
  if (item !== undefined) todo.item = item;
  if (done !== undefined) todo.done = done;

  res.status(200).json(todo);
});

// DELETE /todos/:id — remove a to-do item
app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Todo with id ${id} not found` });
  }

  const [deleted] = todos.splice(index, 1);
  res.status(200).json(deleted);
});

app.listen(PORT, () => {
  console.log(`To-do API running at http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});
