<?php
session_start();
header('Content-Type: application/json');

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Define data file paths
$reviewsFile = '../data/reviews.json';
$businessesFile = '../data/businesses.json';

// Load data
function loadReviews() {
    global $reviewsFile;
    if (file_exists($reviewsFile)) {
        $data = file_get_contents($reviewsFile);
        return json_decode($data, true);
    }
    return [];
}

function loadBusinesses() {
    global $businessesFile;
    if (file_exists($businessesFile)) {
        $data = file_get_contents($businessesFile);
        return json_decode($data, true);
    }
    return [];
}

// Save data
function saveReviews($reviews) {
    global $reviewsFile;
    file_put_contents($reviewsFile, json_encode($reviews, JSON_PRETTY_PRINT));
}

function saveBusinesses($businesses) {
    global $businessesFile;
    file_put_contents($businessesFile, json_encode($businesses, JSON_PRETTY_PRINT));
}

// Get business name by ID
function getBusinessName($businessId) {
    $businesses = loadBusinesses();
    
    foreach ($businesses as $business) {
        if ($business['id'] === $businessId) {
            return $business['name'];
        }
    }
    
    return 'Unknown Business';
}

// Handle GET requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get pending reviews
    if (isset($_GET['pending_reviews'])) {
        $reviews = loadReviews();
        $pendingReviews = [];
        
        foreach ($reviews as $review) {
            if (!$review['approved']) {
                // Add business name
                $review['business_name'] = getBusinessName($review['business_id']);
                $pendingReviews[] = $review;
            }
        }
        
        // Sort by date (newest first)
        usort($pendingReviews, function($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });
        
        echo json_encode($pendingReviews);
        exit;
    }
    
    // Get all reviews with business names
    if (isset($_GET['all_reviews'])) {
        $reviews = loadReviews();
        
        foreach ($reviews as &$review) {
            $review['business_name'] = getBusinessName($review['business_id']);
        }
        
        // Sort by date (newest first)
        usort($reviews, function($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });
        
        echo json_encode($reviews);
        exit;
    }
    
    // Get all businesses with stats
    if (isset($_GET['businesses'])) {
        $businesses = loadBusinesses();
        $reviews = loadReviews();
        $businessesWithStats = [];
        
        foreach ($businesses as $business) {
            $reviewCount = 0;
            $totalRating = 0;
            
            foreach ($reviews as $review) {
                if ($review['business_id'] === $business['id'] && $review['approved']) {
                    $reviewCount++;
                    $totalRating += $review['rating'];
                }
            }
            
            $averageRating = $reviewCount > 0 ? $totalRating / $reviewCount : 0;
            
            $businessesWithStats[] = [
                'id' => $business['id'],
                'name' => $business['name'],
                'category' => $business['category'],
                'location' => $business['location'],
                'average_rating' => $averageRating,
                'review_count' => $reviewCount
            ];
        }
        
        // Sort by name
        usort($businessesWithStats, function($a, $b) {
            return strcmp($a['name'], $b['name']);
        });
        
        echo json_encode($businessesWithStats);
        exit;
    }
    
    // Default response
    echo json_encode(['error' => 'Invalid request']);
    exit;
}

// Handle POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Approve a review
    if (isset($_GET['approve_review'])) {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data || !isset($data['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Review ID is required']);
            exit;
        }
        
        $reviewId = $data['id'];
        $reviews = loadReviews();
        $found = false;
        
        foreach ($reviews as &$review) {
            if ($review['id'] === $reviewId) {
                $review['approved'] = true;
                $found = true;
                break;
            }
        }
        
        if (!$found) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Review not found']);
            exit;
        }
        
        saveReviews($reviews);
        
        echo json_encode(['success' => true, 'message' => 'Review approved successfully']);
        exit;
    }
    
    // Reject a review
    if (isset($_GET['reject_review'])) {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data || !isset($data['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Review ID is required']);
            exit;
        }
        
        $reviewId = $data['id'];
        $reviews = loadReviews();
        $initialCount = count($reviews);
        
        // Filter out the review to reject
        $reviews = array_filter($reviews, function($review) use ($reviewId) {
            return $review['id'] !== $reviewId;
        });
        
        if (count($reviews) === $initialCount) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Review not found']);
            exit;
        }
        
        // Re-index array
        $reviews = array_values($reviews);
        
        saveReviews($reviews);
        
        echo json_encode(['success' => true, 'message' => 'Review rejected successfully']);
        exit;
    }
    
    // Default response
    echo json_encode(['error' => 'Invalid request']);
    exit;
}
