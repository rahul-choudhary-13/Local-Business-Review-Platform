<?php
header('Content-Type: application/json');

// Set up error handling
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Define data file paths
$businessesFile = '../../data/businesses.json';
$reviewsFile = '../../data/reviews.json';

// Check if data directory exists
$dataDirectoryExists = file_exists('../../data');

// Check if data files exist
$businessesFileExists = file_exists($businessesFile);
$reviewsFileExists = file_exists($reviewsFile);

// Check file permissions
$dataDirectoryWritable = is_writable('../../data');
$businessesFileWritable = $businessesFileExists ? is_writable($businessesFile) : false;
$reviewsFileWritable = $reviewsFileExists ? is_writable($reviewsFile) : false;

// Try to load businesses data
$businessesData = null;
$businessesError = null;
if ($businessesFileExists) {
    try {
        $businessesData = json_decode(file_get_contents($businessesFile), true);
    } catch (Exception $e) {
        $businessesError = $e->getMessage();
    }
}

// Try to load reviews data
$reviewsData = null;
$reviewsError = null;
if ($reviewsFileExists) {
    try {
        $reviewsData = json_decode(file_get_contents($reviewsFile), true);
    } catch (Exception $e) {
        $reviewsError = $e->getMessage();
    }
}

// Create debug info
$debugInfo = [
    'server' => [
        'php_version' => PHP_VERSION,
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'document_root' => $_SERVER['DOCUMENT_ROOT'],
        'script_filename' => $_SERVER['SCRIPT_FILENAME'],
    ],
    'data_directory' => [
        'exists' => $dataDirectoryExists,
        'writable' => $dataDirectoryWritable,
        'path' => realpath('../../data'),
    ],
    'businesses_file' => [
        'exists' => $businessesFileExists,
        'writable' => $businessesFileWritable,
        'path' => realpath($businessesFile),
        'size' => $businessesFileExists ? filesize($businessesFile) : 0,
        'error' => $businessesError,
        'data_count' => is_array($businessesData) ? count($businessesData) : 0,
    ],
    'reviews_file' => [
        'exists' => $reviewsFileExists,
        'writable' => $reviewsFileWritable,
        'path' => realpath($reviewsFile),
        'size' => $reviewsFileExists ? filesize($reviewsFile) : 0,
        'error' => $reviewsError,
        'data_count' => is_array($reviewsData) ? count($reviewsData) : 0,
    ],
];

// Output debug info
echo json_encode($debugInfo, JSON_PRETTY_PRINT);
?>
