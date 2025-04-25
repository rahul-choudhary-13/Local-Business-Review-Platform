// Admin dashboard functionality
document.addEventListener("DOMContentLoaded", () => {
  // Tab switching
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")

      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Add active class to current button and content
      this.classList.add("active")
      document.getElementById(tabId).classList.add("active")

      // Load data for the active tab
      if (tabId === "pending-reviews") {
        loadPendingReviews()
      } else if (tabId === "all-reviews") {
        loadAllReviews()
      } else if (tabId === "businesses") {
        loadBusinesses()
      }
    })
  })

  // Load pending reviews by default
  loadPendingReviews()

  // Modal functionality
  const modal = document.getElementById("review-modal")
  const closeBtn = document.querySelector(".close")

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none"
    })
  }

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none"
    }
  })
})

// Load pending reviews
function loadPendingReviews() {
  const table = document.getElementById("pending-reviews-table")
  if (!table) return

  const tbody = table.querySelector("tbody")
  tbody.innerHTML = '<tr><td colspan="7" class="loading-cell">Loading pending reviews...</td></tr>'

  fetch("../api/admin.php?pending_reviews=true")
    .then((response) => response.json())
    .then((reviews) => {
      if (reviews.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading-cell">No pending reviews found.</td></tr>'
        return
      }

      let html = ""
      reviews.forEach((review) => {
        html += `
                    <tr>
                        <td>${review.id}</td>
                        <td>${review.business_name}</td>
                        <td>${review.reviewer_name}</td>
                        <td>${review.rating} ★</td>
                        <td>${review.title}</td>
                        <td>${formatDate(review.date)}</td>
                        <td>
                            <button class="action-btn view-btn" data-id="${review.id}" data-action="view">View</button>
                            <button class="action-btn approve-btn" data-id="${review.id}" data-action="approve">Approve</button>
                            <button class="action-btn reject-btn" data-id="${review.id}" data-action="reject">Reject</button>
                        </td>
                    </tr>
                `
      })

      tbody.innerHTML = html

      // Add event listeners to action buttons
      const actionButtons = tbody.querySelectorAll(".action-btn")
      actionButtons.forEach((button) => {
        button.addEventListener("click", handleReviewAction)
      })
    })
    .catch((error) => {
      console.error("Error loading pending reviews:", error)
      tbody.innerHTML = '<tr><td colspan="7" class="loading-cell">Error loading reviews. Please try again.</td></tr>'
    })
}

// Load all reviews
function loadAllReviews() {
  const table = document.getElementById("all-reviews-table")
  if (!table) return

  const tbody = table.querySelector("tbody")
  tbody.innerHTML = '<tr><td colspan="8" class="loading-cell">Loading all reviews...</td></tr>'

  fetch("../api/admin.php?all_reviews=true")
    .then((response) => response.json())
    .then((reviews) => {
      if (reviews.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="loading-cell">No reviews found.</td></tr>'
        return
      }

      let html = ""
      reviews.forEach((review) => {
        html += `
                    <tr>
                        <td>${review.id}</td>
                        <td>${review.business_name}</td>
                        <td>${review.reviewer_name}</td>
                        <td>${review.rating} ★</td>
                        <td>${review.title}</td>
                        <td>${review.approved ? '<span style="color: green;">Approved</span>' : '<span style="color: orange;">Pending</span>'}</td>
                        <td>${formatDate(review.date)}</td>
                        <td>
                            <button class="action-btn view-btn" data-id="${review.id}" data-action="view">View</button>
                            ${
                              !review.approved
                                ? `
                                <button class="action-btn approve-btn" data-id="${review.id}" data-action="approve">Approve</button>
                                <button class="action-btn reject-btn" data-id="${review.id}" data-action="reject">Reject</button>
                            `
                                : `
                                <button class="action-btn reject-btn" data-id="${review.id}" data-action="delete">Delete</button>
                            `
                            }
                        </td>
                    </tr>
                `
      })

      tbody.innerHTML = html

      // Add event listeners to action buttons
      const actionButtons = tbody.querySelectorAll(".action-btn")
      actionButtons.forEach((button) => {
        button.addEventListener("click", handleReviewAction)
      })
    })
    .catch((error) => {
      console.error("Error loading all reviews:", error)
      tbody.innerHTML = '<tr><td colspan="8" class="loading-cell">Error loading reviews. Please try again.</td></tr>'
    })
}

