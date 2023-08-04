const taskForm = document.querySelector(".taskForm");
const taskInput = document.querySelector(".taskInput");
const taskList = document.querySelector(".taskList");
const port = 3000;

const serverUrl = `http://localhost:${port}`;

let fetchedData = [];

async function fetchTasks() {
  try {
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
  // clear the current task list
  taskList.innerHTML = "";

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

    taskText.addEventListener("click", function () {
      const taskInput = document.createElement("input");
      taskInput.type = "text";
      taskInput.value = taskObj.task;

      // Handle blur event to save the updated task text
      taskInput.addEventListener("blur", function () {
        const updatedTaskText = taskInput.value.trim();
        if (updatedTaskText !== taskObj.task) {
          // Call the updateTaskItem function to update the task text in the database and on the page
          updateTaskItem(taskObj.id, updatedTaskText);
        }

        // Revert back to the original taskText after editing
        taskItem.removeChild(taskInput);
        taskText.textContent = updatedTaskText;
        taskText.style.display = "inline"; // Display the taskText again
      });

      // Hide the taskText while editing
      taskText.style.display = "none";
      taskItem.appendChild(taskInput);
      taskInput.focus(); // Set focus to the input field when activated
    });

    // Add click event listener to the checkbox
    checkbox.addEventListener("click", function () {
      if (checkbox.checked) {
        // Apply the line-through style when checkbox is checked
        taskText.style.textDecoration = "line-through";
      } else {
        // Remove the line-through style when checkbox is unchecked
        taskText.style.textDecoration = "none";
      }
    });

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

// Function to update the task item in the task list
async function updateTaskItem(taskId, updatedTaskText) {
  try {
    const response = await fetch(`${serverUrl}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: updatedTaskText }),
    });

    const data = await response.json();

    if (response.ok) {
      // Find the updated task in the fetchedData array and update its task text
      const updatedTask = fetchedData.find((task) => task.id === taskId);
      if (updatedTask) {
        updatedTask.task = updatedTaskText;
      }

      // Update the page without refreshing (shouldRefresh = false)
      updatePage(fetchedData, false);
    } else {
      console.error("Error updating task:", data.message);
    }
  } catch (error) {
    console.error("Error updating task:", error);
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
