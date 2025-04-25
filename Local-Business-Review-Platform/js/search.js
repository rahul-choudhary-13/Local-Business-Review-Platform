// Search functionality for the homepage and business listing page
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input")
  const categoryFilter = document.getElementById("category-filter")
  const ratingFilter = document.getElementById("rating-filter")
  const searchButton = document.getElementById("search-btn")

  if (searchButton) {
    searchButton.addEventListener("click", () => {
      const searchQuery = searchInput ? searchInput.value : ""
      const category = categoryFilter ? categoryFilter.value : ""
      const rating = ratingFilter ? ratingFilter.value : ""

      // Build query string
      const queryParams = new URLSearchParams()
      if (searchQuery) queryParams.append("search", searchQuery)
      if (category) queryParams.append("category", category)
      if (rating) queryParams.append("rating", rating)

      // Redirect to business listing page with filters
      window.location.href = `business-listing.html?${queryParams.toString()}`
    })
  }

  // Handle Enter key in search input
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && searchButton) {
        searchButton.click()
      }
    })
  }

  // Business listing page filters
  const businessSearchInput = document.getElementById("search-businesses")
  const categorySelect = document.getElementById("category-select")
  const locationSelect = document.getElementById("location-select")
  const ratingSelect = document.getElementById("rating-select")
  const applyFiltersButton = document.getElementById("apply-filters")

  if (applyFiltersButton) {
    applyFiltersButton.addEventListener("click", () => {
      const filters = {
        search: businessSearchInput ? businessSearchInput.value : "",
        category: categorySelect ? categorySelect.value : "",
        location: locationSelect ? locationSelect.value : "",
        rating: ratingSelect ? ratingSelect.value : "",
      }

      loadBusinesses(1, filters)
    })
  }

  // Check if we're on the business listing page and have URL parameters
  if (window.location.pathname.endsWith("business-listing.html")) {
    const urlParams = new URLSearchParams(window.location.search)
    const search = urlParams.get("search")
    const category = urlParams.get("category")
    const location = urlParams.get("location")
    const rating = urlParams.get("rating")

    // Set form values from URL parameters
    if (search && businessSearchInput) {
      businessSearchInput.value = search
    }

    if (category && categorySelect) {
      categorySelect.value = category
    }

    if (rating && ratingSelect) {
      ratingSelect.value = rating
    }

    // Load locations for filter
    fetch(`php/api/businesses.php?locations=true`)
      .then((response) => response.json())
      .then((locations) => {
        if (locationSelect) {
          let optionsHtml = '<option value="">All Locations</option>'
          locations.forEach((loc) => {
            optionsHtml += `<option value="${loc}" ${location === loc ? "selected" : ""}>${loc}</option>`
          })
          locationSelect.innerHTML = optionsHtml
        }
      })
      .catch((error) => {
        console.error("Error loading locations:", error)
      })

    // Apply filters from URL parameters
    if (search || category || location || rating) {
      const filters = {
        search: search || "",
        category: category || "",
        location: location || "",
        rating: rating || "",
      }

      // Load businesses with filters
      setTimeout(() => {
        loadBusinesses(1, filters)
      }, 300)
    } else {
      // Load all businesses (first page, no filters)
      loadBusinesses()
    }
  }
})

// Function to generate star rating HTML
function generateStars(rating) {
  const starPercentage = (rating / 5) * 100
  const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`
  return `
    <div class="stars-outer">
      <div class="stars-inner" style="width: ${starPercentageRounded}"></div>
    </div>
  `
}

// Load businesses for the business listing page
function loadBusinesses(page = 1, filters = {}) {
  const container = document.getElementById("businesses-container")
  if (!container) return

  container.innerHTML = '<div class="loading">Loading businesses...</div>'

  // Build query string from filters
  const queryParams = new URLSearchParams()
  queryParams.append("page", page)

  if (filters.search) queryParams.append("search", filters.search)
  if (filters.category) queryParams.append("category", filters.category)
  if (filters.location) queryParams.append("location", filters.location)
  if (filters.rating) queryParams.append("rating", filters.rating)

  fetch(`php/api/businesses.php?${queryParams.toString()}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.businesses.length === 0) {
        container.innerHTML =
          '<div class="no-results"><i class="fas fa-search"></i><p>No businesses found matching your criteria.</p></div>'
        return
      }

      let html = ""
      data.businesses.forEach((business) => {
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
              <div class="business-features">
                ${
                  business.features
                    ? business.features
                        .slice(0, 3)
                        .map((feature) => `<span class="feature-tag">${feature}</span>`)
                        .join("")
                    : ""
                }
              </div>
              <a href="business-detail.html?id=${business.id}" class="business-link">View Details <i class="fas fa-arrow-right"></i></a>
            </div>
          </div>
        `
      })

      container.innerHTML = html

      // Create pagination
      const paginationContainer = document.getElementById("pagination-container")
      if (paginationContainer) {
        let paginationHtml = ""

        if (data.total_pages > 1) {
          paginationHtml += `
            <button class="pagination-btn prev" ${page === 1 ? "disabled" : ""}>
              <i class="fas fa-chevron-left"></i> Previous
            </button>
          `

          for (let i = 1; i <= data.total_pages; i++) {
            paginationHtml += `
              <button class="pagination-btn page ${i === page ? "active" : ""}" data-page="${i}">${i}</button>
            `
          }

          paginationHtml += `
            <button class="pagination-btn next" ${page === data.total_pages ? "disabled" : ""}>
              Next <i class="fas fa-chevron-right"></i>
            </button>
          `
        }

        paginationContainer.innerHTML = paginationHtml

        // Add event listeners to pagination buttons
        const prevBtn = paginationContainer.querySelector(".prev")
        const nextBtn = paginationContainer.querySelector(".next")
        const pageButtons = paginationContainer.querySelectorAll(".page")

        if (prevBtn) {
          prevBtn.addEventListener("click", () => {
            if (page > 1) {
              loadBusinesses(page - 1, filters)
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          })
        }

        if (nextBtn) {
          nextBtn.addEventListener("click", () => {
            if (page < data.total_pages) {
              loadBusinesses(page + 1, filters)
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          })
        }

        pageButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const pageNum = Number.parseInt(button.getAttribute("data-page"))
            loadBusinesses(pageNum, filters)
            window.scrollTo({ top: 0, behavior: "smooth" })
          })
        })
      }
    })
    .catch((error) => {
      console.error("Error loading businesses:", error)
      container.innerHTML = '<p class="error">Failed to load businesses. Please try again later.</p>'
    })
}
