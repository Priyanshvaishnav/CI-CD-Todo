const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const sanitizer = require('sanitizer');
const app = express();
const port = 8000;

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware to override HTTP methods
app.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        const method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

let todolist = [];

// Display the to-do list and the form
app.get('/todo', (req, res) => {
    res.render('todo', {
        todolist,
        clickHandler: "func1();"
    });
});

// Add an item to the to-do list
app.post('/todo/add/', (req, res) => {
    const newTodo = sanitizer.escape(req.body.newtodo);
    if (newTodo) {
        todolist.push(newTodo);
    }
    res.redirect('/todo');
});

// Delete an item from the to-do list
app.get('/todo/delete/:id', (req, res) => {
    const todoIdx = req.params.id;
    if (todoIdx && todolist[todoIdx]) {
        todolist.splice(todoIdx, 1);
    }
    res.redirect('/todo');
});

// Get a single to-do item and render the edit page
app.get('/todo/:id', (req, res) => {
    const todoIdx = req.params.id;
    const todo = todolist[todoIdx];
    if (todo) {
        res.render('edititem', {
            todoIdx,
            todo,
            clickHandler: "func1();"
        });
    } else {
        res.redirect('/todo');
    }
});

// Edit an item in the to-do list
app.put('/todo/edit/:id', (req, res) => {
    const todoIdx = req.params.id;
    const editTodo = sanitizer.escape(req.body.editTodo);
    if (todoIdx && editTodo) {
        todolist[todoIdx] = editTodo;
    }
    res.redirect('/todo');
});

// Redirect to the to-do list if the page requested is not found
app.use((req, res) => {
    res.redirect('/todo');
});

// Start the server
app.listen(port, () => {
    console.log(`Todolist running on http://localhost:${port}`);
});

// Export app
module.exports = app;
