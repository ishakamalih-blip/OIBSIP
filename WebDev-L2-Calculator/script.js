const display = document.getElementById("display");
const expression = document.getElementById("expression");
const buttons = document.querySelectorAll(".buttons button");

const themeToggle = document.getElementById("themeToggle");
const copyResult = document.getElementById("copyResult");

const historyList = document.getElementById("historyList");
const clearHistory = document.getElementById("clearHistory");
const historyCount = document.getElementById("historyCount");

let currentInput = "";
let history = JSON.parse(localStorage.getItem("calculatorHistory")) || [];


/* ================= DISPLAY ================= */

function updateDisplay() {
    display.value = currentInput || "";
}


/* ================= CALCULATE ================= */

function calculate() {

    if (!currentInput) return;

    try {

        const originalExpression = currentInput;

        const result = Function(
            `"use strict"; return (${currentInput})`
        )();

        if (!Number.isFinite(result)) {
            throw new Error("Invalid calculation");
        }

        const formattedResult =
            Number.isInteger(result)
                ? result
                : Number(result.toFixed(8));

        expression.textContent = originalExpression
            .replace(/\*/g, "×")
            .replace(/\//g, "÷");

        currentInput = formattedResult.toString();

        updateDisplay();

        addToHistory(
            originalExpression,
            formattedResult
        );

    } catch {

        display.value = "Error";

        setTimeout(() => {
            currentInput = "";
            updateDisplay();
        }, 1000);
    }
}


/* ================= HISTORY ================= */

function addToHistory(exp, result) {

    history.unshift({
        expression: exp,
        result: result
    });

    // Keep only latest 10 calculations
    history = history.slice(0, 10);

    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(history)
    );

    renderHistory();
}


function renderHistory() {

    historyList.innerHTML = "";

    if (history.length === 0) {

        historyList.innerHTML = `
            <div class="empty-history">
                <div class="empty-icon">🧮</div>

                <p>No calculations yet</p>

                <small>
                    Your calculation history will appear here.
                </small>
            </div>
        `;

        historyCount.textContent = "0 calculations";

        return;
    }

    historyCount.textContent =
        `${history.length} calculation${history.length !== 1 ? "s" : ""}`;

    history.forEach(item => {

        const historyItem = document.createElement("div");

        historyItem.className = "history-item";

        historyItem.innerHTML = `
            <div class="history-expression">
                ${item.expression
                    .replace(/\*/g, "×")
                    .replace(/\//g, "÷")}
            </div>

            <div class="history-result">
                = ${item.result}
            </div>
        `;

        historyList.appendChild(historyItem);
    });
}


/* ================= BUTTONS ================= */

buttons.forEach(button => {

    button.addEventListener("click", () => {

        const value = button.dataset.value;
        const action = button.dataset.action;


        // Number / operator / decimal
        if (value !== undefined) {

            currentInput += value;

            updateDisplay();

            return;
        }


        // Clear
        if (action === "clear") {

            currentInput = "";
            expression.textContent = "Ready to calculate...";

            updateDisplay();

            return;
        }


        // Backspace
        if (action === "backspace") {

            currentInput = currentInput.slice(0, -1);

            updateDisplay();

            return;
        }


        // Square
        if (action === "square") {

            if (!currentInput) return;

            currentInput = `(${currentInput})**2`;

            calculate();

            return;
        }


        // Square root
        if (action === "sqrt") {

            if (!currentInput) return;

            try {

                const number = Number(currentInput);

                if (number < 0) throw new Error();

                const result = Math.sqrt(number);

                expression.textContent = `√${number}`;

                currentInput = result.toString();

                updateDisplay();

                addToHistory(`√${number}`, result);

            } catch {

                display.value = "Error";
            }

            return;
        }


        // Equal
        if (action === "calculate") {

            calculate();

        }

    });

});


/* ================= KEYBOARD SUPPORT ================= */

document.addEventListener("keydown", (event) => {

    const key = event.key;

    if (
        /^[0-9.]$/.test(key) ||
        ["+", "-", "*", "/"].includes(key)
    ) {

        currentInput += key;

        updateDisplay();

        return;
    }


    if (key === "Enter" || key === "=") {

        event.preventDefault();

        calculate();

        return;
    }


    if (key === "Backspace") {

        currentInput = currentInput.slice(0, -1);

        updateDisplay();

        return;
    }


    if (key === "Escape") {

        currentInput = "";

        expression.textContent = "Ready to calculate...";

        updateDisplay();

    }

});


/* ================= COPY RESULT ================= */

copyResult.addEventListener("click", async () => {

    if (!currentInput) return;

    try {

        await navigator.clipboard.writeText(currentInput);

        copyResult.textContent = "✓";

        setTimeout(() => {
            copyResult.textContent = "📋";
        }, 1200);

    } catch {

        alert("Unable to copy result.");

    }

});


/* ================= CLEAR HISTORY ================= */

clearHistory.addEventListener("click", () => {

    if (history.length === 0) return;

    history = [];

    localStorage.removeItem("calculatorHistory");

    renderHistory();

});


/* ================= DARK MODE ================= */

const savedTheme = localStorage.getItem("calculatorTheme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeToggle.textContent = "☀️";

}


themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    themeToggle.textContent =
        isDark ? "☀️" : "🌙";

    localStorage.setItem(
        "calculatorTheme",
        isDark ? "dark" : "light"
    );

});


/* ================= INITIALIZE ================= */

renderHistory();
updateDisplay();
