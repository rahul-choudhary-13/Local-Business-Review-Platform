// Authentication functionality
document.addEventListener("DOMContentLoaded", () => {
  // Login form submission
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const remember = document.getElementById("remember")?.checked || false

      // Create form data
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)
      formData.append("remember", remember)

      // Show loading state
      const submitBtn = loginForm.querySelector("button[type='submit']")
      const originalBtnText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...'
      submitBtn.disabled = true

      // Send login request
      fetch("php/login.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // Reset button
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false

          // Show message
          const messageContainer = document.getElementById("login-message")
          if (messageContainer) {
            messageContainer.classList.remove("hidden", "success", "error")

            if (data.success) {
              messageContainer.classList.add("success")
              messageContainer.innerHTML = `<i class="fas fa-check-circle"></i> ${data.message}`

              // Redirect after successful login
              setTimeout(() => {
                window.location.href = data.redirect || "index.html"
              }, 1500)
            } else {
              messageContainer.classList.add("error")
              messageContainer.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${data.message}`
            }
          }
        })
        .catch((error) => {
          console.error("Login error:", error)

          // Reset button
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false

          // Show error message
          const messageContainer = document.getElementById("login-message")
          if (messageContainer) {
            messageContainer.classList.remove("hidden", "success")
            messageContainer.classList.add("error")
            messageContainer.innerHTML =
              '<i class="fas fa-exclamation-circle"></i> An error occurred. Please try again later.'
          }
        })
    })
  }

  // User registration form submission
  const userRegisterForm = document.getElementById("user-register-form")
  if (userRegisterForm) {
    userRegisterForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Validate passwords match
      const password = document.getElementById("user-password").value
      const confirmPassword = document.getElementById("user-confirm-password").value

      if (password !== confirmPassword) {
        const messageContainer = document.getElementById("register-message")
        if (messageContainer) {
          messageContainer.classList.remove("hidden", "success")
          messageContainer.classList.add("error")
          messageContainer.innerHTML = '<i class="fas fa-exclamation-circle"></i> Passwords do not match.'
        }
        return
      }

      // Create form data from all form fields
      const formData = new FormData(userRegisterForm)

      // Show loading state
      const submitBtn = userRegisterForm.querySelector("button[type='submit']")
      const originalBtnText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...'
      submitBtn.disabled = true

      // Send registration request
      fetch("php/register.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // Reset button
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false

          // Show message
          const messageContainer = document.getElementById("register-message")
          if (messageContainer) {
            messageContainer.classList.remove("hidden", "success", "error")

            if (data.success) {
              messageContainer.classList.add("success")
              messageContainer.innerHTML = `<i class="fas fa-check-circle"></i> ${data.message}`

              // Redirect after successful registration
              setTimeout(() => {
                window.location.href = data.redirect || "login.html"
              }, 2000)
            } else {
              messageContainer.classList.add("error")
              messageContainer.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${data.message}`
            }
          }
        })
        .catch((error) => {
          console.error("Registration error:", error)

          // Reset button
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false

          // Show error message
          const messageContainer = document.getElementById("register-message")
          if (messageContainer) {
            messageContainer.classList.remove("hidden", "success")
            messageContainer.classList.add("error")
            messageContainer.innerHTML =
              '<i class="fas fa-exclamation-circle"></i> An error occurred. Please try again later.'
          }
        })
    })
  }

  // Business registration form submission
  const businessRegisterForm = document.getElementById("business-register-form")
  if (businessRegisterForm) {
    businessRegisterForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Validate passwords match
      const password = document.getElementById("business-password").value
      const confirmPassword = document.getElementById("business-confirm-password").value

      if (password !== confirmPassword) {
        const messageContainer = document.getElementById("register-message")
        if (messageContainer) {
          messageContainer.classList.remove("hidden", "success")
          messageContainer.classList.add("error")
          messageContainer.innerHTML = '<i class="fas fa-exclamation-circle"></i> Passwords do not match.'
        }
        return
      }

      // Create form data from all form fields
      const formData = new FormData(businessRegisterForm)

      // Show loading state
      const submitBtn = businessRegisterForm.querySelector("button[type='submit']")
      const originalBtnText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering business...'
      submitBtn.disabled = true

      // Send registration request
      fetch("php/register.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // Reset button
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false

          // Show message
          const messageContainer = document.getElementById("register-message")
          if (messageContainer) {
            messageContainer.classList.remove("hidden", "success", "error")

            if (data.success) {
              messageContainer.classList.add("success")
              messageContainer.innerHTML = `<i class="fas fa-check-circle"></i> ${data.message}`

              // Redirect after successful registration
              setTimeout(() => {
                window.location.href = data.redirect || "login.html"
              }, 2000)
            } else {
              messageContainer.classList.add("error")
              messageContainer.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${data.message}`
            }
          }
        })
        .catch((error) => {
          console.error("Business registration error:", error)

          // Reset button
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false

          // Show error message
          const messageContainer = document.getElementById("register-message")
          if (messageContainer) {
            messageContainer.classList.remove("hidden", "success")
            messageContainer.classList.add("error")
            messageContainer.innerHTML =
              '<i class="fas fa-exclamation-circle"></i> An error occurred. Please try again later.'
          }
        })
    })
  }
})
