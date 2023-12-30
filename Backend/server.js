const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./todos.db");

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT)"
  );
});

app.get("/todos", (req, res) => {
  db.all("SELECT * FROM todos", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/todos", (req, res) => {
  const task = req.body.task;
  db.run("INSERT INTO todos (task) VALUES (?)", [task], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, task });
  });
});

app.put("/todos/:id", (req, res) => {
  const taskId = req.params.id;
  const newTask = req.body.task;
  db.run("UPDATE todos SET task = ? WHERE id = ?", [newTask, taskId], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: taskId, task: newTask });
  });
});

app.delete("/todos/:id", (req, res) => {
  const taskId = req.params.id;
  db.run("DELETE FROM todos WHERE id = ?", taskId, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Todo deleted successfully", id: taskId });
  });
});

app.get("/todos/search/:query", (req, res) => {
  const searchQuery = req.params.query;
  const sql = `SELECT * FROM todos WHERE task LIKE ?`;
  const searchParam = `%${searchQuery}%`;

  db.all(sql, [searchParam], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
