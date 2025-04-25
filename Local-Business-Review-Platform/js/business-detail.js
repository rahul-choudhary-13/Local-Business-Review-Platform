// Business detail page functionality
document.addEventListener("DOMContentLoaded", () => {
  // Get business ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const businessId = urlParams.get("id")

  if (!businessId) {
    window.location.href = "business-listing.html"
    return
  }

  // Load business details
  loadBusinessDetails(businessId)

  // Load business reviews
  loadBusinessReviews(businessId)

  // Load related businesses
  loadRelatedBusinesses(businessId)

  // Setup review form
  setupReviewForm(businessId)
})

// Helper function to generate star rating HTML
function generateStars(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating - fullStars >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  let starsHTML = ""

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>'
  }

  // Add half star if applicable
  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>'
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>'
  }

  return starsHTML
}

// Helper function to get initials from a name
function getInitials(name) {
  const nameParts = name.split(" ")
  let initials = ""
  for (let i = 0; i < nameParts.length; i++) {
    initials += nameParts[i].charAt(0).toUpperCase()
  }
  return initials
}

// Helper function to format a date
function formatDate(dateString) {
  const date = new Date(dateString)
  const options = { year: "numeric", month: "long", day: "numeric" }
  return date.toLocaleDateString(undefined, options)
}

// Load business details
function loadBusinessDetails(businessId) {
  const container = document.getElementById("business-detail-container")
  if (!container) return

  container.innerHTML = '<div class="loading">Loading business details...</div>'

  fetch(`php/api/businesses.php?id=${businessId}`)
    .then((response) => response.json())
    .then((business) => {
      document.title = `${business.name} - LocalReviews`

      // Business hero section
      const html = `
        <div class="business-detail-container">
          <div class="business-hero" style="background-image: url('${business.image || "img/placeholder-business-large.jpg"}')">
            <div class="business-hero-overlay"></div>
            <div class="business-hero-content">
              <h1>${business.name}</h1>
              <div class="business-meta">
                <span><i class="fas fa-tag"></i> ${business.category}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${business.address}</span>
              </div>
              <div class="business-rating-large">
                <div class="stars">${generateStars(business.average_rating)}</div>
                <span>${business.average_rating.toFixed(1)} (${business.review_count} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      `

      container.innerHTML = html

      // Business description
      const descriptionContainer = document.getElementById("business-description")
      if (descriptionContainer) {
        descriptionContainer.innerHTML = `
          <h3>About ${business.name}</h3>
          <p>${business.description}</p>
        `
      }

      // Business hours
      const hoursContainer = document.getElementById("business-hours-list")
      if (hoursContainer && business.hours) {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        const today = new Date().getDay() // 0 is Sunday, 1 is Monday, etc.
        const todayIndex = today === 0 ? 6 : today - 1 // Convert to our array index

        let hoursHtml = ""
        days.forEach((day, index) => {
          const isToday = index === todayIndex
          const hours = business.hours[day.toLowerCase()] || "Closed"

          hoursHtml += `
            <li class="${isToday ? "today" : ""}">
              <span class="day">${day}${isToday ? " (Today)" : ""}</span>
              <span class="hours">${hours}</span>
            </li>
          `
        })

        hoursContainer.innerHTML = hoursHtml
      }

      // Business features
      const featuresContainer = document.getElementById("business-features-list")
      if (featuresContainer && business.features) {
        let featuresHtml = ""
        business.features.forEach((feature) => {
          featuresHtml += `
            <li><i class="fas fa-check-circle"></i> ${feature}</li>
          `
        })

        featuresContainer.innerHTML = featuresHtml
      }

      // Business photos
      const photosContainer = document.getElementById("business-photos")
      if (photosContainer && business.photos) {
        let photosHtml = ""
        business.photos.forEach((photo) => {
          photosHtml += `
            <div class="gallery-item">
              <img src="${photo}" alt="${business.name}">
            </div>
          `
        })

        photosContainer.innerHTML = photosHtml
      }

      // Business location
      const locationContainer = document.getElementById("location-details")
      if (locationContainer) {
        locationContainer.innerHTML = `
          <div class="location-details">
            <div class="location-detail">
              <i class="fas fa-map-marker-alt"></i>
              <div class="location-detail-content">
                <h4>Address</h4>
                <p>${business.address}</p>
              </div>
            </div>
            <div class="location-detail">
              <i class="fas fa-phone"></i>
              <div class="location-detail-content">
                <h4>Phone</h4>
                <p>${business.phone}</p>
              </div>
            </div>
            <div class="location-detail">
              <i class="fas fa-envelope"></i>
              <div class="location-detail-content">
                <h4>Email</h4>
                <p>${business.email}</p>
              </div>
            </div>
            ${
              business.website
                ? `
              <div class="location-detail">
                <i class="fas fa-globe"></i>
                <div class="location-detail-content">
                  <h4>Website</h4>
                  <p><a href="${business.website}" target="_blank">${business.website}</a></p>
                </div>
              </div>
            `
                : ""
            }
          </div>
        `
      }

      // Initialize Google Map
      const mapContainer = document.getElementById("map-container")
      if (mapContainer && business.latitude && business.longitude) {
        initMap(business)
      }
    })
    .catch((error) => {
      console.error("Error loading business details:", error)
      container.innerHTML = '<p class="error">Failed to load business details. Please try again later.</p>'
    })
}

