
    const form = document.getElementById("loginForm");
    const message = document.getElementById("message");

    const USERNAME = "admin";
    const PASSWORD = "1234";

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const user = document.getElementById("username").value;
      const pass = document.getElementById("password").value;

      if (user === USERNAME && pass === PASSWORD) {
        message.textContent = "Login Successful!";
        message.className = "success";
        setTimeout(() => {
          alert("Welcome, " + user + "!");
          window.location.href = "index.html";
          
        }, 1000);
      } else {
        message.textContent = "Incorrect username or password!";
        message.className = "error";
      }
    });
