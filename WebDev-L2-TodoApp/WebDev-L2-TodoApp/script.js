/* =====================================================
   TASKFLOW — SMART PRODUCTIVITY TODO APP
   Complete script.js
===================================================== */


/* =====================================================
   STORAGE
===================================================== */

let tasks =
    JSON.parse(localStorage.getItem("taskflowTasks")) || [];

let currentFilter = "all";


/* =====================================================
   DOM ELEMENTS
===================================================== */

const taskInput =
    document.getElementById("taskInput");

const priorityInput =
    document.getElementById("priority");

const categoryInput =
    document.getElementById("category");

const dueDateInput =
    document.getElementById("dueDate");

const taskNotesInput =
    document.getElementById("taskNotes");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const taskList =
    document.getElementById("taskList");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const themeToggle =
    document.getElementById("themeToggle");


/* =====================================================
   DASHBOARD ELEMENTS
===================================================== */

const totalTasks =
    document.getElementById("totalTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const completedTasks =
    document.getElementById("completedTasks");

const progressPercent =
    document.getElementById("progressPercent");

const progressText =
    document.getElementById("progressText");

const progressBar =
    document.getElementById("progressBar");

const todayTaskCount =
    document.getElementById("todayTaskCount");

const upcomingTaskCount =
    document.getElementById("upcomingTaskCount");

const overdueTaskCount =
    document.getElementById("overdueTaskCount");

const highPriorityCount =
    document.getElementById("highPriorityCount");


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

    const title =
        taskInput.value.trim();


    if (title === "") {

        alert("Please enter a task.");

        taskInput.focus();

        return;

    }


    const task = {

        id: Date.now(),

        title: title,

        priority:
            priorityInput.value,

        category:
            categoryInput.value,

        dueDate:
            dueDateInput.value || null,

        notes:
            taskNotesInput.value.trim(),

        completed: false,

        createdAt:
            new Date().toISOString()

    };


    tasks.unshift(task);


    saveTasks();


    /* Clear inputs */

    taskInput.value = "";

    taskNotesInput.value = "";

    dueDateInput.value = "";

    priorityInput.value = "medium";

    categoryInput.value = "College";


    renderTasks();

    updateDashboard();

    taskInput.focus();

}


/* =====================================================
   DELETE TASK
===================================================== */

