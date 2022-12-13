const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { response, request } = require("express");

// const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400).json({
      error: "User not found!",
    });
  }

  request.user = user;
  return next();
}

function checkExistsTodo(request, response, next) {
  const {
    user,
    params: { id },
  } = request;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo doesn't exists" });
  }

  request.todo = todo;

  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExists = users.some((users) => users.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({
      error: "User already exists!",
    });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  return response.status(200).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;

  const { user } = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);

  return response.status(201).send(todo);
});

app.put(
  "/todos/:id",
  checksExistsUserAccount,
  checkExistsTodo,
  (request, response) => {
    // Complete aqui
    const { title, deadline } = request.body;
    const { todo } = request;

    todo.title = title;
    todo.deadline = deadline;

    return response.status(201).json(todo);
  }
);

app.patch(
  "/todos/:id/done",
  checksExistsUserAccount,
  checkExistsTodo,
  (request, response) => {
    // Complete aqui
    const { todo } = request;

    todo.done = true;

    return response.status(201).json(todo);
  }
);

app.delete(
  "/todos/:id",
  checksExistsUserAccount,
  checkExistsTodo,
  (request, response) => {
    // Complete aqui
    const { user, todo } = request;

    user.todos.splice(todo.id, 1);

    return response.status(204).json(user.todos);
  }
);

module.exports = app;
