/* =================================
   authFlow - Authentication System
================================= */

// ---------- Switch Login / Register ----------

function showRegister() {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("registerSection").classList.remove("hidden");

    document.getElementById("loginError").textContent = "";
}

function showLogin() {
    document.getElementById("registerSection").classList.add("hidden");
    document.getElementById("loginSection").classList.remove("hidden");

    document.getElementById("registerError").textContent = "";
}


// ---------- Password Show / Hide ----------

function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);

    if (input.type === "password") {
        input.type = "text";
        button.textContent = "🙈";
    } else {
        input.type = "password";
        button.textContent = "👁";
    }
}


// ---------- SHA-256 Password Hash ----------

async function hashPassword(password) {

    const encoder = new TextEncoder();

    const data = encoder.encode(password);

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


// ---------- Registration ----------

document
    .getElementById("registerForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const username =
            document.getElementById("registerUsername").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const error =
            document.getElementById("registerError");


        // Basic validation

        if (!username || !email || !password || !confirmPassword) {
            error.textContent = "Please fill all fields.";
            return;
        }


        // Password length

        if (password.length < 8) {
            error.textContent =
                "Password must be at least 8 characters.";
            return;
        }


        // Password must contain a number

        if (!/[0-9]/.test(password)) {
            error.textContent =
                "Password must contain at least 1 number.";
            return;
        }


        // Confirm password

        if (password !== confirmPassword) {
            error.textContent =
                "Passwords do not match.";
            return;
        }


        // Check existing user

        const existingUser =
            JSON.parse(localStorage.getItem("authUser"));

        if (
            existingUser &&
            (
                existingUser.username.toLowerCase() ===
                username.toLowerCase() ||

                existingUser.email.toLowerCase() ===
                email.toLowerCase()
            )
        ) {
            error.textContent =
                "Username or email already exists.";
            return;
        }


        // Hash password

        const passwordHash =
            await hashPassword(password);


        // Save user

        const user = {
            username: username,
            email: email,
            passwordHash: passwordHash
        };

        localStorage.setItem(
            "authUser",
            JSON.stringify(user)
        );


        // Success

        alert("Account created successfully! Please login.");

        document.getElementById("registerForm").reset();

        showLogin();
    });


// ---------- Login ----------

document
    .getElementById("loginForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const loginUser =
            document.getElementById("loginUser").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const error =
            document.getElementById("loginError");


        if (!loginUser || !password) {
            error.textContent =
                "Please enter username/email and password.";
            return;
        }


        // Get registered user

        const savedUser =
            JSON.parse(localStorage.getItem("authUser"));


        if (!savedUser) {
            error.textContent =
                "No account found. Please create an account first.";
            return;
        }


        // Hash entered password

        const passwordHash =
            await hashPassword(password);


        // Check credentials

        const userMatches =
            savedUser.username.toLowerCase() ===
            loginUser.toLowerCase();

        const emailMatches =
            savedUser.email.toLowerCase() ===
            loginUser.toLowerCase();

        const passwordMatches =
            savedUser.passwordHash === passwordHash;


        if ((userMatches || emailMatches) && passwordMatches) {

            // Create login session

            const session = {
                username: savedUser.username,
                email: savedUser.email,
                loggedIn: true
            };

            localStorage.setItem(
                "authSession",
                JSON.stringify(session)
            );


            // Go to protected dashboard

            window.location.href = "dashboard.html";

        } else {

            error.textContent =
                "Invalid username/email or password.";
        }
    });
