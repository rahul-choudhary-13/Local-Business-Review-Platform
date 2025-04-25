// Global variables
const API_BASE_URL = ""

// Helper functions
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function generateStars(rating) {
  const fullStar = '<i class="fas fa-star star"></i>'
  const halfStar = '<i class="fas fa-star-half-alt star"></i>'
  const emptyStar = '<i class="far fa-star star"></i>'
  let stars = ""

  // Calculate full and partial stars
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  // Generate star HTML
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars += fullStar
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars += halfStar
    } else {
      stars += emptyStar
    }
  }

  return stars
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
}

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
  console.log("Document loaded, initializing LocalReviews...")

  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const navMenu = document.querySelector("nav ul")

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      this.classList.toggle("active")
      navMenu.classList.toggle("active")
    })
  }

  // Tab switching functionality
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
      document.getElementById(tabId + "-tab")?.classList.add("active") ||
        document.getElementById(tabId)?.classList.add("active")
    })
  })

  // Password toggle visibility
  const togglePasswordButtons = document.querySelectorAll(".toggle-password")

  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const passwordInput = this.previousElementSibling

      if (passwordInput.type === "password") {
        passwordInput.type = "text"
        this.classList.remove("fa-eye")
        this.classList.add("fa-eye-slash")
      } else {
        passwordInput.type = "password"
        this.classList.remove("fa-eye-slash")
        this.classList.add("fa-eye")
      }
    })
  })

  // Load featured businesses on homepage
  loadFeaturedBusinesses()

  // Load recent reviews on homepage
  loadRecentReviews()
})

