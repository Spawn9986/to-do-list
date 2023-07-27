const taskForm = document.querySelector(".taskForm");
const taskInput = document.querySelector(".taskInput");
const taskList = document.querySelector(".taskList");

const serverUrl = "http://localhost:3000";

//Make an API call to the server using fetch (GET method)
async function fetchTasks() {
  try {
    // send a GET request to fetch tasks from the server
    const response = await fetch(`${serverUrl}/tasks`);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

function updatePage(fetchedData) {
  // clear the current task list
  taskList.innerText = "";

  fetchedData.forEach(function (taskObj) {
    const taskItem = document.createElement("li");
    taskItem.textContent = taskObj.task;
    taskList.appendChild(taskItem);
  });
}

async function fetchAndRefreshPage() {
  try {
    const data = await fetchTasks();
    updatePage(data);
  } catch (error) {
    console.error("Error updating page:", error);
  }
}

async function createTask() {
  try {
    const response = await fetch(`${serverUrl}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: taskInput.value }),
    });

    const data = await response.json();

    if (response.ok) {
      updatePage([data.data]);
    } else {
      console.error("Error createing task:", data.message);
    }
  } catch (error) {
    console.error("Error createing task:", error);
  }
}

taskForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  await createTask();
  await fetchAndRefreshPage();
});

fetchAndRefreshPage();
