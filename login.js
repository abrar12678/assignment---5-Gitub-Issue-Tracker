document.getElementById("login-btn").addEventListener("click", function () {
    const usernameInput = document.getElementById("input-username");
    const username = usernameInput.value.trim().toLowerCase();

    const passwordInput = document.getElementById("input-password");
    const password = passwordInput.value.trim().toLowerCase();
    
    if (username === "admin" && password === "admin123") {
        window.location.href = "home-page.html";
    } else {
        alert("Invalid username or password. Please try again.");
    }
});