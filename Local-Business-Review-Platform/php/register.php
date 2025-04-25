<?php
session_start();
header('Content-Type: application/json');

// Set up error handling
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Define data file paths
$usersFile = '../data/users.json';
$businessesFile = '../data/businesses.json';

// Create data directory if it doesn't exist
if (!file_exists('../data')) {
    mkdir('../data', 0755, true);
}

// Initialize users data file if it doesn't exist
if (!file_exists($usersFile)) {
    $sampleUsers = [
        [
            'id' => '1',
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => password_hash('password123', PASSWORD_DEFAULT),
            'type' => 'user',
            'created_at' => date('Y-m-d H:i:s')
        ],
        [
            'id' => '2',
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => password_hash('admin123', PASSWORD_DEFAULT),
            'type' => 'admin',
            'created_at' => date('Y-m-d H:i:s')
        ]
    ];
    
    file_put_contents($usersFile, json_encode($sampleUsers, JSON_PRETTY_PRINT));
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
            'password' => password_hash('business123', PASSWORD_DEFAULT),
            'website' => 'https://www.cafedelicious.com',
            'description' => 'A cozy cafe serving delicious breakfast and lunch options with a variety of coffee drinks.',
            'image' => 'img/businesses/cafe-delicious.jpg',
            'featured' => true,
            'location' => 'Anytown',
            'latitude' => '40.7128',
            'longitude' => '-74.0060',
            'hours' => [
                'monday' => '7:00 AM - 8:00 PM',
                'tuesday' => '7:00 AM - 8:00 PM',
                'wednesday' => '7:00 AM - 8:00 PM',
                'thursday' => '7:00 AM - 8:00 PM',
                'friday' => '7:00 AM - 10:00 PM',
                'saturday' => '8:00 AM - 10:00 PM',
                'sunday' => '8:00 AM - 6:00 PM'
            ],
            'features' => [
                'Free Wi-Fi',
                'Outdoor Seating',
                'Takeout',
                'Vegetarian Options',
                'Organic Coffee'
            ],
            'photos' => [
                'img/businesses/cafe-delicious-1.jpg',
                'img/businesses/cafe-delicious-2.jpg',
                'img/businesses/cafe-delicious-3.jpg'
            ]
        ]
    ];
    
    file_put_contents($businessesFile, json_encode($sampleBusinesses, JSON_PRETTY_PRINT));
}

// Load users data
function loadUsers() {
    global $usersFile;
    $data = file_get_contents($usersFile);
    return json_decode($data, true);
}

// Save users data
function saveUsers($users) {
    global $usersFile;
    file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));
}

// Load businesses data
function loadBusinesses() {
    global $businessesFile;
    if (file_exists($businessesFile)) {
        $data = file_get_contents($businessesFile);
        return json_decode($data, true);
    }
    return [];
}

// Save businesses data
function saveBusinesses($businesses) {
    global $businessesFile;
    file_put_contents($businessesFile, json_encode($businesses, JSON_PRETTY_PRINT));
}

// Check if email already exists
function emailExists($email) {
    $users = loadUsers();
    $businesses = loadBusinesses();
    
    foreach ($users as $user) {
        if ($user['email'] === $email) {
            return true;
        }
    }
    
    foreach ($businesses as $business) {
        if (isset($business['email']) && $business['email'] === $email) {
            return true;
        }
    }
    
    return false;
}

// Handle registration request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $accountType = $_POST['account_type'] ?? '';
    
    if ($accountType === 'user') {
        // User registration
        $name = $_POST['name'] ?? '';
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';
        $confirmPassword = $_POST['confirm_password'] ?? '';
        
        // Validate required fields
        if (empty($name) || empty($email) || empty($password) || empty($confirmPassword)) {
            echo json_encode([
                'success' => false,
                'message' => 'All fields are required'
            ]);
            exit;
        }
        
        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode([
                'success' => false,
                'message' => 'Invalid email format'
            ]);
            exit;
        }
        
        // Validate password match
        if ($password !== $confirmPassword) {
            echo json_encode([
                'success' => false,
                'message' => 'Passwords do not match'
            ]);
            exit;
        }
        
        // Check if email already exists
        if (emailExists($email)) {
            echo json_encode([
                'success' => false,
                'message' => 'Email already in use'
            ]);
            exit;
        }
        
        // Create new user
        $users = loadUsers();
        $newUserId = count($users) > 0 ? max(array_column($users, 'id')) + 1 : 1;
        
        $newUser = [
            'id' => (string)$newUserId,
            'name' => $name,
            'email' => $email,
            'password' => password_hash($password, PASSWORD_DEFAULT),
            'type' => 'user',
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        $users[] = $newUser;
        saveUsers($users);
        
        echo json_encode([
            'success' => true,
            'message' => 'Registration successful! You can now log in.',
            'redirect' => 'login.html'
        ]);
        
    } elseif ($accountType === 'business') {
        // Business registration
        $businessName = $_POST['business_name'] ?? '';
        $businessCategory = $_POST['business_category'] ?? '';
        $ownerName = $_POST['owner_name'] ?? '';
        $email = $_POST['email'] ?? '';
        $phone = $_POST['phone'] ?? '';
        $password = $_POST['password'] ?? '';
        $confirmPassword = $_POST['confirm_password'] ?? '';
        
        // Validate required fields
        if (empty($businessName) || empty($businessCategory) || empty($ownerName) || 
            empty($email) || empty($phone) || empty($password) || empty($confirmPassword)) {
            echo json_encode([
                'success' => false,
                'message' => 'All fields are required'
            ]);
            exit;
        }
        
        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode([
                'success' => false,
                'message' => 'Invalid email format'
            ]);
            exit;
        }
        
        // Validate password match
        if ($password !== $confirmPassword) {
            echo json_encode([
                'success' => false,
                'message' => 'Passwords do not match'
            ]);
            exit;
        }
        
        // Check if email already exists
        if (emailExists($email)) {
            echo json_encode([
                'success' => false,
                'message' => 'Email already in use'
            ]);
            exit;
        }
        
        // Create new business
        $businesses = loadBusinesses();
        $newBusinessId = count($businesses) > 0 ? max(array_column($businesses, 'id')) + 1 : 1;
        
        $newBusiness = [
            'id' => (string)$newBusinessId,
            'name' => $businessName,
            'category' => $businessCategory,
            'owner_name' => $ownerName,
            'email' => $email,
            'phone' => $phone,
            'password' => password_hash($password, PASSWORD_DEFAULT),
            'address' => '',
            'website' => '',
            'description' => '',
            'image' => 'img/placeholder-business.jpg',
            'featured' => false,
            'location' => '',
            'created_at' => date('Y-m-d H:i:s'),
            'status' => 'pending' // Businesses need admin approval
        ];
        
        $businesses[] = $newBusiness;
        saveBusinesses($businesses);
        
        echo json_encode([
            'success' => true,
            'message' => 'Business registration successful! Your account is pending approval.',
            'redirect' => 'login.html'
        ]);
        
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid account type'
        ]);
    }
    
    exit;
}
?>
