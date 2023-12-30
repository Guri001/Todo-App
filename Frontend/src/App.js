import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/todos${
          searchQuery ? `/search/${encodeURIComponent(searchQuery)}` : ""
        }`
      )
      .then((response) => setTodos(response.data))
      .catch((error) => console.error(error));
  }, [searchQuery]);

  const addTodo = () => {
    axios
      .post("http://localhost:5000/todos", { task: newTask })
      .then((response) => {
        setTodos([...todos, response.data]);
        setNewTask("");
      })
      .catch((error) => console.error(error));
  };

  const updateTodo = (id, newTask) => {
    if (newTask !== null) {
      axios
        .put(`http://localhost:5000/todos/${id}`, { task: newTask })
        .then((response) => {
          const updatedTodos = todos.map((todo) =>
            todo.id === id ? response.data : todo
          );
          setTodos(updatedTodos);
        })
        .catch((error) => console.error(error));
    }
  };

  const deleteTodo = (id) => {
    axios
      .delete(`http://localhost:5000/todos/${id}`)
      .then(() => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
      })
      .catch((error) => console.error(error));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="app-container">
      <nav>
        <img
          className="logo"
          src="https://i0.wp.com/wendor.in/wp-content/uploads/2020/01/web-logo.png?fit=286%2C61&ssl=1"
          alt=""
        />
      </nav>
      <h1>Todo App</h1>
      <div className="todo-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <div className="todo-search">
        <input
          type="text"
          placeholder="Search todo by name"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            {todo.task}
            <div className="btn-section">
              <button
                className="update-button"
                onClick={() =>
                  updateTodo(todo.id, prompt("Enter new task:", todo.task))
                }
              >
                Update
              </button>
              <button
                className="delete-button"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <h5 className="myName">Made By Gurvinder Singh</h5>
    </div>
  );
}

export default App;
