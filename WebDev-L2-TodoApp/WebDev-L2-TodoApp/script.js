const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const pendingTasks = document.getElementById("pendingTasks");
const clearCompleted = document.getElementById("clearCompleted");
const filters = document.querySelectorAll(".filter");

let tasks = [];
let currentFilter = "all";

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);
    taskInput.value = "";

    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = task.completed ? "completed" : "";

        li.innerHTML = `
            <div class="task-content">
                <input 
                    type="checkbox" 
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >
                <span>${task.text}</span>
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">
                ✕
            </button>
        `;

        taskList.appendChild(li);
    });

    updateTaskInfo();
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

function updateTaskInfo() {
    const activeTasks = tasks.filter(task => !task.completed).length;

    taskCount.textContent = tasks.length;
    pendingTasks.textContent = `${activeTasks} task${activeTasks !== 1 ? "s" : ""} remaining`;
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

filters.forEach(filter => {
    filter.addEventListener("click", function () {
        filters.forEach(btn => btn.classList.remove("active"));

        this.classList.add("active");
        currentFilter = this.dataset.filter;

        renderTasks();
    });
});

clearCompleted.addEventListener("click", function () {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
});

renderTasks();
