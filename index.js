const db = require('./db');
const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;
const taskList = [ {"id": 1, "title": "Start Capstone", "done": true}, 
    {"id": 2, "title": "Study java", "done": false},
    {"id": 3, "title": "Revise PHP", "done": false} ];
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

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

app.get('/tasks', (req, res) => {
    const taskList = db.prepare("SELECT * FROM tasks").all();
    res.send(taskList);
});

app.get('/tasks/:id', (req, res) => {
    const foundTask = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);
    if (foundTask){
        res.send(foundTask);
    } else {
        res.status(404).json({error:`Task ${req.params.id} not found`});
    };
});

app.post("/tasks", (req, res) => {
    if (req.body.title === undefined || req.body.title === "") {
        return res.status(400).json({ error: "Title is required" });
    };

    const result = db.prepare("INSERT INTO tasks (title, done) VALUES (?, ?)")
                 .run(req.body.title, req.body.done ? 1 : 0);

    const newTask = {
        id: result.lastInsertRowid,
        title: req.body.title,
        done: req.body.done ?? false
    };

    res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
    const foundTask = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);

    if (!foundTask) {
        return res.status(404).json({ error: `Task ${req.params.id} not found` });
    }

    const newTitle = req.body.title !== undefined ? req.body.title : foundTask.title;
    const newDone = req.body.done !== undefined ? (req.body.done ? 1 : 0) : foundTask.done;

    db.prepare("UPDATE tasks SET title = ?, done = ? WHERE id = ?")
      .run(newTitle, newDone, req.params.id);

    res.status(200).json({ id: Number(req.params.id), title: newTitle, done: newDone });
});

app.delete("/tasks/:id", (req, res) => {
    const result = db.prepare("DELETE FROM tasks WHERE id = ?").run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ error: `Task ${req.params.id} not found` });
    }
    return res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});