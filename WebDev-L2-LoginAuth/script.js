// ===============================
// SecureVault Authentication
// Task 4 - OIBSIP
// ===============================

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");

const switchText = document.getElementById("switchText");
const switchBtn = document.getElementById("switchBtn");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");

const loginPassword = document.getElementById("loginPassword");
const registerPassword = document.getElementById("registerPassword");

const confirmPassword = document.getElementById("confirmPassword");

const loginEye = document.getElementById("loginEye");
const registerEye = document.getElementById("registerEye");

const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");


// ===============================
// SHA-256 Password Hashing
// ===============================

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


// ===============================
// Switch Login / Register
// ===============================

switchBtn.addEventListener("click", () => {

    loginMessage.textContent = "";
    registerMessage.textContent = "";

    if (loginForm.classList.contains("hidden")) {

        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");

        formTitle.textContent = "Welcome Back";
        formSubtitle.textContent =
            "Login to access your secure dashboard.";

        switchText.textContent =
            "Don't have an account?";

        switchBtn.textContent =
            "Create Account";

    } else {

        loginForm.classList.add("hidden");
        registerForm.classList.remove("hidden");

        formTitle.textContent = "Create Account";
        formSubtitle.textContent =
            "Register to create your secure account.";

        switchText.textContent =
            "Already have an account?";

        switchBtn.textContent =
            "Login";

    }

});


// ===============================
// Show / Hide Password
// ===============================

loginEye.addEventListener("click", () => {

    if (loginPassword.type === "password") {

        loginPassword.type = "text";
        loginEye.textContent = "🙈";

    } else {

        loginPassword.type = "password";
        loginEye.textContent = "👁️";

    }

});


registerEye.addEventListener("click", () => {

    if (registerPassword.type === "password") {

        registerPassword.type = "text";
        registerEye.textContent = "🙈";

    } else {

        registerPassword.type = "password";
        registerEye.textContent = "👁️";

    }

});


// ===============================
// Password Strength
// ===============================

registerPassword.addEventListener("input", () => {

    const password = registerPassword.value;

    let strength = 0;

    if (password.length >= 8) {
        strength++;
    }

    if (/[0-9]/.test(password)) {
        strength++;
    }

    if (/[A-Z]/.test(password)) {
        strength++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        strength++;
    }

    const percentage = strength * 25;

    strengthFill.style.width =
        percentage + "%";

    if (password.length === 0) {

        strengthText.textContent =
            "Password strength";

    } else if (strength <= 1) {

        strengthText.textContent =
            "Weak password";

        strengthFill.style.background =
            "#ff5f6d";

    } else if (strength === 2) {

        strengthText.textContent =
            "Medium password";

        strengthFill.style.background =
            "#ffc857";

    } else if (strength === 3) {

        strengthText.textContent =
            "Good password";

        strengthFill.style.background =
            "#55d187";

    } else {

        strengthText.textContent =
            "Strong password";

        strengthFill.style.background =
            "#35d49a";

    }

});