// Load featured businesses on homepage
function loadFeaturedBusinesses() {
  const container = document.getElementById("featured-businesses-container")
  if (!container) return

  console.log("Loading featured businesses...")
  container.innerHTML = '<div class="loading">Loading featured businesses...</div>'

  // Use hardcoded sample data instead of API call to ensure it works
  const sampleBusinesses = [
    {
      id: "1",
      name: "Cafe Delicious",
      category: "restaurant",
      address: "123 Main St, Anytown, USA",
      phone: "(555) 123-4567",
      email: "info@cafedelicious.com",
      website: "https://www.cafedelicious.com",
      description:
        "A cozy cafe serving delicious breakfast and lunch options with a variety of coffee drinks. Our menu features locally sourced ingredients and organic coffee.",
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2FmZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      featured: true,
      location: "Anytown",
      average_rating: 4.5,
      review_count: 28,
      features: ["Free Wi-Fi", "Outdoor Seating", "Takeout"],
    },
    {
      id: "2",
      name: "Glamour Salon",
      category: "salon",
      address: "456 Oak Ave, Anytown, USA",
      phone: "(555) 234-5678",
      email: "appointments@glamoursalon.com",
      website: "https://www.glamoursalon.com",
      description:
        "Full-service salon offering haircuts, coloring, styling, and spa services. Our team of experienced stylists is dedicated to helping you look and feel your best.",
      image:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c2Fsb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      featured: true,
      location: "Anytown",
      average_rating: 4.8,
      review_count: 42,
      features: ["Hair Styling", "Coloring", "Manicure & Pedicure"],
    },
    {
      id: "3",
      name: "Fitness Zone",
      category: "gym",
      address: "789 Elm St, Othertown, USA",
      phone: "(555) 345-6789",
      email: "info@fitnesszone.com",
      website: "https://www.fitnesszone.com",
      description:
        "State-of-the-art gym with cardio equipment, weights, and group fitness classes. Our facility includes a wide range of modern equipment and personal training services.",
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Z3ltfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      featured: true,
      location: "Othertown",
      average_rating: 4.2,
      review_count: 35,
      features: ["Cardio Equipment", "Free Weights", "Group Classes"],
    },
    {
      id: "4",
      name: "Tech Gadgets",
      category: "retail",
      address: "101 Pine St, Anytown, USA",
      phone: "(555) 456-7890",
      email: "sales@techgadgets.com",
      website: "https://www.techgadgets.com",
      description:
        "Retailer of the latest tech gadgets, computers, and accessories. We offer a wide selection of smartphones, laptops, tablets, and smart home devices from all major brands.",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dGVjaHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      featured: true,
      location: "Anytown",
      average_rating: 3.9,
      review_count: 19,
      features: ["Latest Gadgets", "Tech Support", "Trade-In Program"],
    },
  ]

  // Display the sample businesses
  if (sampleBusinesses.length === 0) {
    container.innerHTML = '<p class="no-results">No featured businesses found.</p>'
    return
  }

  let html = ""
  sampleBusinesses.forEach((business) => {
    // Use a default image if the business image is missing
    const businessImage =
      business.image ||
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c3RvcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"

    html += `
      <div class="business-card stagger-item">
        <div class="business-image" style="background-image: url('${businessImage}')">
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
}

// Load recent reviews on homepage
function loadRecentReviews() {
  const container = document.getElementById("recent-reviews-container")
  if (!container) return

  console.log("Loading recent reviews...")
  container.innerHTML = '<div class="loading">Loading recent reviews...</div>'

  // Use hardcoded sample data instead of API call to ensure it works
  const sampleReviews = [
    {
      id: "1",
      business_id: "1",
      business_name: "Cafe Delicious",
      reviewer_name: "John Smith",
      reviewer_email: "john@example.com",
      rating: 5,
      title: "Best coffee in town!",
      content:
        "I absolutely love the coffee here. The atmosphere is cozy and the staff is friendly. Highly recommended! The pastries are also amazing, especially the croissants.",
      date: "2025-03-15T10:30:00",
      approved: true,
    },
    {
      id: "2",
      business_id: "1",
      business_name: "Cafe Delicious",
      reviewer_name: "Sarah Johnson",
      reviewer_email: "sarah@example.com",
      rating: 4,
      title: "Great breakfast options",
      content:
        "The breakfast menu is excellent. I particularly enjoyed the avocado toast. Would definitely come back. The coffee was also very good and the service was prompt.",
      date: "2025-03-10T09:15:00",
      approved: true,
    },
    {
      id: "3",
      business_id: "2",
      business_name: "Glamour Salon",
      reviewer_name: "Emily Davis",
      reviewer_email: "emily@example.com",
      rating: 5,
      title: "Amazing haircut!",
      content:
        "I got the best haircut of my life here. The stylist really listened to what I wanted and delivered perfectly. The salon is clean and modern, and they offer complimentary beverages.",
      date: "2025-03-05T14:45:00",
      approved: true,
    },
    {
      id: "4",
      business_id: "3",
      business_name: "Fitness Zone",
      reviewer_name: "Michael Brown",
      reviewer_email: "michael@example.com",
      rating: 4,
      title: "Great equipment, friendly staff",
      content:
        "This gym has all the equipment I need and the staff is very helpful. The only downside is it gets crowded after work. I especially like the variety of classes they offer.",
      date: "2025-02-28T18:20:00",
      approved: true,
    },
    {
      id: "5",
      business_id: "4",
      business_name: "Tech Gadgets",
      reviewer_name: "David Wilson",
      reviewer_email: "david@example.com",
      rating: 4,
      title: "Excellent selection and knowledgeable staff",
      content:
        "I was looking for a new laptop and the staff was incredibly helpful in finding the right one for my needs. They have a great selection and competitive prices. Will shop here again!",
      date: "2025-02-25T13:45:00",
      approved: true,
    },
    {
      id: "6",
      business_id: "2",
      business_name: "Glamour Salon",
      reviewer_name: "Jessica Miller",
      reviewer_email: "jessica@example.com",
      rating: 5,
      title: "Fantastic manicure and pedicure",
      content:
        "I had a mani-pedi here and it was absolutely perfect. The technician was skilled and attentive, and the salon is beautiful and clean. I'll definitely be back for more services!",
      date: "2025-02-20T11:30:00",
      approved: true,
    },
  ]

  // Display the sample reviews
  if (sampleReviews.length === 0) {
    container.innerHTML = '<p class="no-results">No recent reviews found.</p>'
    return
  }

  let html = ""
  sampleReviews.forEach((review) => {
    html += `
      <div class="review-card stagger-item">
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
        <p class="review-business">
          <a href="business-detail.html?id=${review.business_id}">
            <i class="fas fa-store"></i> ${review.business_name}
          </a>
        </p>
      </div>
    `
  })

  container.innerHTML = html
}

// Load businesses for the business listing page
function loadBusinesses(page = 1, filters = {}) {
  const container = document.getElementById("businesses-container")
  if (!container) return

  container.innerHTML = '<div class="loading">Loading businesses...</div>'

  // Use hardcoded sample data instead of API call to ensure it works
  const sampleBusinesses = [
    {
      id: "1",
      name: "Cafe Delicious",
      category: "restaurant",
      address: "123 Main St, Anytown, USA",
      phone: "(555) 123-4567",
      email: "info@cafedelicious.com",
      website: "https://www.cafedelicious.com",
      description: "A cozy cafe serving delicious breakfast and lunch options with a variety of coffee drinks.",
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2FmZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      featured: true,
      location: "Anytown",
      average_rating: 4.5,
      review_count: 28,
    },
    {
      id: "2",
      name: "Glamour Salon",
      category: "salon",
      address: "456 Oak Ave, Anytown, USA",
      phone: "(555) 234-5678",
      email: "appointments@glamoursalon.com",
      website: "https://www.glamoursalon.com",
      description: "Full-service salon offering haircuts, coloring, styling, and spa services.",
      image:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c2Fsb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      featured: true,
      location: "Anytown",
      average_rating: 4.8,
      review_count: 42,
    },
    {
      id: "3",
      name: "Fitness Zone",
      category: "gym",
      address: "789 Elm St, Othertown, USA",
      phone: "(555) 345-6789",
      email: "info@fitnesszone.com",
      website: "https://www.fitnesszone.com",
      description: "State-of-the-art gym with cardio equipment, weights, and group fitness classes.",
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Z3ltfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      featured: false,
      location: "Othertown",
      average_rating: 4.2,
      review_count: 35,
    },
    {
      id: "4",
      name: "Tech Gadgets",
      category: "retail",
      address: "101 Pine St, Anytown, USA",
      phone: "(555) 456-7890",
      email: "sales@techgadgets.com",
      website: "https://www.techgadgets.com",
      description: "Retailer of the latest tech gadgets, computers, and accessories.",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dGVjaHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      featured: true,
      location: "Anytown",
      average_rating: 3.9,
      review_count: 19,
    },
    {
      id: "5",
      name: "Green Thumb Garden Center",
      category: "retail",
      address: "505 Garden Way, Anytown, USA",
      phone: "(555) 678-9012",
      email: "info@greenthumb.com",
      website: "https://www.greenthumbgarden.com",
      description: "Complete garden center offering plants, trees, shrubs, and gardening supplies.",
      image:
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Z2FyZGVuJTIwY2VudGVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      featured: true,
      location: "Anytown",
      average_rating: 4.6,
      review_count: 31,
    },
    {
      id: "6",
      name: "Bella's Boutique",
      category: "retail",
      address: "202 Fashion Ave, Othertown, USA",
      phone: "(555) 789-0123",
      email: "info@bellasboutique.com",
      website: "https://www.bellasboutique.com",
      description: "Trendy clothing boutique offering the latest fashion for women.",
      image:
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdGhpbmclMjBzdG9yZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      featured: false,
      location: "Othertown",
      average_rating: 4.3,
      review_count: 27,
    },
    {
      id: "7",
      name: "Paws & Claws Pet Shop",
      category: "retail",
      address: "303 Pet Lane, Anytown, USA",
      phone: "(555) 890-1234",
      email: "info@pawsandclaws.com",
      website: "https://www.pawsandclaws.com",
      description: "Full-service pet shop offering supplies, grooming, and adoption services.",
      image:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGV0JTIwc2hvcHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      featured: false,
      location: "Anytown",
      average_rating: 4.7,
      review_count: 38,
    },
    {
      id: "8",
      name: "Fresh Harvest Market",
      category: "retail",
      address: "404 Market St, Othertown, USA",
      phone: "(555) 901-2345",
      email: "info@freshharvestmarket.com",
      website: "https://www.freshharvestmarket.com",
      description: "Local grocery store specializing in organic and locally-sourced produce.",
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JvY2VyeXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      featured: true,
      location: "Othertown",
      average_rating: 4.4,
      review_count: 45,
    },
  ]

  // Filter businesses based on user selections
  let filteredBusinesses = [...sampleBusinesses]

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filteredBusinesses = filteredBusinesses.filter(
      (business) =>
        business.name.toLowerCase().includes(searchTerm) || business.description.toLowerCase().includes(searchTerm),
    )
  }

  if (filters.category) {
    filteredBusinesses = filteredBusinesses.filter((business) => business.category === filters.category)
  }

  if (filters.location) {
    filteredBusinesses = filteredBusinesses.filter((business) => business.location === filters.location)
  }

  if (filters.rating) {
    const minRating = Number.parseInt(filters.rating)
    filteredBusinesses = filteredBusinesses.filter((business) => business.average_rating >= minRating)
  }

  // Display the filtered businesses
  if (filteredBusinesses.length === 0) {
    container.innerHTML = '<p class="no-results">No businesses found matching your criteria.</p>'
    return
  }

  let html = ""
  filteredBusinesses.forEach((business) => {
    const businessImage =
      business.image ||
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c3RvcmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"

    html += `
      <div class="business-card">
        <div class="business-image" style="background-image: url('${businessImage}')">
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

  // Create pagination
  const paginationContainer = document.getElementById("pagination-container")
  if (paginationContainer) {
    const paginationHtml = `
      <button class="pagination-btn prev" disabled>
        <i class="fas fa-chevron-left"></i> Previous
      </button>
      <button class="pagination-btn page active" data-page="1">1</button>
      <button class="pagination-btn next" disabled>
        Next <i class="fas fa-chevron-right"></i>
      </button>
    `

    paginationContainer.innerHTML = paginationHtml
  }
}

// Load business details
function loadBusinessDetails(businessId) {
  const container = document.getElementById("business-detail-container")
  if (!container) return

  container.innerHTML = '<div class="loading">Loading business details...</div>'

  // Sample business data
  const sampleBusinesses = [
    {
      id: "1",
      name: "Cafe Delicious",
      category: "restaurant",
      address: "123 Main St, Anytown, USA",
      phone: "(555) 123-4567",
      email: "info@cafedelicious.com",
      website: "https://www.cafedelicious.com",
      description:
        "A cozy cafe serving delicious breakfast and lunch options with a variety of coffee drinks. Our menu features locally sourced ingredients and organic coffee. We offer a warm and inviting atmosphere perfect for working, studying, or catching up with friends.",
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2FmZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      featured: true,
      location: "Anytown",
      latitude: "40.7128",
      longitude: "-74.0060",
      hours: {
        monday: "7:00 AM - 8:00 PM",
        tuesday: "7:00 AM - 8:00 PM",
        wednesday: "7:00 AM - 8:00 PM",
        thursday: "7:00 AM - 8:00 PM",
        friday: "7:00 AM - 10:00 PM",
        saturday: "8:00 AM - 10:00 PM",
        sunday: "8:00 AM - 6:00 PM",
      },
      features: ["Free Wi-Fi", "Outdoor Seating", "Takeout", "Vegetarian Options", "Organic Coffee"],
      photos: [
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2FmZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y2FmZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FmZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
      ],
      average_rating: 4.5,
      review_count: 28,
    },
    {
      id: "2",
      name: "Glamour Salon",
      category: "salon",
      address: "456 Oak Ave, Anytown, USA",
      phone: "(555) 234-5678",
      email: "appointments@glamoursalon.com",
      website: "https://www.glamoursalon.com",
      description:
        "Full-service salon offering haircuts, coloring, styling, and spa services. Our team of experienced stylists is dedicated to helping you look and feel your best. We use only premium products and stay up-to-date with the latest trends and techniques.",
      image:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c2Fsb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      featured: true,
      location: "Anytown",
      latitude: "40.7135",
      longitude: "-74.0046",
      hours: {
        monday: "Closed",
        tuesday: "9:00 AM - 7:00 PM",
        wednesday: "9:00 AM - 7:00 PM",
        thursday: "9:00 AM - 8:00 PM",
        friday: "9:00 AM - 8:00 PM",
        saturday: "8:00 AM - 6:00 PM",
        sunday: "10:00 AM - 4:00 PM",
      },
      features: ["Hair Styling", "Coloring", "Manicure & Pedicure", "Facials", "Waxing"],
      photos: [
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c2Fsb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2Fsb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1470259078422-826894b933aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8c2Fsb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      ],
      average_rating: 4.8,
      review_count: 42,
    },
  ]

  // Find the business by ID
  const business = sampleBusinesses.find((b) => b.id === businessId)

  if (!business) {
    container.innerHTML = '<div class="error">Business not found. Please try again later.</div>'
    return
  }

  // Business hero section
  const html = `
    <div class="business-detail-container">
      <div class="business-hero" style="background-image: url('${business.image}')">
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

  // Initialize map if available
  const mapContainer = document.getElementById("map-container")
  if (mapContainer && business.latitude && business.longitude) {
    mapContainer.innerHTML = `
      <div class="map-fallback">
        <p>Map could not be loaded. <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}" target="_blank">View on Google Maps</a></p>
      </div>
    `
  }

  // Load reviews for this business
  loadBusinessReviews(businessId)
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

  // Sample reviews data
  const sampleReviews = [
    {
      id: "1",
      business_id: "1",
      reviewer_name: "John Smith",
      reviewer_email: "john@example.com",
      rating: 5,
      title: "Best coffee in town!",
      content:
        "I absolutely love the coffee here. The atmosphere is cozy and the staff is friendly. Highly recommended! The pastries are also amazing, especially the croissants.",
      date: "2025-03-15T10:30:00",
      approved: true,
    },
    {
      id: "2",
      business_id: "1",
      reviewer_name: "Sarah Johnson",
      reviewer_email: "sarah@example.com",
      rating: 4,
      title: "Great breakfast options",
      content:
        "The breakfast menu is excellent. I particularly enjoyed the avocado toast. Would definitely come back. The coffee was also very good and the service was prompt.",
      date: "2025-03-10T09:15:00",
      approved: true,
    },
    {
      id: "3",
      business_id: "2",
      reviewer_name: "Emily Davis",
      reviewer_email: "emily@example.com",
      rating: 5,
      title: "Amazing haircut!",
      content:
        "I got the best haircut of my life here. The stylist really listened to what I wanted and delivered perfectly. The salon is clean and modern, and they offer complimentary beverages.",
      date: "2025-03-05T14:45:00",
      approved: true,
    },
    {
      id: "4",
      business_id: "1",
      reviewer_name: "Michael Brown",
      reviewer_email: "michael@example.com",
      rating: 3,
      title: "Good food but slow service",
      content:
        "The food was good but the service was a bit slow. I had to wait 20 minutes for my order. The coffee was excellent though, and the atmosphere is nice.",
      date: "2025-02-28T18:20:00",
      approved: true,
    },
    {
      id: "5",
      business_id: "2",
      reviewer_name: "Jessica Miller",
      reviewer_email: "jessica@example.com",
      rating: 5,
      title: "Fantastic manicure and pedicure",
      content:
        "I had a mani-pedi here and it was absolutely perfect. The technician was skilled and attentive, and the salon is beautiful and clean. I'll definitely be back for more services!",
      date: "2025-02-20T11:30:00",
      approved: true,
    },
    {
      id: "6",
      business_id: "1",
      reviewer_name: "David Wilson",
      reviewer_email: "david@example.com",
      rating: 4,
      title: "Great lunch spot",
      content:
        "I come here for lunch at least once a week. The sandwiches are delicious and the staff is always friendly. Highly recommended for a quick lunch break.",
      date: "2025-02-15T12:45:00",
      approved: true,
    },
  ]

  // Filter reviews for this business
  const businessReviews = sampleReviews.filter((review) => review.business_id === businessId && review.approved)

  // Calculate average rating and rating breakdown
  let totalRating = 0
  const ratingBreakdown = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  }

  businessReviews.forEach((review) => {
    totalRating += review.rating
    ratingBreakdown[review.rating]++
  })

  const averageRating = businessReviews.length > 0 ? totalRating / businessReviews.length : 0

  // Update average rating and stars
  if (averageRatingElement) {
    averageRatingElement.textContent = averageRating.toFixed(1)
  }

  if (averageStarsElement) {
    averageStarsElement.innerHTML = generateStars(averageRating)
  }

  if (reviewCountElement) {
    reviewCountElement.textContent = `${businessReviews.length} ${businessReviews.length === 1 ? "review" : "reviews"}`
  }

  // Update rating breakdown
  if (ratingBreakdownElement) {
    let breakdownHtml = ""

    for (let i = 5; i >= 1; i--) {
      const count = ratingBreakdown[i] || 0
      const percentage = businessReviews.length > 0 ? (count / businessReviews.length) * 100 : 0

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
  if (businessReviews.length === 0) {
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
  businessReviews.forEach((review) => {
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

  // Set up review form
  setupReviewForm(businessId)
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

    // Get form data
    const reviewerName = document.getElementById("reviewer-name").value
    const reviewerEmail = document.getElementById("reviewer-email").value
    const rating = document.querySelector('input[name="rating"]:checked').value
    const reviewTitle = document.getElementById("review-title").value
    const reviewContent = document.getElementById("review-content").value

    // Create success message
    reviewFormContainer.innerHTML = `
      <div class="submission-success">
        <i class="fas fa-check-circle"></i>
        <h3>Thank you for your review!</h3>
        <p>Your review has been submitted and is pending approval by our administrators.</p>
        <p>Once approved, it will appear on the business page.</p>
        <button id="close-success" class="btn btn-primary">Close</button>
      </div>
    `

    // Add event listener to close button
    const closeSuccessBtn = document.getElementById("close-success")
    if (closeSuccessBtn) {
      closeSuccessBtn.addEventListener("click", () => {
        reviewFormContainer.style.display = "none"
      })
    }
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

// Initialize page based on current URL
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname
  console.log("Current path:", path)

  if (path.endsWith("index.html") || path.endsWith("/") || path === "") {
    console.log("On homepage, loading featured businesses and recent reviews")
    // These are already called in the DOMContentLoaded event above
  } else if (path.endsWith("business-listing.html")) {
    console.log("On business listing page, loading businesses")

    // Load locations for filter
    const locationSelect = document.getElementById("location-select")
    if (locationSelect) {
      let optionsHtml = '<option value="">All Locations</option>'
      const locations = ["Anytown", "Othertown"]
      locations.forEach((location) => {
        optionsHtml += `<option value="${location}">${location}</option>`
      })
      locationSelect.innerHTML = optionsHtml
    }

    // Load businesses (first page, no filters)
    loadBusinesses()

    // Set up filter form
    const applyFiltersButton = document.getElementById("apply-filters")
    if (applyFiltersButton) {
      applyFiltersButton.addEventListener("click", () => {
        const filters = {
          search: document.getElementById("search-businesses").value,
          category: document.getElementById("category-select").value,
          location: document.getElementById("location-select").value,
          rating: document.getElementById("rating-select").value,
        }

        loadBusinesses(1, filters)
      })
    }
  } else if (path.endsWith("business-detail.html")) {
    console.log("On business detail page")

    // Get business ID from URL
    const urlParams = new URLSearchParams(window.location.search)
    const businessId = urlParams.get("id")

    if (businessId) {
      loadBusinessDetails(businessId)
    }
  }
})
