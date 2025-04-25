<?php
header('Content-Type: application/json');

// Set up error handling
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Define data file paths
$businessesFile = '../../data/businesses.json';
$reviewsFile = '../../data/reviews.json';

// Create data directory if it doesn't exist
if (!file_exists('../../data')) {
    if (!mkdir('../../data', 0755, true)) {
        echo json_encode(['error' => 'Failed to create data directory', 'path' => realpath('../../')]);
        exit;
    }
}

// Sample businesses data
$sampleBusinesses = [
    [
        'id' => '1',
        'name' => 'Cafe Delicious',
        'category' => 'restaurant',
        'address' => '123 Main St, Anytown, USA',
        'phone' => '(555) 123-4567',
        'email' => 'info@cafedelicious.com',
        'website' => 'https://www.cafedelicious.com',
        'description' => 'A cozy cafe serving delicious breakfast and lunch options with a variety of coffee drinks. Our menu features locally sourced ingredients and organic coffee. We offer a warm and inviting atmosphere perfect for working, studying, or catching up with friends.',
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
    ],
    [
        'id' => '2',
        'name' => 'Glamour Salon',
        'category' => 'salon',
        'address' => '456 Oak Ave, Anytown, USA',
        'phone' => '(555) 234-5678',
        'email' => 'appointments@glamoursalon.com',
        'website' => 'https://www.glamoursalon.com',
        'description' => 'Full-service salon offering haircuts, coloring, styling, and spa services. Our team of experienced stylists is dedicated to helping you look and feel your best. We use only premium products and stay up-to-date with the latest trends and techniques.',
        'image' => 'img/businesses/glamour-salon.jpg',
        'featured' => true,
        'location' => 'Anytown',
        'latitude' => '40.7135',
        'longitude' => '-74.0046',
        'hours' => [
            'monday' => 'Closed',
            'tuesday' => '9:00 AM - 7:00 PM',
            'wednesday' => '9:00 AM - 7:00 PM',
            'thursday' => '9:00 AM - 8:00 PM',
            'friday' => '9:00 AM - 8:00 PM',
            'saturday' => '8:00 AM - 6:00 PM',
            'sunday' => '10:00 AM - 4:00 PM'
        ],
        'features' => [
            'Hair Styling',
            'Coloring',
            'Manicure & Pedicure',
            'Facials',
            'Waxing'
        ],
        'photos' => [
            'img/businesses/glamour-salon-1.jpg',
            'img/businesses/glamour-salon-2.jpg',
            'img/businesses/glamour-salon-3.jpg'
        ]
    ],
    [
        'id' => '3',
        'name' => 'Fitness Zone',
        'category' => 'gym',
        'address' => '789 Elm St, Othertown, USA',
        'phone' => '(555) 345-6789',
        'email' => 'info@fitnesszone.com',
        'website' => 'https://www.fitnesszone.com',
        'description' => 'State-of-the-art gym with cardio equipment, weights, and group fitness classes. Our facility includes a wide range of modern equipment, personal training services, and specialized fitness programs for all levels. Join our community and achieve your fitness goals!',
        'image' => 'img/businesses/fitness-zone.jpg',
        'featured' => false,
        'location' => 'Othertown',
        'latitude' => '40.7282',
        'longitude' => '-73.9942',
        'hours' => [
            'monday' => '5:00 AM - 11:00 PM',
            'tuesday' => '5:00 AM - 11:00 PM',
            'wednesday' => '5:00 AM - 11:00 PM',
            'thursday' => '5:00 AM - 11:00 PM',
            'friday' => '5:00 AM - 10:00 PM',
            'saturday' => '7:00 AM - 8:00 PM',
            'sunday' => '7:00 AM - 8:00 PM'
        ],
        'features' => [
            'Cardio Equipment',
            'Free Weights',
            'Group Classes',
            'Personal Training',
            'Locker Rooms'
        ],
        'photos' => [
            'img/businesses/fitness-zone-1.jpg',
            'img/businesses/fitness-zone-2.jpg',
            'img/businesses/fitness-zone-3.jpg'
        ]
    ],
    [
        'id' => '4',
        'name' => 'Tech Gadgets',
        'category' => 'retail',
        'address' => '101 Pine St, Anytown, USA',
        'phone' => '(555) 456-7890',
        'email' => 'sales@techgadgets.com',
        'website' => 'https://www.techgadgets.com',
        'description' => 'Retailer of the latest tech gadgets, computers, and accessories. We offer a wide selection of smartphones, laptops, tablets, and smart home devices from all major brands. Our knowledgeable staff can help you find the perfect tech solution for your needs.',
        'image' => 'img/businesses/tech-gadgets.jpg',
        'featured' => true,
        'location' => 'Anytown',
        'latitude' => '40.7112',
        'longitude' => '-74.0055',
        'hours' => [
            'monday' => '10:00 AM - 9:00 PM',
            'tuesday' => '10:00 AM - 9:00 PM',
            'wednesday' => '10:00 AM - 9:00 PM',
            'thursday' => '10:00 AM - 9:00 PM',
            'friday' => '10:00 AM - 10:00 PM',
            'saturday' => '9:00 AM - 10:00 PM',
            'sunday' => '11:00 AM - 7:00 PM'
        ],
        'features' => [
            'Latest Gadgets',
            'Tech Support',
            'Trade-In Program',
            'Extended Warranties',
            'Custom Orders'
        ],
        'photos' => [
            'img/businesses/tech-gadgets-1.jpg',
            'img/businesses/tech-gadgets-2.jpg',
            'img/businesses/tech-gadgets-3.jpg'
        ]
    ],
    [
        'id' => '5',
        'name' => 'Clean & Shine',
        'category' => 'service',
        'address' => '202 Maple Ave, Othertown, USA',
        'phone' => '(555) 567-8901',
        'email' => 'info@cleanandshine.com',
        'website' => 'https://www.cleanandshine.com',
        'description' => 'Professional cleaning services for homes and businesses. We provide comprehensive cleaning solutions including regular maintenance, deep cleaning, and specialized services. Our team is trained, insured, and committed to delivering exceptional results.',
        'image' => 'img/businesses/clean-shine.jpg',
        'featured' => false,
        'location' => 'Othertown',
        'latitude' => '40.7225',
        'longitude' => '-73.9905',
        'hours' => [
            'monday' => '8:00 AM - 6:00 PM',
            'tuesday' => '8:00 AM - 6:00 PM',
            'wednesday' => '8:00 AM - 6:00 PM',
            'thursday' => '8:00 AM - 6:00 PM',
            'friday' => '8:00 AM - 6:00 PM',
            'saturday' => '9:00 AM - 3:00 PM',
            'sunday' => 'Closed'
        ],
        'features' => [
            'Residential Cleaning',
            'Commercial Cleaning',
            'Deep Cleaning',
            'Move-In/Move-Out',
            'Eco-Friendly Options'
        ],
        'photos' => [
            'img/businesses/clean-shine-1.jpg',
            'img/businesses/clean-shine-2.jpg',
            'img/businesses/clean-shine-3.jpg'
        ]
    ],
    [
        'id' => '6',
        'name' => 'Green Thumb Garden Center',
        'category' => 'retail',
        'address' => '505 Garden Way, Anytown, USA',
        'phone' => '(555) 678-9012',
        'email' => 'info@greenthumb.com',
        'website' => 'https://www.greenthumbgarden.com',
        'description' => 'Complete garden center offering plants, trees, shrubs, and gardening supplies. Our knowledgeable staff can help with plant selection, landscape design, and gardening advice. We carry organic and eco-friendly products for all your gardening needs.',
        'image' => 'img/businesses/green-thumb.jpg',
        'featured' => true,
        'location' => 'Anytown',
        'latitude' => '40.7150',
        'longitude' => '-74.0080',
        'hours' => [
            'monday' => '8:00 AM - 7:00 PM',
            'tuesday' => '8:00 AM - 7:00 PM',
            'wednesday' => '8:00 AM - 7:00 PM',
            'thursday' => '8:00 AM - 7:00 PM',
            'friday' => '8:00 AM - 7:00 PM',
            'saturday' => '8:00 AM - 6:00 PM',
            'sunday' => '9:00 AM - 5:00 PM'
        ],
        'features' => [
            'Indoor Plants',
            'Outdoor Plants',
            'Garden Supplies',
            'Landscape Design',
            'Seasonal Workshops'
        ],
        'photos' => [
            'img/businesses/green-thumb-1.jpg',
            'img/businesses/green-thumb-2.jpg',
            'img/businesses/green-thumb-3.jpg'
        ]
    ]
];

