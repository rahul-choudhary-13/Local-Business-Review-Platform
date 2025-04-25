<?php
header('Content-Type: application/json');

// Set up error handling
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Define data file paths
$businessesFile = '../data/businesses.json';
$reviewsFile = '../data/reviews.json';

// Create data directory if it doesn't exist
if (!file_exists('../data')) {
    mkdir('../data', 0755, true);
}

// Initialize businesses data file if it doesn't exist
if (!file_exists($businessesFile)) {
    $sampleBusinesses = [
        [
            'id' => '1',
            'name' => 'Cafe Delicious',
            'category' => 'restaurant',
            'address' => '123 Main St, Anytown, USA',
            'phone' => '(555) 123-4567',
            'email' => 'info@cafedelicious.com',
            'website' => 'https://www.cafedelicious.com',
            'description' => 'A cozy cafe serving delicious breakfast and lunch options with a variety of coffee drinks.',
            'image' => '/placeholder.svg?height=300&width=500&text=Cafe+Delicious',
            'featured' => true,
            'location' => 'Anytown'
        ],
        [
            'id' => '2',
            'name' => 'Glamour Salon',
            'category' => 'salon',
            'address' => '456 Oak Ave, Anytown, USA',
            'phone' => '(555) 234-5678',
            'email' => 'appointments@glamoursalon.com',
            'website' => 'https://www.glamoursalon.com',
            'description' => 'Full-service salon offering haircuts, coloring, styling, and spa services.',
            'image' => '/placeholder.svg?height=300&width=500&text=Glamour+Salon',
            'featured' => true,
            'location' => 'Anytown'
        ],
        [
            'id' => '3',
            'name' => 'Fitness Zone',
            'category' => 'gym',
            'address' => '789 Elm St, Othertown, USA',
            'phone' => '(555) 345-6789',
            'email' => 'info@fitnesszone.com',
            'website' => 'https://www.fitnesszone.com',
            'description' => 'State-of-the-art gym with cardio equipment, weights, and group fitness classes.',
            'image' => '/placeholder.svg?height=300&width=500&text=Fitness+Zone',
            'featured' => false,
            'location' => 'Othertown'
        ],
        [
            'id' => '4',
            'name' => 'Tech Gadgets',
            'category' => 'retail',
            'address' => '101 Pine St, Anytown, USA',
            'phone' => '(555) 456-7890',
            'email' => 'sales@techgadgets.com',
            'website' => 'https://www.techgadgets.com',
            'description' => 'Retailer of the latest tech gadgets, computers, and accessories.',
            'image' => '/placeholder.svg?height=300&width=500&text=Tech+Gadgets',
            'featured' => true,
            'location' => 'Anytown'
        ],
        [
            'id' => '5',
            'name' => 'Clean & Shine',
            'category' => 'service',
            'address' => '202 Maple Ave, Othertown, USA',
            'phone' => '(555) 567-8901',
            'email' => 'info@cleanandshine.com',
            'website' => 'https://www.cleanandshine.com',
            'description' => 'Professional cleaning services for homes and businesses.',
            'image' => '/placeholder.svg?height=300&width=500&text=Clean+%26+Shine',
            'featured' => false,
            'location' => 'Othertown'
        ]
    ];
    
    file_put_contents($businessesFile, json_encode($sampleBusinesses, JSON_PRETTY_PRINT));
}

// Initialize reviews data file if it doesn't exist
if (!file_exists($reviewsFile)) {
    $sampleReviews = [
        [
            'id' => '1',
            'business_id' => '1',
            'reviewer_name' => 'John Smith',
            'reviewer_email' => 'john@example.com',
            'rating' => 5,
            'title' => 'Best coffee in town!',
            'content' => 'I absolutely love the coffee here. The atmosphere is cozy and the staff is friendly. Highly recommended!',
            'date' => '2025-03-15T10:30:00',
            'approved' => true
        ],
        [
            'id' => '2',
            'business_id' => '1',
            'reviewer_name' => 'Sarah Johnson',
            'reviewer_email' => 'sarah@example.com',
            'rating' => 4,
            'title' => 'Great breakfast options',
            'content' => 'The breakfast menu is excellent. I particularly enjoyed the avocado toast. Would definitely come back.',
            'date' => '2025-03-10T09:15:00',
            'approved' => true
        ],
        [
            'id' => '3',
            'business_id' => '2',
            'reviewer_name' => 'Emily Davis',
            'reviewer_email' => 'emily@example.com',
            'rating' => 5,
            'title' => 'Amazing haircut!',
            'content' => 'I got the best haircut of my life here. The stylist really listened to what I wanted and delivered perfectly.',
            'date' => '2025-03-05T14:45:00',
            'approved' => true
        ],
        [
            'id' => '4',
            'business_id' => '3',
            'reviewer_name' => 'Michael Brown',
            'reviewer_email' => 'michael@example.com',
            'rating' => 4,
            'title' => 'Great equipment, friendly staff',
            'content' => 'This gym has all the equipment I need and the staff is very helpful. The only downside is it gets crowded after work.',
            'date' => '2025-02-28T18:20:00',
            'approved' => true
        ],
        [
            'id' => '5',
            'business_id' => '4',
            'reviewer_name' => 'David Wilson',
            'reviewer_email' => 'david@example.com',
            'rating' => 3,
            'title' => 'Good selection but pricey',
            'content' => 'They have a great selection of gadgets, but the prices are a bit higher than online retailers.',
            'date' => '2025-02-20T11:10:00',
            'approved' => true
        ]
    ];
    
    file_put_contents($reviewsFile, json_encode($sampleReviews, JSON_PRETTY_PRINT));
}

