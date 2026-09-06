async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorEl = document.getElementById("error");
  errorEl.textContent = "";

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      // Simple bearer token stored for this browser session; sent as the
      // Authorization header on subsequent requests to /responses etc.
      sessionStorage.setItem("authToken", "authenticated");
      window.location.href = "/responses.html";
    } else {
      errorEl.textContent = "Incorrect username or password.";
    }
  } catch (err) {
    errorEl.textContent = "Login failed. Please try again.";
  }
}
