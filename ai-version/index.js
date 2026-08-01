const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
// Swagger / OpenAPI setup
// swagger-jsdoc reads the JSDoc-style comments above each route (below) and
// turns them into an OpenAPI spec. swagger-ui-express then renders that
// spec as an interactive docs page.
// ---------------------------------------------------------------------------
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'To-Do List API',
      version: '1.0.0',
      description: 'A minimal CRUD API for managing a to-do list.',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    components: {
      schemas: {
        Todo: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            item: { type: 'string', example: 'Buy milk' },
            done: { type: 'boolean', example: false },
          },
        },
        NewTodo: {
          type: 'object',
          required: ['item'],
          properties: {
            item: { type: 'string', example: 'Buy milk' },
            done: { type: 'boolean', example: false },
          },
        },
      },
    },
  },
  // Point swagger-jsdoc at this file so it can find the @swagger comments below
  apis: ['./index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ---------------------------------------------------------------------------
// Routes — 5 endpoints total, covering GET, POST, PUT, DELETE
// ---------------------------------------------------------------------------

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all to-do items
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: The full list of to-do items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Get a single to-do item by id
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The matching to-do item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: No to-do item with that id
 */
app.get('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: `Todo with id ${id} not found` });
  }

  res.status(200).json(todo);
});

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Add a new to-do item
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewTodo'
 *     responses:
 *       200:
 *         description: The newly created to-do item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Missing required "item" field
 */
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

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Edit an existing to-do item
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewTodo'
 *     responses:
 *       200:
 *         description: The updated to-do item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: No to-do item with that id
 */
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

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a to-do item
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The deleted to-do item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: No to-do item with that id
 */
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
