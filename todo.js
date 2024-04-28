document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.querySelector(".task-input input");
    const taskBox = document.querySelector(".task-box");
    const allTasks = taskBox.querySelectorAll("li");
    const filters = document.querySelectorAll(".filters span");
    const clearBtn = document.querySelector(".clear-btn");
    const showPercentageCheckbox = document.querySelector("#showPercentage");
    const completionPercentageSpan = document.querySelector("#completionPercentage");
    const completionCommentSpan = document.querySelector("#completionComment");
    const completionBadgeSpan = document.querySelector("#completionBadge");
    const tasksCompletedSpan = document.querySelector("#tasksCompleted");
    const totalTasksSpan = document.querySelector("#totalTasks");

    let tasks = [];

    function updateCompletionDetails() {
        const completedTasks = tasks.filter(task => task.completed).length;
        const totalTasks = tasks.length;
        const completionPercentage = (completedTasks / totalTasks) * 100;

        completionPercentageSpan.textContent = `${completionPercentage.toFixed(2)}%`;
        tasksCompletedSpan.textContent = completedTasks;
        totalTasksSpan.textContent = totalTasks;
        if (completionPercentage === 100) {
            completionCommentSpan.textContent = "Congratulations! All tasks completed!";
            completionBadgeSpan.textContent = "🎉";
        } else if (completionPercentage >= 75) {
            completionCommentSpan.textContent = "Almost there! Keep it up!";
            completionBadgeSpan.textContent = "😊";
        } else if (completionPercentage >= 50) {
            completionCommentSpan.textContent = "Making good progress!";
            completionBadgeSpan.textContent = "👍";
        } else {
            completionCommentSpan.textContent = "Keep going! You can do it!";
            completionBadgeSpan.textContent = "💪";
        }
    }

    function addTask(taskName) {
        const task = {
            id: Date.now(),
            name: taskName,
            completed: false
        };
        tasks.push(task);
        renderTasks();
    }

    function renderTasks() {
        taskBox.innerHTML = "";
        tasks.forEach(task => {
            const taskItem = document.createElement("li");
            taskItem.innerHTML = `
                <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
                <label for="task-${task.id}">${task.name}</label>
            `;
            taskItem.querySelector("input").addEventListener("change", function() {
                task.completed = this.checked;
                updateCompletionDetails();
            });
            taskBox.appendChild(taskItem);
        });
        updateCompletionDetails();
    }

    taskInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter" && taskInput.value.trim() !== "") {
            addTask(taskInput.value.trim());
            taskInput.value = "";
        }
    });

    filters.forEach(filter => {
        filter.addEventListener("click", function() {
            filters.forEach(f => f.classList.remove("active"));
            this.classList.add("active");
            const filterType = this.id;
            if (filterType === "all") {
                renderTasks();
            } else if (filterType === "pending") {
                const pendingTasks = tasks.filter(task => !task.completed);
                taskBox.innerHTML = "";
                pendingTasks.forEach(task => {
                    const taskItem = document.createElement("li");
                    taskItem.innerHTML = `
                        <input type="checkbox" id="task-${task.id}">
                        <label for="task-${task.id}">${task.name}</label>
                    `;
                    taskItem.querySelector("input").addEventListener("change", function() {
                        task.completed = this.checked;
                        updateCompletionDetails();
                    });
                    taskBox.appendChild(taskItem);
                });
            } else if (filterType === "completed") {
                const completedTasks = tasks.filter(task => task.completed);
                taskBox.innerHTML = "";
                completedTasks.forEach(task => {
                    const taskItem = document.createElement("li");
                    taskItem.innerHTML = `
                        <input type="checkbox" id="task-${task.id}" checked>
                        <label for="task-${task.id}">${task.name}</label>
                    `;
                    taskItem.querySelector("input").addEventListener("change", function() {
                        task.completed = this.checked;
                        updateCompletionDetails();
                    });
                    taskBox.appendChild(taskItem);
                });
            }
        });
    });

    clearBtn.addEventListener("click", function() {
        tasks = [];
        renderTasks();
    });

    showPercentageCheckbox.addEventListener("change", function() {
        const summary = document.querySelector(".summary");
        summary.style.display = showPercentageCheckbox.checked ? "block" : "none";
    });

    renderTasks();
});
