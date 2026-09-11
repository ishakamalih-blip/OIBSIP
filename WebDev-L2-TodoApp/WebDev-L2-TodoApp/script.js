/* =====================================================
   TASKFLOW — COMPLETE JAVASCRIPT
===================================================== */


/* =====================================================
   STORAGE
===================================================== */

let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];

let currentFilter = "all";


/* =====================================================
   DOM ELEMENTS
===================================================== */

const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priority");
const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const totalTasks =
    document.getElementById("totalTasks");

const activeTasks =
    document.getElementById("activeTasks");

const completedTasks =
    document.getElementById("completedTasks");

const themeToggle =
    document.getElementById("themeToggle");


/* =====================================================
   SAVE TASKS
===================================================== */

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

}


/* =====================================================
   ADD TASK
===================================================== */

function addTask() {

    const title = taskInput.value.trim();

    if (title === "") {

        alert("Please enter a task.");

        taskInput.focus();

        return;
    }


    const task = {

        id: Date.now(),

        title: title,

        priority: priorityInput
            ? priorityInput.value
            : "medium",

        completed: false,

        createdAt: new Date().toISOString(),

        dueDate: null

    };


    tasks.unshift(task);


    saveTasks();

    taskInput.value = "";

    renderTasks();

    updateDashboard();

    taskInput.focus();

}


/* =====================================================
   DELETE TASK
===================================================== */

function deleteTask(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) {
        return;
    }


    tasks = tasks.filter(
        task => task.id !== id
    );


    saveTasks();

    renderTasks();

    updateDashboard();

}


/* =====================================================
   TOGGLE TASK
===================================================== */

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {

                ...task,

                completed: !task.completed

            };

        }

        return task;

    });


    saveTasks();

    renderTasks();

    updateDashboard();

}


/* =====================================================
   EDIT TASK
===================================================== */

function editTask(id) {

    const task =
        tasks.find(task => task.id === id);


    if (!task) {
        return;
    }


    const newTitle =
        prompt(
            "Edit your task:",
            task.title
        );


    if (
        newTitle === null ||
        newTitle.trim() === ""
    ) {
        return;
    }


    task.title = newTitle.trim();


    saveTasks();

    renderTasks();

}


/* =====================================================
   SEARCH
===================================================== */

function getFilteredTasks() {

    const searchText =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    let filtered = [...tasks];


    /* FILTER */

    if (currentFilter === "active") {

        filtered =
            filtered.filter(
                task => !task.completed
            );

    }


    if (currentFilter === "completed") {

        filtered =
            filtered.filter(
                task => task.completed
            );

    }


    /* SEARCH */

    if (searchText !== "") {

        filtered =
            filtered.filter(task =>
                task.title
                    .toLowerCase()
                    .includes(searchText)
            );

    }


    return filtered;

}


/* =====================================================
   RENDER TASKS
===================================================== */

function renderTasks() {

    if (!taskList) {
        return;
    }


    const filteredTasks =
        getFilteredTasks();


    taskList.innerHTML = "";


    if (filteredTasks.length === 0) {

        if (emptyState) {

            emptyState.style.display = "block";

            const heading =
                emptyState.querySelector("h3");

            const paragraph =
                emptyState.querySelector("p");


            if (searchInput && searchInput.value.trim()) {

                if (heading) {
                    heading.textContent =
                        "No tasks found";
                }

                if (paragraph) {
                    paragraph.textContent =
                        "Try searching with another keyword.";
                }

            } else if (currentFilter === "completed") {

                if (heading) {
                    heading.textContent =
                        "No completed tasks";
                }

                if (paragraph) {
                    paragraph.textContent =
                        "Complete a task and it will appear here.";
                }

            } else if (currentFilter === "active") {

                if (heading) {
                    heading.textContent =
                        "No active tasks";
                }

                if (paragraph) {
                    paragraph.textContent =
                        "Great! You have no pending tasks.";
                }

            } else {

                if (heading) {
                    heading.textContent =
                        "Your day is clear!";
                }

                if (paragraph) {
                    paragraph.textContent =
                        "Add a task and start making progress.";
                }

            }

        }

        return;

    }


    if (emptyState) {

        emptyState.style.display = "none";

    }


    filteredTasks.forEach(task => {

        const taskItem =
            document.createElement("div");


        taskItem.className =
            "task-item";


        if (task.completed) {

            taskItem.classList.add(
                "completed"
            );

        }


        taskItem.innerHTML = `

            <div class="task-content">

                <input
                    type="checkbox"
                    class="task-checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >

                <div class="task-info">

                    <div class="task-title">
                        ${escapeHTML(task.title)}
                    </div>

                    <div class="task-meta">

                        <span>
                            ${getTaskStatus(task)}
                        </span>

                        <span>
                            ${formatDate(task.createdAt)}
                        </span>

                    </div>

                </div>

            </div>


            <div class="task-actions">

                <span class="priority-badge ${task.priority}">
                    ${task.priority}
                </span>

                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})"
                    title="Edit Task"
                >
                    ✏️
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                    title="Delete Task"
                >
                    🗑️
                </button>

            </div>

        `;


        taskList.appendChild(taskItem);

    });

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =====================================================
   TASK STATUS
===================================================== */

function getTaskStatus(task) {

    if (task.completed) {

        return "✓ Completed";

    }

    return "○ Pending";

}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =====================================================
   DASHBOARD STATISTICS
===================================================== */

function updateDashboard() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const active =
        total - completed;


    if (totalTasks) {

        totalTasks.textContent =
            total;

    }


    if (activeTasks) {

        activeTasks.textContent =
            active;

    }


    if (completedTasks) {

        completedTasks.textContent =
            completed;

    }


    updateProgress();

}


/* =====================================================
   PROGRESS
===================================================== */

function updateProgress() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    const progressBar =
        document.querySelector(
            ".progress-bar"
        );


    const progressText =
        document.querySelector(
            ".progress-header strong"
        );


    if (progressBar) {

        progressBar.style.width =
            percentage + "%";

    }


    if (progressText) {

        progressText.textContent =
            percentage + "%";

    }

}


/* =====================================================
   FILTER BUTTONS
===================================================== */

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            currentFilter =
                button.dataset.filter;


            renderTasks();

        }
    );

});


/* =====================================================
   SEARCH EVENT
===================================================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            renderTasks();

        }
    );

}


/* =====================================================
   ADD TASK BUTTON
===================================================== */

if (addTaskBtn) {

    addTaskBtn.addEventListener(
        "click",
        addTask
    );

}


/* =====================================================
   ENTER KEY
===================================================== */

if (taskInput) {

    taskInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                addTask();

            }

        }
    );

}


/* =====================================================
   DARK / LIGHT THEME
===================================================== */

if (themeToggle) {

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


            themeToggle.textContent =
                isLight ? "☀" : "☾";


            localStorage.setItem(
                "taskflowTheme",
                isLight
                    ? "light"
                    : "dark"
            );

        }
    );

}


/* =====================================================
   LOAD SAVED THEME
===================================================== */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "taskflowTheme"
        );


    if (savedTheme === "light") {

        document.body.classList.add(
            "light-theme"
        );


        if (themeToggle) {

            themeToggle.textContent =
                "☀";

        }

    }

}


/* =====================================================
   INITIALIZE APP
===================================================== */

loadTheme();

renderTasks();

updateDashboard();


/* =====================================================
   CONSOLE MESSAGE
===================================================== */

console.log(
    "TaskFlow loaded successfully 🚀"
);
