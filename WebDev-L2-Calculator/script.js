const display = document.getElementById("display");

const buttons = document.querySelectorAll(".btn");

let currentInput = "";

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

        if (value) {
            handleInput(value);
        }
    });
});

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

function calculateResult() {
    try {
        if (currentInput === "") return;

        const result = Function(
            `"use strict"; return (${currentInput})`
        )();

        if (!Number.isFinite(result)) {
            display.value = "Error";
            currentInput = "";
            return;
        }

        currentInput = String(result);
        display.value = currentInput;
    } catch (error) {
        display.value = "Error";
        currentInput = "";
    }
}