// Load businesses
function loadBusinesses() {
  const table = document.getElementById("businesses-table")
  if (!table) return

  const tbody = table.querySelector("tbody")
  tbody.innerHTML = '<tr><td colspan="7" class="loading-cell">Loading businesses...</td></tr>'

  fetch("../api/admin.php?businesses=true")
    .then((response) => response.json())
    .then((businesses) => {
      if (businesses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading-cell">No businesses found.</td></tr>'
        return
      }

      let html = ""
      businesses.forEach((business) => {
        html += `
                    <tr>
                        <td>${business.id}</td>
                        <td>${business.name}</td>
                        <td>${business.category}</td>
                        <td>${business.location}</td>
                        <td>${business.average_rating.toFixed(1)} ★</td>
                        <td>${business.review_count}</td>
                        <td>
                            <a href="../business-detail.html?id=${business.id}" target="_blank" class="action-btn view-btn">View</a>
                        </td>
                    </tr>
                `
      })

      tbody.innerHTML = html
    })
    .catch((error) => {
      console.error("Error loading businesses:", error)
      tbody.innerHTML = '<tr><td colspan="7" class="loading-cell">Error loading businesses. Please try again.</td></tr>'
    })
}

// Handle review actions (view, approve, reject, delete)
function handleReviewAction(event) {
  const button = event.target
  const reviewId = button.getAttribute("data-id")
  const action = button.getAttribute("data-action")

  if (action === "view") {
    viewReview(reviewId)
  } else if (action === "approve") {
    approveReview(reviewId)
  } else if (action === "reject" || action === "delete") {
    rejectReview(reviewId)
  }
}

// View review details
function viewReview(reviewId) {
  const modal = document.getElementById("review-modal")
  const modalContent = document.getElementById("review-detail-content")
  const modalActions = document.getElementById("review-modal-actions")

  if (!modal || !modalContent || !modalActions) return

  modalContent.innerHTML = "<p>Loading review details...</p>"
  modalActions.innerHTML = ""

  // Get all reviews
  fetch("../api/admin.php?all_reviews=true")
    .then((response) => response.json())
    .then((reviews) => {
      const review = reviews.find((r) => r.id === reviewId)

      if (!review) {
        modalContent.innerHTML = "<p>Review not found.</p>"
        return
      }

      modalContent.innerHTML = `
                <div class="review-detail">
                    <div class="review-detail-header">
                        <h4>Review #${review.id}</h4>
                        <p><strong>Status:</strong> ${review.approved ? '<span style="color: green;">Approved</span>' : '<span style="color: orange;">Pending</span>'}</p>
                    </div>
                    <div class="review-detail-info">
                        <p><strong>Business:</strong> ${review.business_name}</p>
                        <p><strong>Reviewer:</strong> ${review.reviewer_name}</p>
                        <p><strong>Email:</strong> ${review.reviewer_email}</p>
                        <p><strong>Date:</strong> ${formatDate(review.date)}</p>
                        <p><strong>Rating:</strong> ${review.rating} ★</p>
                    </div>
                    <div class="review-detail-content">
                        <h5>${review.title}</h5>
                        <p>${review.content}</p>
                    </div>
                </div>
            `

      if (!review.approved) {
        modalActions.innerHTML = `
                    <button class="action-btn approve-btn" data-id="${review.id}" data-action="approve">Approve</button>
                    <button class="action-btn reject-btn" data-id="${review.id}" data-action="reject">Reject</button>
                `
      } else {
        modalActions.innerHTML = `
                    <button class="action-btn reject-btn" data-id="${review.id}" data-action="delete">Delete</button>
                `
      }

      // Add event listeners to action buttons
      const actionButtons = modalActions.querySelectorAll(".action-btn")
      actionButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const action = this.getAttribute("data-action")

          if (action === "approve") {
            approveReview(reviewId)
          } else if (action === "reject" || action === "delete") {
            rejectReview(reviewId)
          }

          modal.style.display = "none"
        })
      })

      modal.style.display = "block"
    })
    .catch((error) => {
      console.error("Error loading review details:", error)
      modalContent.innerHTML = "<p>Error loading review details. Please try again.</p>"
    })
}

// Approve a review
function approveReview(reviewId) {
  if (!confirm("Are you sure you want to approve this review?")) {
    return
  }

  fetch("../api/admin.php?approve_review=true", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: reviewId }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        alert("Review approved successfully!")

        // Reload the current active tab
        const activeTab = document.querySelector(".tab-btn.active")
        if (activeTab) {
          activeTab.click()
        }
      } else {
        alert("Error: " + result.message)
      }
    })
    .catch((error) => {
      console.error("Error approving review:", error)
      alert("Error approving review. Please try again.")
    })
}

// Reject/delete a review
function rejectReview(reviewId) {
  if (!confirm("Are you sure you want to reject/delete this review? This action cannot be undone.")) {
    return
  }

  fetch("../api/admin.php?reject_review=true", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: reviewId }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        alert("Review rejected/deleted successfully!")

        // Reload the current active tab
        const activeTab = document.querySelector(".tab-btn.active")
        if (activeTab) {
          activeTab.click()
        }
      } else {
        alert("Error: " + result.message)
      }
    })
    .catch((error) => {
      console.error("Error rejecting/deleting review:", error)
      alert("Error rejecting/deleting review. Please try again.")
    })
}

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