// Sample reviews data
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
    ],
    [
        'id' => '6',
        'business_id' => '6',
        'reviewer_name' => 'Lisa Thompson',
        'reviewer_email' => 'lisa@example.com',
        'rating' => 5,
        'title' => 'Amazing plant selection!',
        'content' => 'I found everything I needed for my garden here. The staff was incredibly knowledgeable and helped me choose the right plants for my space.',
        'date' => '2025-03-18T13:45:00',
        'approved' => true
    ],
    [
        'id' => '7',
        'business_id' => '5',
        'reviewer_name' => 'Robert Johnson',
        'reviewer_email' => 'robert@example.com',
        'rating' => 4,
        'title' => 'Thorough cleaning service',
        'content' => 'They did an excellent job cleaning my apartment. Very detail-oriented and professional. Will use their services again.',
        'date' => '2025-03-12T16:30:00',
        'approved' => true
    ]
];

// Write businesses data to file
$businessesResult = file_put_contents($businessesFile, json_encode($sampleBusinesses, JSON_PRETTY_PRINT));

// Write reviews data to file
$reviewsResult = file_put_contents($reviewsFile, json_encode($sampleReviews, JSON_PRETTY_PRINT));

// Check results
$result = [
    'success' => ($businessesResult !== false && $reviewsResult !== false),
    'businesses_file' => [
        'path' => realpath($businessesFile),
        'written' => $businessesResult !== false,
        'bytes' => $businessesResult
    ],
    'reviews_file' => [
        'path' => realpath($reviewsFile),
        'written' => $reviewsResult !== false,
        'bytes' => $reviewsResult
    ],
    'data_directory' => realpath('../../data')
];

echo json_encode($result, JSON_PRETTY_PRINT);
?>
