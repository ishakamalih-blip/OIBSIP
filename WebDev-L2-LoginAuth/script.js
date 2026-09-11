const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");

const registerPassword = document.getElementById("registerPassword");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");


/* ================= TAB SWITCHING ================= */

loginTab.addEventListener("click", () => {

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

    clearMessages();
});


registerTab.addEventListener("click", () => {

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    clearMessages();
});


function clearMessages() {
    loginMessage.textContent = "";
    registerMessage.textContent = "";

    loginMessage.className = "message";
    registerMessage.className = "message";
}


/* ================= PASSWORD SHOW / HIDE ================= */

document.querySelectorAll(".show-password").forEach(button => {

    button.addEventListener("click", () => {

        const targetId = button.dataset.target;
        const input = document.getElementById(targetId);

        if (input.type === "password") {

            input.type = "text";
            button.textContent = "🙈";

        } else {

            input.type = "password";
            button.textContent = "👁";

        }

    });

});


/* ================= PASSWORD STRENGTH ================= */

registerPassword.addEventListener("input", () => {

    const password = registerPassword.value;

    let strength = 0;

    if (password.length >= 8) {
        strength++;
    }

    if (/[A-Z]/.test(password)) {
        strength++;
    }

    if (/[0-9]/.test(password)) {
        strength++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        strength++;
    }


    if (password.length === 0) {

        strengthBar.style.width = "0%";
        strengthText.textContent = "Password strength";

    } else if (strength <= 1) {

        strengthBar.style.width = "25%";
        strengthText.textContent = "Weak password";

    } else if (strength === 2) {

        strengthBar.style.width = "50%";
        strengthText.textContent = "Medium password";

    } else if (strength === 3) {

        strengthBar.style.width = "75%";
        strengthText.textContent = "Strong password";

    } else {

        strengthBar.style.width = "100%";
        strengthText.textContent = "Very strong password";

    }

});


/* ================= SHA-256 PASSWORD HASH ================= */

async function hashPassword(password) {

    const data = new TextEncoder().encode(password);

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        data
    );

    const hashArray = Array.from(
        new Uint8Array(hashBuffer)
    );

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


/* ================= REGISTER ================= */

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const username =
        document.getElementById("registerUsername").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim().toLowerCase();

    const password =
        registerPassword.value;


    /* Validation */

    if (!username || !email || !password) {

        showMessage(
            registerMessage,
            "Please fill all fields.",
            "error"
        );

        return;
    }


    if (password.length < 8 || !/\d/.test(password)) {

        showMessage(
            registerMessage,
            "Password must contain 8 characters and at least 1 number.",
            "error"
        );

        return;
    }


    const users =
        JSON.parse(localStorage.getItem("secureVaultUsers")) || [];


    /* Duplicate Check */

    const existingUser = users.find(user =>
        user.username.toLowerCase() === username.toLowerCase() ||
        user.email.toLowerCase() === email
    );


    if (existingUser) {

        showMessage(
            registerMessage,
            "Username or email already exists.",
            "error"
        );

        return;
    }


    /* Hash Password */

    const hashedPassword =
        await hashPassword(password);


    const newUser = {

        username: username,
        email: email,
        password: hashedPassword,

        createdAt: new Date().toISOString()

    };


    users.push(newUser);


    localStorage.setItem(
        "secureVaultUsers",
        JSON.stringify(users)
    );


    showMessage(
        registerMessage,
        "Account created successfully! 🎉",
        "success"
    );


    registerForm.reset();

    strengthBar.style.width = "0%";
    strengthText.textContent = "Password strength";


    /* Automatically switch to Login */

    setTimeout(() => {

        loginTab.click();

        document.getElementById("loginUsername").value =
            username;

    }, 1200);

});


/* ================= LOGIN ================= */

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const usernameOrEmail =
        document
            .getElementById("loginUsername")
            .value
            .trim()
            .toLowerCase();

    const password =
        document.getElementById("loginPassword").value;


    if (!usernameOrEmail || !password) {

        showMessage(
            loginMessage,
            "Please enter username/email and password.",
            "error"
        );

        return;
    }


    const users =
        JSON.parse(localStorage.getItem("secureVaultUsers")) || [];


    const user = users.find(account =>
        account.username.toLowerCase() === usernameOrEmail ||
        account.email.toLowerCase() === usernameOrEmail
    );


    if (!user) {

        showMessage(
            loginMessage,
            "Account not found.",
            "error"
        );

        return;
    }


    const hashedPassword =
        await hashPassword(password);


    if (hashedPassword !== user.password) {

        showMessage(
            loginMessage,
            "Incorrect password.",
            "error"
        );

        return;
    }


    /* Login Success */

    localStorage.setItem(
        "secureVaultSession",
        JSON.stringify({
            username: user.username,
            email: user.email,
            loginTime: new Date().toISOString()
        })
    );


    showMessage(
        loginMessage,
        `Login successful! Welcome, ${user.username} 👋`,
        "success"
    );


    setTimeout(() => {

        window.location.href = "dashboard.html";

    }, 1000);

});


/* ================= MESSAGE ================= */

function showMessage(element, message, type) {

    element.textContent = message;
    element.className = `message ${type}`;

}