// Initialize Google Map
function initMap(business) {
  const mapContainer = document.getElementById("map-container")
  if (!mapContainer) return

  // If Google Maps API is loaded
  if (window.google && window.google.maps) {
    const location = { lat: Number.parseFloat(business.latitude), lng: Number.parseFloat(business.longitude) }

    const map = new google.maps.Map(mapContainer, {
      center: location,
      zoom: 15,
      styles: [
        {
          featureType: "poi",
          elementType: "labels.text",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "poi.business",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "road",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          stylers: [{ visibility: "off" }],
        },
      ],
    })

    const marker = new google.maps.Marker({
      position: location,
      map: map,
      title: business.name,
      animation: google.maps.Animation.DROP,
    })

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 10px; max-width: 200px;">
          <h3 style="margin: 0 0 5px; color: #4a6fa5;">${business.name}</h3>
          <p style="margin: 0 0 5px;">${business.address}</p>
          <p style="margin: 0;"><a href="https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}" target="_blank" style="color: #4cb5ae; text-decoration: none;">Get Directions</a></p>
        </div>
      `,
    })

    marker.addListener("click", () => {
      infoWindow.open(map, marker)
    })

    // Open info window by default
    infoWindow.open(map, marker)
  } else {
    // If Google Maps API is not loaded
    mapContainer.innerHTML = `
      <div class="map-fallback">
        <p>Map could not be loaded. <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}" target="_blank">View on Google Maps</a></p>
      </div>
    `
  }
}

// Load business reviews
function loadBusinessReviews(businessId) {
  const reviewsContainer = document.getElementById("reviews-container")
  const averageRatingElement = document.getElementById("average-rating")
  const averageStarsElement = document.getElementById("average-stars")
  const reviewCountElement = document.getElementById("review-count")
  const ratingBreakdownElement = document.getElementById("rating-breakdown")

  if (!reviewsContainer) return

  reviewsContainer.innerHTML = '<div class="loading">Loading reviews...</div>'

  fetch(`php/api/reviews.php?business_id=${businessId}`)
    .then((response) => response.json())
    .then((data) => {
      // Update average rating and stars
      if (averageRatingElement) {
        averageRatingElement.textContent = data.average_rating.toFixed(1)
      }

      if (averageStarsElement) {
        averageStarsElement.innerHTML = generateStars(data.average_rating)
      }

      if (reviewCountElement) {
        reviewCountElement.textContent = `${data.reviews.length} ${data.reviews.length === 1 ? "review" : "reviews"}`
      }

      // Update rating breakdown
      if (ratingBreakdownElement) {
        let breakdownHtml = ""

        for (let i = 5; i >= 1; i--) {
          const count = data.rating_breakdown[i] || 0
          const percentage = data.reviews.length > 0 ? (count / data.reviews.length) * 100 : 0

          breakdownHtml += `
            <div class="rating-bar">
              <div class="rating-label">${i} stars</div>
              <div class="rating-progress">
                <div class="rating-progress-fill" style="width: ${percentage}%"></div>
              </div>
              <div class="rating-count">${count}</div>
            </div>
          `
        }

        ratingBreakdownElement.innerHTML = breakdownHtml
      }

      // Update reviews list
      if (data.reviews.length === 0) {
        reviewsContainer.innerHTML = `
          <div class="no-reviews">
            <i class="far fa-comment-alt"></i>
            <p>No reviews yet. Be the first to review!</p>
            <button id="be-first-review" class="btn btn-primary">Write a Review</button>
          </div>
        `

        const beFirstReviewBtn = document.getElementById("be-first-review")
        if (beFirstReviewBtn) {
          beFirstReviewBtn.addEventListener("click", () => {
            showReviewForm()
          })
        }

        return
      }

      let reviewsHtml = ""
      data.reviews.forEach((review) => {
        reviewsHtml += `
          <div class="review-card">
            <div class="review-header">
              <div class="reviewer-info">
                <div class="reviewer-avatar">${getInitials(review.reviewer_name)}</div>
                <div>
                  <div class="reviewer-name">${review.reviewer_name}</div>
                  <div class="review-date">${formatDate(review.date)}</div>
                </div>
              </div>
              <div class="review-rating">
                ${generateStars(review.rating)}
              </div>
            </div>
            <h4 class="review-title">${review.title}</h4>
            <p class="review-content">${review.content}</p>
          </div>
        `
      })

      reviewsContainer.innerHTML = reviewsHtml
    })
    .catch((error) => {
      console.error("Error loading business reviews:", error)
      reviewsContainer.innerHTML = '<p class="error">Failed to load reviews. Please try again later.</p>'
    })
}

// Load related businesses
function loadRelatedBusinesses(businessId) {
  const container = document.getElementById("related-businesses-container")
  if (!container) return

  fetch(`php/api/businesses.php?related=${businessId}`)
    .then((response) => response.json())
    .then((businesses) => {
      if (businesses.length === 0) {
        container.innerHTML = '<p class="no-results">No related businesses found.</p>'
        return
      }

      let html = ""
      businesses.forEach((business) => {
        html += `
          <div class="business-card stagger-item">
            <div class="business-image" style="background-image: url('${business.image || "img/placeholder-business.jpg"}')">
              <div class="business-category-tag">${business.category}</div>
            </div>
            <div class="business-info">
              <h3 class="business-name">${business.name}</h3>
              <div class="business-category">
                <i class="fas fa-tag"></i>
                <span>${business.category}</span>
              </div>
              <div class="business-rating">
                <div class="stars">${generateStars(business.average_rating)}</div>
                <span>${business.average_rating.toFixed(1)} (${business.review_count})</span>
              </div>
              <div class="business-address">
                <i class="fas fa-map-marker-alt"></i>
                <span>${business.address}</span>
              </div>
              <a href="business-detail.html?id=${business.id}" class="business-link">View Details <i class="fas fa-arrow-right"></i></a>
            </div>
          </div>
        `
      })

      container.innerHTML = html
    })
    .catch((error) => {
      console.error("Error loading related businesses:", error)
      container.innerHTML = '<p class="error">Failed to load related businesses. Please try again later.</p>'
    })
}

// Setup review form
function setupReviewForm(businessId) {
  const writeReviewBtn = document.getElementById("write-review-btn")
  const reviewFormContainer = document.getElementById("review-form-container")
  const reviewForm = document.getElementById("review-form")
  const cancelReviewBtn = document.getElementById("cancel-review")

  if (!writeReviewBtn || !reviewFormContainer || !reviewForm) return

  // Initially hide the review form
  reviewFormContainer.style.display = "none"

  // Show review form when "Write a Review" button is clicked
  writeReviewBtn.addEventListener("click", (e) => {
    e.preventDefault()
    showReviewForm()
  })

  // Hide review form when "Cancel" button is clicked
  if (cancelReviewBtn) {
    cancelReviewBtn.addEventListener("click", () => {
      reviewFormContainer.style.display = "none"
      // Reset form
      reviewForm.reset()
    })
  }

  // Handle form submission
  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = new FormData(reviewForm)
    formData.append("business_id", businessId)

    // Convert FormData to JSON
    const data = {}
    formData.forEach((value, key) => {
      data[key] = value
    })

    fetch(`php/api/reviews.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          // Show success message
          reviewFormContainer.innerHTML = `
            <div class="submission-success">
              <i class="fas fa-check-circle"></i>
              <h3>Thank you for your review!</h3>
              <p>Your review has been submitted and is pending approval by our administrators.</p>
              <p>Once approved, it will appear on the business page.</p>
              <button id="close-success" class="btn btn  it will appear on the business page.</p>
              <button id="close-success" class="btn btn-primary">Close</button>
            </div>
          `

          // Add event listener to close button
          const closeSuccessBtn = document.getElementById("close-success")
          if (closeSuccessBtn) {
            closeSuccessBtn.addEventListener("click", () => {
              reviewFormContainer.style.display = "none"
              // Reload reviews to show the new one (if it's auto-approved)
              loadBusinessReviews(businessId)
            })
          }
        } else {
          // Show error message
          reviewFormContainer.innerHTML = `
            <div class="submission-error">
              <i class="fas fa-exclamation-circle"></i>
              <h3>Error Submitting Review</h3>
              <p>${result.message || "There was an error submitting your review. Please try again later."}</p>
              <button id="try-again" class="btn btn-primary">Try Again</button>
            </div>
          `

          const tryAgainBtn = document.getElementById("try-again")
          if (tryAgainBtn) {
            tryAgainBtn.addEventListener("click", () => {
              // Reset form and show it again
              setupReviewForm(businessId)
              showReviewForm()
            })
          }
        }
      })
      .catch((error) => {
        console.error("Error submitting review:", error)
        reviewFormContainer.innerHTML = `
          <div class="submission-error">
            <i class="fas fa-exclamation-circle"></i>
            <h3>Error Submitting Review</h3>
            <p>There was an error submitting your review. Please try again later.</p>
            <button id="try-again" class="btn btn-primary">Try Again</button>
          </div>
        `

        const tryAgainBtn = document.getElementById("try-again")
        if (tryAgainBtn) {
          tryAgainBtn.addEventListener("click", () => {
            // Reset form and show it again
            setupReviewForm(businessId)
            showReviewForm()
          })
        }
      })
  })
}

// Show review form
function showReviewForm() {
  const reviewFormContainer = document.getElementById("review-form-container")
  if (reviewFormContainer) {
    reviewFormContainer.style.display = "block"
    // Scroll to form
    reviewFormContainer.scrollIntoView({ behavior: "smooth" })
  }
}
