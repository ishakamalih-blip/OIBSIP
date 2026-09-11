/* =====================================================
   TASKFLOW — COMPLETE JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       ELEMENTS
    ================================================= */

    const taskInput = document.getElementById("taskInput");
    const priority = document.getElementById("priority");
    const category = document.getElementById("category");
    const dueDate = document.getElementById("dueDate");
    const taskNotes = document.getElementById("taskNotes");

    const addTaskBtn = document.getElementById("addTaskBtn");

    const taskList = document.getElementById("taskList");
    const emptyState = document.getElementById("emptyState");

    const searchInput = document.getElementById("searchInput");

    const filterButtons =
        document.querySelectorAll(".filter-btn");

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

    const themeToggle =
        document.getElementById("themeToggle");


    /* =================================================
       DATA
    ================================================= */

    let tasks =
        JSON.parse(localStorage.getItem("taskflowTasks")) || [];

    let currentFilter = "all";


    /* =================================================
       SAVE TASKS
    ================================================= */

    function saveTasks() {

        localStorage.setItem(
            "taskflowTasks",
            JSON.stringify(tasks)
        );

    }


    /* =================================================
       ADD TASK
    ================================================= */

    function addTask() {

        const title =
            taskInput.value.trim();

        if (title === "") {

            alert("Please enter a task.");

            taskInput.focus();

            return;
        }


        const newTask = {

            id: Date.now(),

            title: title,

            priority:
                priority.value,

            category:
                category.value,

            dueDate:
                dueDate.value,

            notes:
                taskNotes.value.trim(),

            completed:
                false,

            createdAt:
                new Date().toLocaleDateString()

        };


        tasks.unshift(newTask);

        saveTasks();

        clearInputs();

        renderTasks();

    }


    /* =================================================
       CLEAR INPUTS
    ================================================= */

    function clearInputs() {

        taskInput.value = "";

        priority.value = "medium";

        category.value = "College";

        dueDate.value = "";

        taskNotes.value = "";

        taskInput.focus();

    }


    /* =================================================
       RENDER TASKS
    ================================================= */

    function renderTasks() {

        taskList.innerHTML = "";


        let filteredTasks =
            [...tasks];


        /* FILTER */

        if (currentFilter === "active") {

            filteredTasks =
                filteredTasks.filter(
                    task => !task.completed
                );

        }


        if (currentFilter === "completed") {

            filteredTasks =
                filteredTasks.filter(
                    task => task.completed
                );

        }


        /* SEARCH */

        const searchTerm =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        if (searchTerm !== "") {

            filteredTasks =
                filteredTasks.filter(task =>

                    task.title
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    task.category
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    task.notes
                        .toLowerCase()
                        .includes(searchTerm)

                );

        }


        /* EMPTY STATE */

        if (filteredTasks.length === 0) {

            emptyState.style.display = "block";

        } else {

            emptyState.style.display = "none";

        }


        /* CREATE TASK CARDS */

        filteredTasks.forEach(task => {

            const taskItem =
                document.createElement("div");

            taskItem.className =
                "task-item";


            if (task.completed) {

                taskItem.classList.add("completed");

            }


            const priorityName =
                task.priority || "medium";


            const categoryName =
                task.category || "Other";


            taskItem.innerHTML = `

                <div class="task-content">

                    <input
                        type="checkbox"
                        class="task-checkbox"
                        ${task.completed ? "checked" : ""}
                        data-id="${task.id}"
                    >

                    <div class="task-info">

                        <div class="task-title">
                            ${escapeHTML(task.title)}
                        </div>

                        <div class="task-meta">

                            ${escapeHTML(categoryName)}

                            ${
                                task.dueDate
                                ? ` • Due: ${formatDate(task.dueDate)}`
                                : ""
                            }

                            ${
                                task.notes
                                ? ` • ${escapeHTML(task.notes)}`
                                : ""
                            }

                        </div>

                    </div>

                </div>


                <div class="task-actions">

                    <span
                        class="priority-badge ${priorityName}"
                    >
                        ${priorityName}
                    </span>


                    <button
                        class="edit-btn"
                        data-id="${task.id}"
                        title="Edit Task"
                    >
                        ✏️
                    </button>


                    <button
                        class="delete-btn"
                        data-id="${task.id}"
                        title="Delete Task"
                    >
                        🗑️
                    </button>

                </div>

            `;


            taskList.appendChild(taskItem);

        });


        updateStatistics();

    }


    /* =================================================
       UPDATE STATISTICS
    ================================================= */

    function updateStatistics() {

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


        if (totalTasks) {

            totalTasks.textContent =
                total;

        }


        if (pendingTasks) {

            pendingTasks.textContent =
                pending;

        }


        if (completedTasks) {

            completedTasks.textContent =
                completed;

        }


        if (progressPercent) {

            progressPercent.textContent =
                `${progress}%`;

        }


        if (progressText) {

            progressText.textContent =
                `${progress}%`;

        }


        if (progressBar) {

            progressBar.style.width =
                `${progress}%`;

        }

    }


    /* =================================================
       COMPLETE TASK
    ================================================= */

    taskList.addEventListener(
        "change",
        event => {

            if (
                event.target.classList.contains(
                    "task-checkbox"
                )
            ) {

                const id =
                    Number(
                        event.target.dataset.id
                    );


                const task =
                    tasks.find(
                        item => item.id === id
                    );


                if (task) {

                    task.completed =
                        event.target.checked;

                    saveTasks();

                    renderTasks();

                }

            }

        }
    );


    /* =================================================
       EDIT / DELETE
    ================================================= */

    taskList.addEventListener(
        "click",
        event => {

            /* DELETE */

            if (
                event.target.classList.contains(
                    "delete-btn"
                )
            ) {

                const id =
                    Number(
                        event.target.dataset.id
                    );


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

            }


            /* EDIT */

            if (
                event.target.classList.contains(
                    "edit-btn"
                )
            ) {

                const id =
                    Number(
                        event.target.dataset.id
                    );


                const task =
                    tasks.find(
                        item => item.id === id
                    );


                if (!task) {

                    return;

                }


                const updatedTitle =
                    prompt(
                        "Edit task:",
                        task.title
                    );


                if (
                    updatedTitle !== null
                    &&
                    updatedTitle.trim() !== ""
                ) {

                    task.title =
                        updatedTitle.trim();

                    saveTasks();

                    renderTasks();

                }

            }

        }
    );


    /* =================================================
       ADD BUTTON
    ================================================= */

    if (addTaskBtn) {

        addTaskBtn.addEventListener(
            "click",
            addTask
        );

    }


    /* =================================================
       ENTER KEY
    ================================================= */

    taskInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                addTask();

            }

        }
    );


    /* =================================================
       SEARCH
    ================================================= */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderTasks
        );

    }


    /* =================================================
       FILTER BUTTONS
    ================================================= */

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


    /* =================================================
       THEME TOGGLE
    ================================================= */

    if (themeToggle) {

        const savedTheme =
            localStorage.getItem(
                "taskflowTheme"
            );


        if (savedTheme === "light") {

            document.body.classList.add(
                "light-theme"
            );

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


    /* =================================================
       DATE FORMAT
    ================================================= */

    function formatDate(dateString) {

        if (!dateString) {

            return "";

        }


        const date =
            new Date(
                dateString + "T00:00:00"
            );


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    /* =================================================
       SECURITY
       Prevent HTML injection in task text
    ================================================= */

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text || "";

        return div.innerHTML;

    }


    /* =================================================
       INITIAL LOAD
    ================================================= */

    renderTasks();

});
