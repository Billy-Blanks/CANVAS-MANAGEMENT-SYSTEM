document.addEventListener("DOMContentLoaded", function () {
  // Form submission handling
  const loginForm = document.querySelector(".login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const userType = document.getElementById("user-type").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // Create a FormData object for multipart/form-data submission
      const formData = new FormData();

      // Append all form fields to the FormData object
      formData.append("userType", userType);
      formData.append("email", email);
      formData.append("password", password);

      // This would be replaced with actual authentication logic
      fetch("http://localhost:3000/login", {
        method: "POST",
        body: formData,
      })
        .then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.error || "Server responded with an error"
            );
          }
          return response.json(); // or .text() if server sends plain text
        })
        .then((data) => {
          if (data.error) {
            alert("Error during registration: " + data.error);
            return;
          }
          console.log("Login successful:", data);
          loginForm.reset();
          alert("Login successful! Redirecting to dashboard...");
          setTimeout(() => {
            const name = `${data.firstName} ${data.lastName}`;
            // Encode the name for safe URL usage
            const encodedName = encodeURIComponent(name);
            if (userType === "tenant") {
              // Redirect with query parameter
              window.location.href = "tenant.html?name=" + encodedName;
            } else {
              // Redirect with query parameter
              window.location.href = "dashboard.html?name=" + encodedName;
            }
          }, 2000); // 2 seconds delay for demonstration
        })
        .catch((error) => {
          console.error("Registration error:", error);
          alert("Error during registration: " + error.message);
        });
      // In a real application, you would authenticate and redirect to the appropriate dashboard
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      if (!targetId) return; // Skip if href is just "#"

      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70, // Adjust for header height
          behavior: "smooth",
        });
      }
    });
  });

  // Add mobile navigation toggle functionality
  // This would be expanded in a real project with a mobile menu button
  const mobileBreakpoint = 768;

  function checkScreenSize() {
    if (window.innerWidth <= mobileBreakpoint) {
      // Add mobile navigation logic here if needed
    } else {
      // Reset any mobile navigation states
    }
  }

  // Check on load and resize
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});
