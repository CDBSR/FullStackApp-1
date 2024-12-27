
import { baseurl } from "./baseUrl.js";

let addTodoDiv = document.getElementById("add-todo");
let form = document.getElementById("form");
let addUpdateButton = document.getElementById("add_update_todo");

document.getElementById("close_modal").addEventListener("click", function () {
  addTodoDiv.style.display = "none";
  resetForm();
});

document.getElementById("add_todo_btn").addEventListener("click", function () {
  openAddTodoModal();
});

document.getElementById("logout").addEventListener("click", function () {
  localStorage.removeItem("loginData");
  alert("Redirecting to home page...");
  window.location.href = "index.html";
});

let loginData = JSON.parse(localStorage.getItem("loginData"));
if (!loginData) {
  alert("Please login...");
  window.location.href = "login.html";
}

document.getElementById("user-name").textContent = `Welcome, ${loginData.username}`;

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  let title = form.title.value;
  let deadline = form.deadline.value;
  let priority = form.priority.value;

  let todoObj = {
    title,
    deadline,
    priority,
    status: false,
    userId: loginData.id,
  };

  let method = form.submit.value === "Add Todo" ? "POST" : "PATCH";
  let url =
    method === "POST"
      ? `${baseurl}/todos`
      : `${baseurl}/todos/${form.todoId.value}`;
  let message = method === "POST" ? "Todo Added" : "Todo Edited...";

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoObj),
    });

    if (!response.ok) {
      throw new Error("Failed to save the todo");
    }

    alert(message);
    await loadData();
    addTodoDiv.style.display = "none";
  } catch (err) {
    alert("Something went wrong!");
    console.error("Error in adding/editing Todo: ", err);
  } finally {
    resetForm();
  }
});

async function loadData() {
  const todos = await getTodos();
  displayTodos(todos);
}

async function getTodos() {
  try {
    const res = await fetch(`${baseurl}/todos`);
    const data = await res.json();
    return data.filter((el) => el.userId === loginData.id);
  } catch (err) {
    console.error("Error in getting Todos: ", err);
    alert("Something went wrong while fetching Todos");
    return [];
  }
}

function displayTodos(todos) {
  let container = document.getElementById("todo-container");
  container.innerHTML = "";

  todos.forEach((todo) => {
    let card = document.createElement("div");
    card.setAttribute("class", "todo-card");

    let title = document.createElement("h4");
    title.textContent = `Title: ${todo.title}`;

    let deadline = document.createElement("h4");
    deadline.textContent = `Deadline: ${todo.deadline}`;

    let priority = document.createElement("h4");
    priority.textContent = `Priority: ${todo.priority}`;

    let status = document.createElement("h4");
    status.textContent = todo.status ? "Status: Completed" : "Status: Pending";

    let toggleStatusButton = document.createElement("button");
    toggleStatusButton.setAttribute("class", "todobtns");
    toggleStatusButton.textContent = "Toggle Status";
    toggleStatusButton.addEventListener("click", async () => {
      await toggleStatus(todo);
    });

    let editButton = document.createElement("button");
    editButton.setAttribute("class", "todobtns");
    editButton.textContent = "Edit Todo";
    editButton.addEventListener("click", () => openEditTodoModal(todo));

    let deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "todobtns");
    deleteButton.textContent = "Delete Todo";
    deleteButton.addEventListener("click", async () => {
      await deleteTodo(todo.id);
    });

    card.append(title, deadline, priority, status, editButton, toggleStatusButton, deleteButton);
    container.append(card);
  });
}

function openAddTodoModal() {
  addTodoDiv.style.display = "flex";
  addUpdateButton.textContent = "Add Todo";
  form.submit.value = "Add Todo";
  resetForm();
}

function openEditTodoModal(todo) {
  addTodoDiv.style.display = "flex";
  addUpdateButton.textContent = "Edit Todo";
  form.todoId.value = todo.id;
  form.title.value = todo.title;
  form.deadline.value = todo.deadline;
  form.priority.value = todo.priority;
  form.submit.value = "Edit Todo";
}

async function toggleStatus(todo) {
  let updatedTodo = { ...todo, status: !todo.status };

  try {
    const response = await fetch(`${baseurl}/todos/${todo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    });

    if (!response.ok) {
      throw new Error("Failed to update status");
    }

    alert("Todo status updated!");
    loadData();
  } catch (err) {
    console.error("Error in updating Todo status: ", err);
  }
}

async function deleteTodo(id) {
  try {
    const response = await fetch(`${baseurl}/todos/${id}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Failed to delete todo");
    }

    alert("Todo deleted!");
    loadData();
  } catch (err) {
    console.error("Error in deleting Todo: ", err);
  }
}

function resetForm() {
  form.reset();
  form.todoId.value = "";
}

window.onload = async () => {
  await loadData();
};
