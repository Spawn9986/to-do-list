const taskForm = document.querySelector(".taskForm");
const taskInput = document.querySelector(".taskInput");
const taskList = document.querySelector(".taskList");

const serverUrl = "http://localhost:3000";

let fetchedData = [];

//Make an API call to the server using fetch (GET method)
async function fetchTasks() {
  try {
    // send a GET request to fetch tasks from the server
    const response = await fetch(`${serverUrl}/tasks`);
    const data = await response.json();

    fetchedData = data;

    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

async function updatePage(fetchedData, shouldRefresh = true) {
  const taskList = document.querySelector(".taskList");
  // clear the current task list
  taskList.innerText = "";

  fetchedData.forEach(function (taskObj) {
    const taskItem = document.createElement("li");

    const checkboxContainer = document.createElement("label");
    checkboxContainer.classList.add("checkbox-container");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = 1;
    checkbox.name = "todo[]";

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-trash-can";
    icon.style.color = "#ed0707";

    icon.addEventListener("click", function () {
      deleteTask(taskObj.id);
    });

    taskItem.appendChild(checkboxContainer);
    taskItem.appendChild(icon);
    taskItem.appendChild(checkbox);

    //taskItem.textContent = taskObj.task; --> this method overwrites the checkbox you just appended.
    const taskText = document.createElement("span");
    taskText.textContent = taskObj.task;
    taskItem.appendChild(taskText);

    taskList.appendChild(taskItem);
  });

  if (shouldRefresh) {
    await fetchAndRefreshPage();
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

async function deleteTask(taskId) {
  try {
    const response = await fetch(`${serverUrl}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      // Remove the deleted task from the fetchedData array
      fetchedData = fetchedData.filter((task) => task.id !== taskId);

      // Update the page without refreshing (shouldRefresh = false)
      updatePage(fetchedData, false);
    } else {
      console.error("Error deleting task:", data.message);
    }
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

async function fetchAndRefreshPage() {
  try {
    const data = await fetchTasks();

    taskList.textContent = "";
    updatePage(data, false);
  } catch (error) {
    console.error("Error updating page:", error);
  }
}

taskForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  await createTask();
  await fetchAndRefreshPage();
});

fetchAndRefreshPage();
