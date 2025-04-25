<?php
header('Content-Type: application/json');

// Set up error handling
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Define data file paths
$reviewsFile = '../../data/reviews.json';
$businessesFile = '../../data/businesses.json';

// Create data directory if it doesn't exist
if (!file_exists('../../data')) {
    mkdir('../../data', 0755, true);
}

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

// Save reviews
function saveReviews($reviews) {
    global $reviewsFile;
    file_put_contents($reviewsFile, json_encode($reviews, JSON_PRETTY_PRINT));
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
    $reviews = loadReviews();
    
    // Get recent reviews
    if (isset($_GET['recent'])) {
        $approvedReviews = [];
        
        foreach ($reviews as $review) {
            if ($review['approved']) {
                // Add business name
                $review['business_name'] = getBusinessName($review['business_id']);
                $approvedReviews[] = $review;
            }
        }
        
        // Sort by date (newest first)
        usort($approvedReviews, function($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });
        
        // Get the 6 most recent reviews
        $recentReviews = array_slice($approvedReviews, 0, 6);
        
        echo json_encode($recentReviews);
        exit;
    }
    
    // Get reviews for a specific business
    if (isset($_GET['business_id'])) {
        $businessId = $_GET['business_id'];
        $businessReviews = [];
        $ratingBreakdown = [
            1 => 0,
            2 => 0,
            3 => 0,
            4 => 0,
            5 => 0
        ];
        $totalRating = 0;
        $reviewCount = 0;
        
        foreach ($reviews as $review) {
            if ($review['business_id'] === $businessId && $review['approved']) {
                $businessReviews[] = $review;
                $ratingBreakdown[$review['rating']]++;
                $totalRating += $review['rating'];
                $reviewCount++;
            }
        }
        
        // Sort by date (newest first)
        usort($businessReviews, function($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });
        
        $averageRating = $reviewCount > 0 ? $totalRating / $reviewCount : 0;
        
        echo json_encode([
            'reviews' => $businessReviews,
            'average_rating' => $averageRating,
            'rating_breakdown' => $ratingBreakdown
        ]);
        exit;
    }
    
    // Get all reviews (for admin)
    echo json_encode($reviews);
    exit;
}

// Handle POST requests (submit a new review)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data from request body
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid request data']);
        exit;
    }
    
    // Validate required fields
    $requiredFields = ['business_id', 'reviewer_name', 'reviewer_email', 'rating', 'review-title', 'review-content'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing required field: ' . $field]);
            exit;
        }
    }
    
    // Load existing reviews
    $reviews = loadReviews();
    
    // Generate a new review ID
    $newId = count($reviews) > 0 ? (int)max(array_column($reviews, 'id')) + 1 : 1;
    
    // Create new review
    $newReview = [
        'id' => (string)$newId,
        'business_id' => $data['business_id'],
        'reviewer_name' => $data['reviewer_name'],
        'reviewer_email' => $data['reviewer_email'],
        'rating' => (int)$data['rating'],
        'title' => $data['review-title'],
        'content' => $data['review-content'],
        'date' => date('Y-m-d\TH:i:s'),
        'approved' => false // Reviews need admin approval
    ];
    
    // Add new review
    $reviews[] = $newReview;
    
    // Save reviews
    saveReviews($reviews);
    
    echo json_encode(['success' => true, 'message' => 'Review submitted successfully']);
    exit;
}

// Handle PUT requests (update a review - for admin)
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Get JSON data from request body
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid request data']);
        exit;
    }
    
    // Load existing reviews
    $reviews = loadReviews();
    $reviewId = $data['id'];
    $found = false;
    
    // Update review
    foreach ($reviews as &$review) {
        if ($review['id'] === $reviewId) {
            // Update fields
            if (isset($data['approved'])) {
                $review['approved'] = $data['approved'];
            }
            
            $found = true;
            break;
        }
    }
    
    if (!$found) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Review not found']);
        exit;
    }
    
    // Save reviews
    saveReviews($reviews);
    
    echo json_encode(['success' => true, 'message' => 'Review updated successfully']);
    exit;
}

// Handle DELETE requests (delete a review - for admin)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Review ID is required']);
        exit;
    }
    
    $reviewId = $_GET['id'];
    $reviews = loadReviews();
    $initialCount = count($reviews);
    
    // Filter out the review to delete
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
    
    // Save reviews
    saveReviews($reviews);
    
    echo json_encode(['success' => true, 'message' => 'Review deleted successfully']);
    exit;
}
?>