function deleteTask(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmDelete) {

        return;

    }


    tasks =
        tasks.filter(
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

    tasks =
        tasks.map(task => {

            if (task.id === id) {

                return {

                    ...task,

                    completed:
                        !task.completed

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
        tasks.find(
            task => task.id === id
        );


    if (!task) {

        return;

    }


    const newTitle =
        prompt(
            "Edit task:",
            task.title
        );


    if (
        newTitle === null ||
        newTitle.trim() === ""
    ) {

        return;

    }


    task.title =
        newTitle.trim();


    saveTasks();

    renderTasks();

}


/* =====================================================
   GET FILTERED TASKS
===================================================== */

function getFilteredTasks() {

    let filtered =
        [...tasks];


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

    const searchText =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    if (searchText !== "") {

        filtered =
            filtered.filter(task => {

                const title =
                    task.title
                        .toLowerCase();

                const category =
                    (task.category || "")
                        .toLowerCase();

                const notes =
                    (task.notes || "")
                        .toLowerCase();


                return (

                    title.includes(searchText) ||

                    category.includes(searchText) ||

                    notes.includes(searchText)

                );

            });

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

        showEmptyState();

        return;

    }


    if (emptyState) {

        emptyState.style.display =
            "none";

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


        const dueDate =
            task.dueDate
                ? formatDueDate(task.dueDate)
                : "No due date";


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

                        ${escapeHTML(
                            task.category || "Other"
                        )}

                        • ${dueDate}

                        ${task.notes
                            ? " • " +
                              escapeHTML(task.notes)
                            : ""
                        }

                    </div>

                </div>

            </div>


            <div class="task-actions">

                <span
                    class="priority-badge ${task.priority}"
                >
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


        taskList.appendChild(
            taskItem
        );

    });

}


/* =====================================================
   EMPTY STATE
===================================================== */

function showEmptyState() {

    if (!emptyState) {

        return;

    }


    emptyState.style.display =
        "block";


    const heading =
        emptyState.querySelector("h3");

    const paragraph =
        emptyState.querySelector("p");


    const searchText =
        searchInput
            ? searchInput.value.trim()
            : "";


    if (searchText) {

        heading.textContent =
            "No tasks found";

        paragraph.textContent =
            "Try another search keyword.";

    }

    else if (
        currentFilter === "completed"
    ) {

        heading.textContent =
            "No completed tasks";

        paragraph.textContent =
            "Complete a task and it will appear here.";

    }

    else if (
        currentFilter === "active"
    ) {

        heading.textContent =
            "No pending tasks";

        paragraph.textContent =
            "Great! You have no pending tasks.";

    }

    else {

        heading.textContent =
            "Your task list is clear!";

        paragraph.textContent =
            "Add your first task and start making progress.";

    }

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}


/* =====================================================
   FORMAT DUE DATE
===================================================== */

function formatDueDate(dateString) {

    if (!dateString) {

        return "No due date";

    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


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
   GET TODAY DATE
===================================================== */

function getToday() {

    const today =
        new Date();


    return today
        .toISOString()
        .split("T")[0];

}


/* =====================================================
   UPDATE DASHBOARD
===================================================== */

function updateDashboard() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const pending =
        total - completed;


    let progress = 0;


    if (total > 0) {

        progress =
            Math.round(
                (completed / total) * 100
            );

    }


    /* TOTAL */

    if (totalTasks) {

        totalTasks.textContent =
            total;

    }


    /* PENDING */

    if (pendingTasks) {

        pendingTasks.textContent =
            pending;

    }


    /* COMPLETED */

    if (completedTasks) {

        completedTasks.textContent =
            completed;

    }


    /* PROGRESS */

    if (progressPercent) {

        progressPercent.textContent =
            progress + "%";

    }


    if (progressText) {

        progressText.textContent =
            progress + "%";

    }


    if (progressBar) {

        progressBar.style.width =
            progress + "%";

    }


    updateSmartOverview();

}


/* =====================================================
   SMART OVERVIEW
===================================================== */

function updateSmartOverview() {

    const today =
        getToday();


    /* TODAY */

    const todayTasks =
        tasks.filter(task =>
            task.dueDate === today
        );


    /* UPCOMING */

    const upcomingTasks =
        tasks.filter(task => {

            return (

                task.dueDate &&
                task.dueDate > today &&
                !task.completed

            );

        });


    /* OVERDUE */

    const overdueTasks =
        tasks.filter(task => {

            return (

                task.dueDate &&
                task.dueDate < today &&
                !task.completed

            );

        });


    /* HIGH PRIORITY */

    const highTasks =
        tasks.filter(task => {

            return (

                task.priority === "high" &&
                !task.completed

            );

        });


    if (todayTaskCount) {

        todayTaskCount.textContent =
            todayTasks.length;

    }


    if (upcomingTaskCount) {

        upcomingTaskCount.textContent =
            upcomingTasks.length;

    }


    if (overdueTaskCount) {

        overdueTaskCount.textContent =
            overdueTasks.length;

    }


    if (highPriorityCount) {

        highPriorityCount.textContent =
            highTasks.length;

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
   SEARCH
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
   ADD BUTTON
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
   THEME TOGGLE
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
                isLight
                    ? "☀"
                    : "☾";


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
   LOAD THEME
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
   SET MINIMUM DATE
===================================================== */

function setMinimumDate() {

    if (dueDateInput) {

        dueDateInput.min =
            getToday();

    }

}


/* =====================================================
   INITIALIZE
===================================================== */

loadTheme();

setMinimumDate();

renderTasks();

updateDashboard();


/* =====================================================
   SUCCESS MESSAGE
===================================================== */

console.log(
    "TaskFlow is ready 🚀"
);
