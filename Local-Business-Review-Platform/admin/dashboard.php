<?php
session_start();

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: index.php');
    exit;
}

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: index.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - LocalReviews</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/responsive.css">
</head>
<body>
    <header>
        <div class="container">
            <div class="logo">
                <h1>LocalReviews</h1>
            </div>
            <nav>
                <ul>
                    <li><a href="../index.html">Home</a></li>
                    <li><a href="../business-listing.html">Businesses</a></li>
                    <li><a href="?logout=1">Logout</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <section class="admin-dashboard">
        <div class="container">
            <h2>Admin Dashboard</h2>
            
            <div class="admin-tabs">
                <button class="tab-btn active" data-tab="pending-reviews">Pending Reviews</button>
                <button class="tab-btn" data-tab="all-reviews">All Reviews</button>
                <button class="tab-btn" data-tab="businesses">Businesses</button>
            </div>
            
            <div class="tab-content active" id="pending-reviews">
                <h3>Pending Reviews</h3>
                <div class="admin-table-container">
                    <table class="admin-table" id="pending-reviews-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Business</th>
                                <th>Reviewer</th>
                                <th>Rating</th>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Pending reviews will be loaded here via JavaScript -->
                            <tr>
                                <td colspan="7" class="loading-cell">Loading pending reviews...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="tab-content" id="all-reviews">
                <h3>All Reviews</h3>
                <div class="admin-table-container">
                    <table class="admin-table" id="all-reviews-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Business</th>
                                <th>Reviewer</th>
                                <th>Rating</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- All reviews will be loaded here via JavaScript -->
                            <tr>
                                <td colspan="8" class="loading-cell">Loading all reviews...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="tab-content" id="businesses">
                <h3>Businesses</h3>
                <div class="admin-table-container">
                    <table class="admin-table" id="businesses-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Location</th>
                                <th>Avg. Rating</th>
                                <th>Reviews</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Businesses will be loaded here via JavaScript -->
                            <tr>
                                <td colspan="7" class="loading-cell">Loading businesses...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>

    <!-- Review Detail Modal -->
    <div id="review-modal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h3>Review Details</h3>
            <div id="review-detail-content">
                <!-- Review details will be loaded here -->
            </div>
            <div class="modal-actions" id="review-modal-actions">
                <!-- Action buttons will be added here -->
            </div>
        </div>
    </div>

    <footer>
        <div class="container">
            <p>&copy; 2025 LocalReviews. All rights reserved.</p>
        </div>
    </footer>

    <script src="../js/main.js"></script>
    <script src="js/admin.js"></script>
</body>
</html>
