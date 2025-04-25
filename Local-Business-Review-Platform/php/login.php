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

// Load users data
function loadUsers() {
    global $usersFile;
    $data = file_get_contents($usersFile);
    return json_decode($data, true);
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

// Handle login request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $remember = isset($_POST['remember']) && $_POST['remember'] === 'true';
    
    if (empty($email) || empty($password)) {
        echo json_encode([
            'success' => false,
            'message' => 'Email and password are required'
        ]);
        exit;
    }
    
    // Check user credentials
    $users = loadUsers();
    $businesses = loadBusinesses();
    $authenticated = false;
    $userData = null;
    
    // Check regular users
    foreach ($users as $user) {
        if ($user['email'] === $email && password_verify($password, $user['password'])) {
            $authenticated = true;
            $userData = $user;
            break;
        }
    }
    
    // Check business accounts if not authenticated yet
    if (!$authenticated) {
        foreach ($businesses as $business) {
            if (isset($business['email']) && $business['email'] === $email && 
                isset($business['password']) && password_verify($password, $business['password'])) {
                $authenticated = true;
                $userData = [
                    'id' => $business['id'],
                    'name' => $business['name'],
                    'email' => $business['email'],
                    'type' => 'business',
                    'business_id' => $business['id']
                ];
                break;
            }
        }
    }
    
    if ($authenticated) {
        // Set session variables
        $_SESSION['user_id'] = $userData['id'];
        $_SESSION['user_name'] = $userData['name'];
        $_SESSION['user_email'] = $userData['email'];
        $_SESSION['user_type'] = $userData['type'];
        
        if ($userData['type'] === 'business') {
            $_SESSION['business_id'] = $userData['business_id'];
        }
        
        // Set remember me cookie if requested
        if ($remember) {
            $token = bin2hex(random_bytes(32));
            setcookie('remember_token', $token, time() + 30 * 24 * 60 * 60, '/');
            
            // In a real app, you would store this token in the database
            // For this demo, we'll just set it in the session
            $_SESSION['remember_token'] = $token;
        }
        
        // Determine redirect URL based on user type
        $redirect = 'index.html';
        if ($userData['type'] === 'admin') {
            $redirect = 'admin/dashboard.php';
        } elseif ($userData['type'] === 'business') {
            $redirect = 'business-dashboard.html';
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'redirect' => $redirect,
            'user' => [
                'id' => $userData['id'],
                'name' => $userData['name'],
                'email' => $userData['email'],
                'type' => $userData['type']
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email or password'
        ]);
    }
    
    exit;
}

// Handle GET request (check if user is logged in)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_SESSION['user_id'])) {
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $_SESSION['user_id'],
                'name' => $_SESSION['user_name'],
                'email' => $_SESSION['user_email'],
                'type' => $_SESSION['user_type']
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Not logged in'
        ]);
    }
    
    exit;
}
?>
