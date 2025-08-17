<?php
// Include the VisitsManager class
require_once 'VisitsManager.php';

// Initialize the visits manager
$visitsManager = new VisitsManager('visits.json');

echo "=== VisitsManager Example Usage ===\n\n";

// Get current statistics
echo "Current Statistics:\n";
echo "Total Visits: " . $visitsManager->getTotalVisits() . "\n";
echo "Unique Visitors: " . $visitsManager->getUniqueVisitors() . "\n";
echo "Most Used Browser: " . ($visitsManager->getMostUsedBrowser() ?? 'None') . "\n";
echo "Most Used OS: " . ($visitsManager->getMostUsedOs() ?? 'None') . "\n\n";

// Get today's statistics
$todayStats = $visitsManager->getTodayStats();
echo "Today's Statistics:\n";
if (!empty($todayStats)) {
    echo "Today's Visits: " . ($todayStats['total_visits'] ?? 0) . "\n";
    echo "Today's Unique Visitors: " . ($todayStats['unique_visitors'] ?? 0) . "\n";
    
    if (!empty($todayStats['browsers'])) {
        echo "Today's Browsers: " . implode(', ', array_keys($todayStats['browsers'])) . "\n";
    }
    
    if (!empty($todayStats['countries'])) {
        echo "Today's Countries: " . implode(', ', array_keys($todayStats['countries'])) . "\n";
    }
} else {
    echo "No visits today yet.\n";
}
echo "\n";

// Get recent visits (last 5)
$recentVisits = $visitsManager->getVisitsLog(5);
echo "Recent Visits (Last 5):\n";
foreach ($recentVisits as $visit) {
    echo "- " . $visit['timestamp'] . " | " . $visit['ip_address'] . " | " . $visit['browser'] . " | " . $visit['location']['city'] . ", " . $visit['location']['country'] . "\n";
}
echo "\n";

// Get browser statistics
$browserStats = $visitsManager->getBrowserStats();
echo "Browser Statistics:\n";
foreach ($browserStats as $browser => $count) {
    echo "- $browser: $count visits\n";
}
echo "\n";

// Get OS statistics
$osStats = $visitsManager->getOsStats();
echo "Operating System Statistics:\n";
foreach ($osStats as $os => $count) {
    echo "- $os: $count visits\n";
}
echo "\n";

// Example: Add a new visit (uncomment to test)
/*
echo "Adding a new test visit...\n";
$newVisitData = [
    'ip_address' => '192.168.1.100',
    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'browser' => 'Chrome',
    'operating_system' => 'Windows 10',
    'referer' => 'https://example.com',
    'request_uri' => '/test-page',
    'host' => 'example.com',
    'accept_language' => 'en-US,en;q=0.9',
    'location' => [
        'country' => 'United States',
        'country_code' => 'US',
        'region' => 'California',
        'city' => 'San Francisco',
        'timezone' => 'America/Los_Angeles',
        'isp' => 'Example ISP',
        'org' => 'Example Organization'
    ]
];

if ($visitsManager->addVisit($newVisitData)) {
    echo "Visit added successfully!\n";
    echo "New total visits: " . $visitsManager->getTotalVisits() . "\n";
} else {
    echo "Failed to add visit.\n";
}
*/

// Export current data to JSON (for backup or analysis)
echo "Exporting current data to JSON...\n";
$jsonExport = $visitsManager->exportToJson();
file_put_contents('visits_backup_' . date('Y-m-d_H-i-s') . '.json', $jsonExport);
echo "Backup created: visits_backup_" . date('Y-m-d_H-i-s') . ".json\n\n";

echo "=== Example completed ===\n";
?> 