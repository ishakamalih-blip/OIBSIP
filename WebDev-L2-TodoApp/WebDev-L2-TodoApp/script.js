/* =========================================
   TASKFLOW - PRODUCTIVITY APP
========================================= */

const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priority");
const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const progressPercent = document.getElementById("progressPercent");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");

const themeToggle = document.getElementById("themeToggle");

const filterButtons = document.querySelectorAll(".filter-btn");


/* =========================================
   LOAD TASKS
========================================= */

let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];

let currentFilter = "all";

let editingTaskId = null;


/* =========================================
   SAVE TASKS
========================================= */

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

}


/* =========================================
   GENERATE ID
========================================= */

function generateId() {

    return Date.now().toString();

}


/* =========================================
   ADD TASK
========================================= */

function addTask() {

    const title = taskInput.value.trim();

    if (title === "") {

        alert("Please enter a task.");

        taskInput.focus();

        return;
    }


    /* EDIT MODE */

    if (editingTaskId !== null) {

        const task = tasks.find(
            task => task.id === editingTaskId
        );

        if (task) {

            task.title = title;

            task.priority = priorityInput.value;

        }

        editingTaskId = null;

        addTaskBtn.textContent = "+ Add Task";

    }

    /* ADD MODE */

    else {

        const newTask = {

            id: generateId(),

            title: title,

            priority: priorityInput.value,

            completed: false,

            createdAt: new Date().toLocaleString()

        };


        tasks.unshift(newTask);

    }


    saveTasks();

    taskInput.value = "";

    priorityInput.value = "medium";

    renderTasks();

    updateDashboard();

}


/* =========================================
   RENDER TASKS
========================================= */

function renderTasks() {

    const searchTerm =
        searchInput.value.toLowerCase().trim();


    let filteredTasks = tasks.filter(task => {

        /* SEARCH */

        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm);


        /* FILTER */

        let matchesFilter = true;


        if (currentFilter === "active") {

            matchesFilter = !task.completed;

        }


        if (currentFilter === "completed") {

            matchesFilter = task.completed;

        }


        return matchesSearch && matchesFilter;

    });


    taskList.innerHTML = "";


    /* EMPTY STATE */

    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

        return;

    }


    emptyState.style.display = "none";


    filteredTasks.forEach(task => {

        const taskElement =
            document.createElement("div");


        taskElement.className =
            `task-item ${task.completed ? "completed" : ""}`;


        const priorityLabel =
            task.priority.charAt(0).toUpperCase() +
            task.priority.slice(1);


        taskElement.innerHTML = `

            <div class="task-content">

                <input
                    type="checkbox"
                    class="task-checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask('${task.id}')"
                >

                <div class="task-info">

                    <div class="task-title">
                        ${escapeHTML(task.title)}
                    </div>

                    <div class="task-meta">
                        Created: ${task.createdAt}
                    </div>

                </div>

            </div>


            <div class="task-actions">

                <span class="priority-badge ${task.priority}">
                    ${priorityLabel}
                </span>

                <button
                    class="edit-btn"
                    onclick="editTask('${task.id}')"
                    title="Edit Task"
                >
                    ✏️
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask('${task.id}')"
                    title="Delete Task"
                >
                    🗑️
                </button>

            </div>

        `;


        taskList.appendChild(taskElement);

    });

}


/* =========================================
   COMPLETE / UNCOMPLETE TASK
========================================= */

function toggleTask(id) {

    const task =
        tasks.find(task => task.id === id);


    if (!task) return;


    task.completed = !task.completed;


    saveTasks();

    renderTasks();

    updateDashboard();

}


/* =========================================
   DELETE TASK
========================================= */

function deleteTask(id) {

    const confirmDelete =
        confirm("Delete this task?");


    if (!confirmDelete) return;


    tasks =
        tasks.filter(task => task.id !== id);


    saveTasks();

    renderTasks();

    updateDashboard();

}


/* =========================================
   EDIT TASK
========================================= */

function editTask(id) {

    const task =
        tasks.find(task => task.id === id);


    if (!task) return;


    taskInput.value = task.title;

    priorityInput.value = task.priority;


    editingTaskId = id;


    addTaskBtn.textContent = "✓ Update Task";


    taskInput.focus();


    document
        .getElementById("tasks")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================================
   DASHBOARD UPDATE
========================================= */

function updateDashboard() {

    const total = tasks.length;


    const completed =
        tasks.filter(task => task.completed).length;


    const pending =
        total - completed;


    let progress = 0;


    if (total > 0) {

        progress =
            Math.round((completed / total) * 100);

    }


    totalTasks.textContent = total;

    pendingTasks.textContent = pending;

    completedTasks.textContent = completed;


    progressPercent.textContent =
        `${progress}%`;


    progressText.textContent =
        `${progress}%`;


    progressBar.style.width =
        `${progress}%`;

}


/* =========================================
   FILTER BUTTONS
========================================= */

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(btn => {

                btn.classList.remove("active");

            });


            button.classList.add("active");


            currentFilter =
                button.dataset.filter;


            renderTasks();

        }
    );

});


/* =========================================
   SEARCH
========================================= */

searchInput.addEventListener(
    "input",
    () => {

        renderTasks();

    }
);


/* =========================================
   ADD TASK BUTTON
========================================= */

addTaskBtn.addEventListener(
    "click",
    addTask
);


/* =========================================
   ENTER KEY
========================================= */

taskInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


/* =========================================
   THEME
========================================= */

const savedTheme =
    localStorage.getItem("taskflowTheme");


if (savedTheme === "light") {

    document.body.classList.add("light-theme");

    themeToggle.textContent = "☀";

}


themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light-theme"
        );


        const isLight =
            document.body.classList.contains(
                "light-theme"
            );


        localStorage.setItem(
            "taskflowTheme",
            isLight ? "light" : "dark"
        );


        themeToggle.textContent =
            isLight ? "☀" : "☾";

    }
);


/* =========================================
   SECURITY
   Prevent HTML injection inside task title
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================================
   INITIAL LOAD
========================================= */

renderTasks();

updateDashboard();
