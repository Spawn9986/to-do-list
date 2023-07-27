app.use(express.json());
app.use(cors());

let tasks = [
  {
    task: "Sample task",
    completed: false,
  },
];

//Instead of parsing the data like other methods the GET HTTP method can directly access the query parameters from the request object and use them (i.e., const id = req.query.id; --> now we have access to the id and can use as needed). The req.query object in Express provides access to the parsed query parameters.
app.get("/tasks", function fetchTasks(req, res) {
  // fetch tasks from the database and send them as a JSON response
  // TODO: for now we are sending a temporary response. We need to change this once the datbase is incorporated
  res.json([
    {
      task: "Sample task",
      completed: false,
    },
  ]);
  res.json(tasks);
});

app.post("/tasks", function createTask(req, res) {
  tasks.push(task);

  res.json({
    message: "Task added successfully",
    data: task,
  });
});

app.listen(port, function () {
  console.log(`Server listening on http://localhost:${port}`);
});
