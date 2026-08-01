const express = require('express');
const app = express();
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
    }
    
    
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});