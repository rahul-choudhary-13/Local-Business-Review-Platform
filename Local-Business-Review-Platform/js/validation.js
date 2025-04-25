// Form validation for the review submission form
document.addEventListener("DOMContentLoaded", () => {
  const reviewForm = document.getElementById("review-form")

  if (!reviewForm) return

  // Validate form on submit
  reviewForm.addEventListener("submit", (e) => {
    let isValid = true

    // Get form fields
    const nameInput = document.getElementById("reviewer-name")
    const emailInput = document.getElementById("reviewer-email")
    const ratingInputs = document.querySelectorAll('input[name="rating"]')
    const titleInput = document.getElementById("review-title")
    const contentInput = document.getElementById("review-content")

    // Clear previous error messages
    const errorMessages = document.querySelectorAll(".error-message")
    errorMessages.forEach((message) => message.remove())

    // Validate name (required, at least 2 characters)
    if (!nameInput.value || nameInput.value.trim().length < 2) {
      showError(nameInput, "Please enter your name (at least 2 characters)")
      isValid = false
    }

    // Validate email (required, valid format)
    if (!emailInput.value || !isValidEmail(emailInput.value)) {
      showError(emailInput, "Please enter a valid email address")
      isValid = false
    }

    // Validate rating (required)
    let ratingSelected = false
    ratingInputs.forEach((input) => {
      if (input.checked) {
        ratingSelected = true
      }
    })

    if (!ratingSelected) {
      const ratingContainer = document.querySelector(".rating-input")
      showError(ratingContainer, "Please select a rating")
      isValid = false
    }

    // Validate title (required, at least 5 characters)
    if (!titleInput.value || titleInput.value.trim().length < 5) {
      showError(titleInput, "Please enter a review title (at least 5 characters)")
      isValid = false
    }

    // Validate content (required, at least 10 characters)
    if (!contentInput.value || contentInput.value.trim().length < 10) {
      showError(contentInput, "Please enter your review (at least 10 characters)")
      isValid = false
    }

    // Prevent form submission if validation fails
    if (!isValid) {
      e.preventDefault()
    }
  })

  // Helper function to show error message
  function showError(element, message) {
    const errorElement = document.createElement("div")
    errorElement.className = "error-message"
    errorElement.style.color = "red"
    errorElement.style.fontSize = "14px"
    errorElement.style.marginTop = "5px"
    errorElement.textContent = message

    element.parentNode.appendChild(errorElement)
    element.style.borderColor = "red"

    // Remove error styling on input
    element.addEventListener("input", () => {
      element.style.borderColor = ""
      const error = element.parentNode.querySelector(".error-message")
      if (error) {
        error.remove()
      }
    })
  }

  // Helper function to validate email format
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
})
