const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

// Import your new Postgres database functions
const { 
    getAllTasks, 
    getTaskById, 
    addTask, 
    updateTask, 
    deleteTask 
} = require('./db');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send({ 
    "name": "Task API", 
    "version": "1.0", 
    "endpoints": ["/tasks"] 
  });
});

app.get('/health', (req, res) => {
  res.send({"status": "ok"});
});

// --- CRUD ROUTES ---

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await getAllTasks();
        res.send(tasks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

app.get('/tasks/:id', async (req, res) => {
    try {
        const foundTask = await getTaskById(req.params.id);
        if (foundTask) {
            res.send(foundTask);
        } else {
            res.status(404).json({ error: "Task not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

app.post("/tasks", async (req, res) => {
    if (req.body.title === undefined || req.body.title === "") {
        return res.status(400).json({ error: "Title is required" });
    }
    try {
        const newTask = await addTask(req.body.title, req.body.done || false);
        res.status(201).json(newTask); // Changed to 201
    } catch (err) {
        res.status(500).json({ error: "Failed to add task" });
    }
}); 

app.put("/tasks/:id", async (req, res) => {
    try {
        const foundTask = await getTaskById(req.params.id);
        if (!foundTask) {
            return res.status(404).json({ error: "Task not found" }); // Fixed 404 string
        }
        const newTitle = req.body.title !== undefined ? req.body.title : foundTask.title;
        const newDone = req.body.done !== undefined ? req.body.done : foundTask.done;

        const updatedTask = await updateTask(req.params.id, newTitle, newDone);
        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: "Failed to update task" });
    }
});

app.delete("/tasks/:id", async (req, res) => {
    try {
        const deletedTask = await deleteTask(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ error: "Task not found" }); // Fixed 404 string
        }
        res.status(204).send(); // 204 requires an empty body, no JSON
    } catch (err) {
        res.status(500).json({ error: "Failed to delete task" });
    }
});
// --- SERVER START ---

app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
    console.log(`Swagger Docs available at http://localhost:${port}/docs`);
});