// Load data
function loadBusinesses() {
    global $businessesFile;
    $data = file_get_contents($businessesFile);
    return json_decode($data, true);
}

function loadReviews() {
    global $reviewsFile;
    $data = file_get_contents($reviewsFile);
    return json_decode($data, true);
}

// Calculate average rating for a business
function calculateAverageRating($businessId, $reviews) {
    $total = 0;
    $count = 0;
    
    foreach ($reviews as $review) {
        if ($review['business_id'] === $businessId && $review['approved'] === true) {
            $total += $review['rating'];
            $count++;
        }
    }
    
    return $count > 0 ? $total / $count : 0;
}

// Count reviews for a business
function countReviews($businessId, $reviews) {
    $count = 0;
    
    foreach ($reviews as $review) {
        if ($review['business_id'] === $businessId && $review['approved'] === true) {
            $count++;
        }
    }
    
    return $count;
}

// Handle GET requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $businesses = loadBusinesses();
    $reviews = loadReviews();
    
    // Get locations for filter
    if (isset($_GET['locations'])) {
        $locations = [];
        
        foreach ($businesses as $business) {
            if (!in_array($business['location'], $locations)) {
                $locations[] = $business['location'];
            }
        }
        
        echo json_encode($locations);
        exit;
    }
    
    // Get a single business by ID
    if (isset($_GET['id'])) {
        $businessId = $_GET['id'];
        $business = null;
        
        foreach ($businesses as $b) {
            if ($b['id'] === $businessId) {
                $business = $b;
                break;
            }
        }
        
        if ($business) {
            // Add average rating and review count
            $business['average_rating'] = calculateAverageRating($businessId, $reviews);
            $business['review_count'] = countReviews($businessId, $reviews);
            
            echo json_encode($business);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Business not found']);
        }
        
        exit;
    }
    
    // Get featured businesses
    if (isset($_GET['featured'])) {
        $featuredBusinesses = [];
        
        foreach ($businesses as $business) {
            if ($business['featured']) {
                // Add average rating and review count
                $business['average_rating'] = calculateAverageRating($business['id'], $reviews);
                $business['review_count'] = countReviews($business['id'], $reviews);
                
                $featuredBusinesses[] = $business;
            }
        }
        
        echo json_encode($featuredBusinesses);
        exit;
    }
    
    // Get businesses with pagination and filtering
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $perPage = 8;
    $offset = ($page - 1) * $perPage;
    
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    $category = isset($_GET['category']) ? $_GET['category'] : '';
    $location = isset($_GET['location']) ? $_GET['location'] : '';
    $minRating = isset($_GET['rating']) ? (int)$_GET['rating'] : 0;
    
    // Filter businesses
    $filteredBusinesses = [];
    
    foreach ($businesses as $business) {
        $averageRating = calculateAverageRating($business['id'], $reviews);
        $reviewCount = countReviews($business['id'], $reviews);
        
        // Apply filters
        $matchesSearch = empty($search) || 
            stripos($business['name'], $search) !== false || 
            stripos($business['description'], $search) !== false;
        
        $matchesCategory = empty($category) || $business['category'] === $category;
        $matchesLocation = empty($location) || $business['location'] === $location;
        $matchesRating = $minRating === 0 || $averageRating >= $minRating;
        
        if ($matchesSearch && $matchesCategory && $matchesLocation && $matchesRating) {
            // Add average rating and review count
            $business['average_rating'] = $averageRating;
            $business['review_count'] = $reviewCount;
            
            $filteredBusinesses[] = $business;
        }
    }
    
    // Sort businesses by name
    usort($filteredBusinesses, function($a, $b) {
        return strcmp($a['name'], $b['name']);
    });
    
    $totalBusinesses = count($filteredBusinesses);
    $totalPages = ceil($totalBusinesses / $perPage);
    
    // Get businesses for current page
    $pagedBusinesses = array_slice($filteredBusinesses, $offset, $perPage);
    
    echo json_encode([
        'businesses' => $pagedBusinesses,
        'total' => $totalBusinesses,
        'page' => $page,
        'per_page' => $perPage,
        'total_pages' => $totalPages
    ]);
    
    exit;
}

// Handle POST, PUT, DELETE requests (for admin functionality)
// These would be implemented in a real application
