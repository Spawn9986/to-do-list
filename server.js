const express = require("express");
const app = express();
const pool = require("./db");
const cors = require("cors");
const port = 3000;

//app.use is for all incoming requests regardless of routes or HTTP methods (except for GET requests which typically are sent as query parameters in the URL, not in the request body. Query parameters are already part of the URL itself, and they don't require express.json() middleware to parse them). The express.json() middleware is specifically designed to parse data that is sent in the request body, typically in the case of POST, PUT, or PATCH requests when the data is sent in the request payload rather than as part of the URL. The express.json() middleware is not necessary for parsing GET request parameters as query parameters are automatically parsed and accessible through the req.query object in Express.
app.use(express.json());
app.use(cors());

//Instead of parsing the data like other methods the GET HTTP method can directly access the query parameters from the request object and use them (i.e., const id = req.query.id; --> now we have access to the id and can use as needed). The req.query object in Express provides access to the parsed query parameters.
app.get("/tasks", async function fetchTasks(req, res) {
  try {
    const queryResult = await pool.query("SELECT * FROM tasklist");
    res.json(queryResult.rows);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/tasks", async function createTask(req, res) {
  const task = {
    task: req.body.task,
    completed: false,
  };

  try {
    const queryResult = await pool.query(
      "INSERT INTO tasklist (task, complete) VALUES ($1, $2) RETURNING *",
      [task.task, task.completed]
    );

    res.json({
      message: "Task added successfully",
      data: queryResult.rows[0],
    });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, function () {
  console.log(`Server listening on http://localhost:${port}`);
});
