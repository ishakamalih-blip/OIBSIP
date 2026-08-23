const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");
const themeToggle = document.getElementById("themeToggle");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistory");

let currentInput = "";
let history = JSON.parse(localStorage.getItem("calculatorHistory")) || [];

// Load history when page opens
renderHistory();

// Calculator button events
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        if (action === "clear") {
            currentInput = "";
            display.value = "";
            return;
        }

        if (action === "backspace") {
            currentInput = currentInput.slice(0, -1);
            display.value = currentInput;
            return;
        }

        if (action === "calculate") {
            calculateResult();
            return;
        }

        if (action === "square") {
            squareNumber();
            return;
        }

        if (action === "sqrt") {
            squareRoot();
            return;
        }

        if (value !== undefined) {
            handleInput(value);
        }
    });
});

// Handle number and operator input
function handleInput(value) {
    const operators = ["+", "-", "*", "/", "%"];
    const lastCharacter = currentInput.slice(-1);

    if (operators.includes(value) && operators.includes(lastCharacter)) {
        currentInput = currentInput.slice(0, -1) + value;
    } else {
        currentInput += value;
    }

    display.value = currentInput;
}

// Calculate result
function calculateResult() {
    if (currentInput === "") return;

    try {
        const expression = currentInput;

        // Prevent unsafe characters
        if (!/^[0-9+\-*/%.() ]+$/.test(expression)) {
            throw new Error("Invalid expression");
        }

        const result = Function(
            `"use strict"; return (${expression})`
        )();

        if (!Number.isFinite(result)) {
            throw new Error("Invalid result");
        }

        addToHistory(expression, result);

        currentInput = String(result);
        display.value = currentInput;

    } catch (error) {
        display.value = "Error";
        currentInput = "";
    }
}

// Square current number
function squareNumber() {
    try {
        if (currentInput === "") return;

        const number = Number(currentInput);

        if (!Number.isFinite(number)) {
            throw new Error("Invalid number");
        }

        const result = number * number;

        addToHistory(`${number}²`, result);

        currentInput = String(result);
        display.value = currentInput;

    } catch (error) {
        display.value = "Error";
        currentInput = "";
    }
}

// Square root
function squareRoot() {
    try {
        if (currentInput === "") return;

        const number = Number(currentInput);

        if (!Number.isFinite(number) || number < 0) {
            throw new Error("Invalid number");
        }

        const result = Math.sqrt(number);

        addToHistory(`√${number}`, result);

        currentInput = String(result);
        display.value = currentInput;

    } catch (error) {
        display.value = "Error";
        currentInput = "";
    }
}

// Add calculation to history
function addToHistory(expression, result) {
    history.unshift({
        expression: expression,
        result: result
    });

    // Keep only last 10 calculations
    history = history.slice(0, 10);

    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(history)
    );

    renderHistory();
}

// Display history
function renderHistory() {
    if (history.length === 0) {
        historyList.innerHTML =
            `<p class="empty-history">No calculations yet</p>`;
        return;
    }

    historyList.innerHTML = history
        .map((item, index) => {
            return `
                <div class="history-item" data-index="${index}">
                    <div class="history-expression">
                        ${item.expression}
                    </div>
                    <div class="history-result">
                        = ${item.result}
                    </div>
                </div>
            `;
        })
        .join("");

    // Click history item to reuse result
    document.querySelectorAll(".history-item").forEach((item) => {
        item.addEventListener("click", () => {
            const index = item.dataset.index;
            currentInput = String(history[index].result);
            display.value = currentInput;
        });
    });
}

// Clear history
clearHistoryBtn.addEventListener("click", () => {
    history = [];
    localStorage.removeItem("calculatorHistory");
    renderHistory();
});

// Dark / Light mode
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "☀️";
        localStorage.setItem("calculatorTheme", "dark");
    } else {
        themeToggle.textContent = "🌙";
        localStorage.setItem("calculatorTheme", "light");
    }
});

// Load saved theme
if (localStorage.getItem("calculatorTheme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
}

// Keyboard support
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/[0-9]/.test(key) || [".", "+", "-", "*", "/", "%"].includes(key)) {
        handleInput(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculateResult();
    } else if (key === "Backspace") {
        currentInput = currentInput.slice(0, -1);
        display.value = currentInput;
    } else if (key === "Escape") {
        currentInput = "";
        display.value = "";
    }
});