// ===============================
// Register
// ===============================

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    registerMessage.className = "message";

    const username =
        document.getElementById("registerUsername").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        registerPassword.value;

    const confirm =
        confirmPassword.value;


    // Basic validation

    if (!username || !email || !password || !confirm) {

        showMessage(
            registerMessage,
            "Please fill all fields.",
            "error"
        );

        return;
    }


    // Password validation

    if (password.length < 8) {

        showMessage(
            registerMessage,
            "Password must contain at least 8 characters.",
            "error"
        );

        return;
    }


    if (!/[0-9]/.test(password)) {

        showMessage(
            registerMessage,
            "Password must contain at least one number.",
            "error"
        );

        return;
    }


    // Confirm password

    if (password !== confirm) {

        showMessage(
            registerMessage,
            "Passwords do not match.",
            "error"
        );

        return;
    }


    // Get existing users

    const users =
        JSON.parse(localStorage.getItem("secureVaultUsers")) || [];


    // Duplicate check

    const existingUser = users.find(user =>
        user.username.toLowerCase() === username.toLowerCase() ||
        user.email.toLowerCase() === email.toLowerCase()
    );


    if (existingUser) {

        showMessage(
            registerMessage,
            "Username or email already exists.",
            "error"
        );

        return;
    }


    // Hash password

    const passwordHash =
        await hashPassword(password);


    // Create user

    const newUser = {

        username: username,

        email: email,

        passwordHash: passwordHash,

        createdAt: new Date().toISOString()

    };


    users.push(newUser);


    localStorage.setItem(
        "secureVaultUsers",
        JSON.stringify(users)
    );


    showMessage(
        registerMessage,
        "Account created successfully! You can now login.",
        "success"
    );


    // Clear form

    registerForm.reset();

    strengthFill.style.width = "0%";

    strengthText.textContent =
        "Password strength";


    // Switch to login after short delay

    setTimeout(() => {

        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");

        formTitle.textContent =
            "Welcome Back";

        formSubtitle.textContent =
            "Login to access your secure dashboard.";

        switchText.textContent =
            "Don't have an account?";

        switchBtn.textContent =
            "Create Account";

    }, 1200);

});


// ===============================
// Login
// ===============================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    loginMessage.className = "message";

    const identifier =
        document.getElementById("loginUsername").value.trim();

    const password =
        loginPassword.value;


    if (!identifier || !password) {

        showMessage(
            loginMessage,
            "Please enter your username/email and password.",
            "error"
        );

        return;
    }


    // Get users

    const users =
        JSON.parse(localStorage.getItem("secureVaultUsers")) || [];


    // Find user

    const user = users.find(item =>
        item.username.toLowerCase() === identifier.toLowerCase() ||
        item.email.toLowerCase() === identifier.toLowerCase()
    );


    // Generic error message
    // Does not reveal which field is incorrect

    if (!user) {

        showMessage(
            loginMessage,
            "Invalid username/email or password.",
            "error"
        );

        return;
    }


    // Hash entered password

    const enteredHash =
        await hashPassword(password);


    if (enteredHash !== user.passwordHash) {

        showMessage(
            loginMessage,
            "Invalid username/email or password.",
            "error"
        );

        return;
    }


    // Create session

    sessionStorage.setItem(
        "secureVaultSession",
        JSON.stringify({
            username: user.username,
            email: user.email
        })
    );


    // Open dashboard

    showDashboard(user);

});


// ===============================
// Dashboard
// ===============================

function showDashboard(user) {

    document.body.innerHTML = `

        <div class="dashboard-page">

            <nav class="dashboard-nav">

                <div class="dashboard-logo">
                    🔐 Secure<span>Vault</span>
                </div>

                <button id="logoutBtn">
                    Logout ↪
                </button>

            </nav>


            <main class="dashboard-content">

                <div class="welcome-card">

                    <div class="dashboard-icon">
                        🛡️
                    </div>

                    <p class="dashboard-label">
                        AUTHENTICATION SUCCESSFUL
                    </p>

                    <h1>
                        Welcome, ${escapeHTML(user.username)} 👋
                    </h1>

                    <p class="dashboard-description">
                        You have successfully logged into
                        your protected SecureVault dashboard.
                    </p>

                </div>


                <div class="dashboard-grid">

                    <div class="info-card">

                        <span>👤</span>

                        <div>
                            <small>USERNAME</small>
                            <strong>
                                ${escapeHTML(user.username)}
                            </strong>
                        </div>

                    </div>


                    <div class="info-card">

                        <span>✉️</span>

                        <div>
                            <small>EMAIL</small>
                            <strong>
                                ${escapeHTML(user.email)}
                            </strong>
                        </div>

                    </div>


                    <div class="info-card">

                        <span>🔒</span>

                        <div>
                            <small>SECURITY</small>
                            <strong>
                                Protected
                            </strong>
                        </div>

                    </div>

                </div>


                <div class="dashboard-footer">

                    <span>🟢</span>

                    Your session is active and secure.

                </div>

            </main>

        </div>

    `;


    // Dashboard styles

    addDashboardStyles();


    document
        .getElementById("logoutBtn")
        .addEventListener("click", logout);

}


