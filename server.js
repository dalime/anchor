const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost/anchor';

// set up
const mongoose = require('mongoose'); // mongoose for mongodb
const express = require('express');
const morgan = require('morgan'); // log requests to console for express
const bodyParser = require('body-parser'); // pull information from HTML POST
const path = require('path');
const methodOverride = require('method-override'); // simulate DELETE and PUT for express

// confirugation
require('mongoose').connect(MONGO_URI, err => {
  if (err) throw err;
  console.log(`MongoDB connected to ${MONGO_URI}`);
});

// app declaration
const app = express(); // creates app with express

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride());

// MONGODB MODEL
const Todo = mongoose.model('Todo', {
  text: String
});

// EXPRESS ROUTES

// GET
app.get('/api/todos', (req, res) => {
  Todo.find((err, todos) => {
    if (err) res.send(err);
    res.send(todos);
  });
});

// POST
app.post('/api/todos', (req, res) => {
  Todo.create({
    text: req.body.text,
    done: false
  }, (err, newTodo) => {
    if (err) res.send(err);
    Todo.find((err, todos) => {
      if (err) res.send(err);
      res.json(todos);
    });
  });
});

// DELETE
app.delete('/api/todos/:id', (req, res) => {
  Todo.remove({
    _id: req.params.id
  }, (err, deletedTodo) => {
    if (err) res.send(err);
    Todo.find((err, todos) => {
      if (err) res.send(err);
      res.json(todos);
    });
  });
});

// FRONTEND ROUTE
app.get('*', (req, res) => {
  res.sendFile('./public/index.html');
})

// listen when starting app with node server.js
app.listen(PORT, err => {
  if (err) throw err;
  console.log(`App listening on port ${PORT}`);
});
