const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;
const taskList = [ {"id": 1, "title": "Start Capstone", "done": true}, 
    {"id": 2, "title": "Study java", "done": false},
    {"id": 3, "title": "Revise PHP", "done": false} ];

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
    res.send(taskList);
});

app.get('/tasks/:id', (req, res) => {
    const foundTask = taskList.find(task => task.id === Number(req.params.id));
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

    const newTask = {
    id: taskList.length + 1,
    title: req.body.title,
    done: false
    };

    taskList.push(newTask);
    res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
    const foundTask = taskList.find(task => task.id === Number(req.params.id));
    if (!foundTask){
        return res.status(404).json({error:`Task ${req.params.id} not found`});
    } 
    if (req.body.title !== undefined) {
        foundTask.title = req.body.title;
    }
    if (req.body.done !== undefined) {
        foundTask.title = req.body.done;
    }

    res.status(200).json(foundTask);
})

app.delete("/tasks/:id", (req, res) => {
    const index = taskList.findIndex(task => task.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({ error: `Task ${req.params.id} not found` });
    }

    taskList.splice(index, 1);

    return res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});