// ===============================
// Logout
// ===============================

function logout() {

    sessionStorage.removeItem(
        "secureVaultSession"
    );

    location.reload();

}


// ===============================
// Check Existing Session
// ===============================

function checkSession() {

    const session =
        JSON.parse(
            sessionStorage.getItem(
                "secureVaultSession"
            )
        );


    if (session) {

        showDashboard(session);

    }

}


// ===============================
// Message Helper
// ===============================

function showMessage(element, text, type) {

    element.textContent = text;

    element.className =
        "message " + type;

}


// ===============================
// Prevent HTML Injection
// ===============================

function escapeHTML(value) {

    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ===============================
// Dashboard CSS
// ===============================

function addDashboardStyles() {

    const style =
        document.createElement("style");

    style.textContent = `

        .dashboard-page {
            min-height: 100vh;
            background:
                radial-gradient(
                    circle at 20% 20%,
                    rgba(108,99,255,.18),
                    transparent 30%
                ),
                radial-gradient(
                    circle at 80% 80%,
                    rgba(0,198,255,.12),
                    transparent 30%
                ),
                #080b18;
        }

        .dashboard-nav {
            height: 75px;
            padding: 0 7%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255,255,255,.08);
            background: rgba(8,11,24,.75);
            backdrop-filter: blur(20px);
        }

        .dashboard-logo {
            font-size: 22px;
            font-weight: 800;
        }

        .dashboard-logo span {
            color: #817aff;
        }

        #logoutBtn {
            border: 1px solid rgba(255,255,255,.12);
            background: rgba(255,255,255,.05);
            color: white;
            padding: 10px 18px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
        }

        #logoutBtn:hover {
            background: rgba(255,95,109,.15);
            border-color: rgba(255,95,109,.4);
        }

        .dashboard-content {
            width: 90%;
            max-width: 950px;
            margin: auto;
            padding: 70px 0;
        }

        .welcome-card {
            text-align: center;
            padding: 55px 30px;
            border: 1px solid rgba(255,255,255,.09);
            border-radius: 25px;
            background: rgba(18,23,43,.72);
            backdrop-filter: blur(25px);
            box-shadow: 0 30px 80px rgba(0,0,0,.35);
        }

        .dashboard-icon {
            width: 75px;
            height: 75px;
            margin: auto auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 22px;
            background: linear-gradient(
                135deg,
                #6c63ff,
                #817aff
            );
            font-size: 32px;
            box-shadow:
                0 15px 40px rgba(108,99,255,.35);
        }

        .dashboard-label {
            color: #35d49a;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 2px;
        }

        .welcome-card h1 {
            margin: 12px 0;
            font-size: 38px;
        }

        .dashboard-description {
            color: #9ca3b8;
            max-width: 550px;
            margin: auto;
            line-height: 1.7;
        }

        .dashboard-grid {
            display: grid;
            grid-template-columns:
                repeat(3, 1fr);
            gap: 18px;
            margin-top: 22px;
        }

        .info-card {
            padding: 22px;
            display: flex;
            align-items: center;
            gap: 15px;
            background: rgba(18,23,43,.72);
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 18px;
        }

        .info-card > span {
            font-size: 25px;
        }

        .info-card small {
            display: block;
            color: #687089;
            font-size: 10px;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }

        .info-card strong {
            font-size: 14px;
            word-break: break-word;
        }

        .dashboard-footer {
            text-align: center;
            color: #8d96ad;
            margin-top: 30px;
            font-size: 13px;
        }

        @media (max-width: 700px) {

            .dashboard-content {
                padding: 35px 0;
            }

            .welcome-card {
                padding: 40px 20px;
            }

            .welcome-card h1 {
                font-size: 28px;
            }

            .dashboard-grid {
                grid-template-columns: 1fr;
            }

            .dashboard-nav {
                padding: 0 5%;
            }

        }

    `;

    document.head.appendChild(style);

}


// ===============================
// Start Application
// ===============================

checkSession();
