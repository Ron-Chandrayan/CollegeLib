<?php
session_start();

/**
 * VisitsManager - A PHP wrapper for managing visit tracking data
 * 
 * This class provides a clean interface for reading, writing, and managing
 * visit tracking data stored in a JSON file format.
 */
class VisitsManager {
    
    private $visitsFile;
    private $data;
    
    /**
     * Constructor
     * 
     * @param string $visitsFile Path to the visits.json file
     */
    public function __construct($visitsFile = 'visits.json') {
        $this->visitsFile = $visitsFile;
        $this->loadData();
    }
    
    /**
     * Load data from JSON file or initialize with default structure
     */
    private function loadData() {
        if (file_exists($this->visitsFile)) {
            $jsonData = file_get_contents($this->visitsFile);
            $this->data = json_decode($jsonData, true);
            
            if (!$this->data || !is_array($this->data)) {
                $this->initializeDefaultStructure();
            }
        } else {
            $this->initializeDefaultStructure();
        }
    }
    
    /**
     * Initialize default data structure
     */
    private function initializeDefaultStructure() {
        $this->data = [
            'summary' => [
                'total_visits' => 0,
                'unique_ips' => 0,
                'first_visit' => date('Y-m-d H:i:s'),
                'last_visit' => date('Y-m-d H:i:s'),
                'created_at' => date('Y-m-d H:i:s')
            ],
            'daily_stats' => [],
            'visits_log' => [],
            'ip_tracking' => [],
            'browser_stats' => [],
            'os_stats' => []
        ];
    }
    
    /**
     * Save data to JSON file
     * 
     * @return bool Success status
     */
    public function saveData() {
        $jsonData = json_encode($this->data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        return file_put_contents($this->visitsFile, $jsonData) !== false;
    }
    
    /**
     * Add a new visit entry
     * 
     * @param array $visitData Visit data array
     * @return bool Success status
     */
    public function addVisit($visitData) {
        // Validate required fields
        $requiredFields = ['ip_address', 'user_agent', 'browser', 'operating_system'];
        foreach ($requiredFields as $field) {
            if (!isset($visitData[$field])) {
                throw new InvalidArgumentException("Missing required field: {$field}");
            }
        }
        
        $currentTime = date('Y-m-d H:i:s');
        $currentDate = date('Y-m-d');
        
        // Create visit entry
        $visitEntry = [
            'id' => uniqid('visit_', true),
            'timestamp' => $currentTime,
            'date' => $currentDate,
            'ip_address' => $visitData['ip_address'],
            'user_agent' => $visitData['user_agent'],
            'browser' => $visitData['browser'],
            'operating_system' => $visitData['operating_system'],
            'referer' => $visitData['referer'] ?? 'Direct',
            'request_uri' => $visitData['request_uri'] ?? '/',
            'host' => $visitData['host'] ?? 'Unknown',
            'accept_language' => $visitData['accept_language'] ?? 'Unknown',
            'location' => $visitData['location'] ?? ['country' => 'Unknown', 'city' => 'Unknown', 'region' => 'Unknown'],
            'session_duration' => $visitData['session_duration'] ?? 0,
            'is_unique_visitor' => !isset($this->data['ip_tracking'][$visitData['ip_address']])
        ];
        
        // Update summary
        $this->data['summary']['total_visits']++;
        $this->data['summary']['last_visit'] = $currentTime;
        
        // Track unique IPs
        $this->updateIpTracking($visitEntry);
        
        // Update daily statistics
        $this->updateDailyStats($visitEntry);
        
        // Update browser and OS stats
        $this->updateBrowserOsStats($visitEntry);
        
        // Add to visits log
        $this->data['visits_log'][] = $visitEntry;
        
        // Clean up old data
        $this->cleanupOldData();
        
        return $this->saveData();
    }
    
    /**
     * Update IP tracking information
     * 
     * @param array $visitEntry Visit entry data
     */
    private function updateIpTracking($visitEntry) {
        $ip = $visitEntry['ip_address'];
        
        if (!isset($this->data['ip_tracking'][$ip])) {
            $this->data['ip_tracking'][$ip] = [
                'first_visit' => $visitEntry['timestamp'],
                'last_visit' => $visitEntry['timestamp'],
                'visit_count' => 1,
                'locations' => [$visitEntry['location']],
                'user_agents' => [$visitEntry['user_agent']]
            ];
            $this->data['summary']['unique_ips']++;
        } else {
            $this->data['ip_tracking'][$ip]['last_visit'] = $visitEntry['timestamp'];
            $this->data['ip_tracking'][$ip]['visit_count']++;
            
            // Add location if different
            $existingLocations = $this->data['ip_tracking'][$ip]['locations'];
            $locationExists = false;
            foreach ($existingLocations as $loc) {
                if ($loc['city'] === $visitEntry['location']['city'] && 
                    $loc['country'] === $visitEntry['location']['country']) {
                    $locationExists = true;
                    break;
                }
            }
            if (!$locationExists) {
                $this->data['ip_tracking'][$ip]['locations'][] = $visitEntry['location'];
            }
            
            // Add user agent if different
            if (!in_array($visitEntry['user_agent'], $this->data['ip_tracking'][$ip]['user_agents'])) {
                $this->data['ip_tracking'][$ip]['user_agents'][] = $visitEntry['user_agent'];
            }
        }
    }
    
    /**
     * Update daily statistics
     * 
     * @param array $visitEntry Visit entry data
     */
    private function updateDailyStats($visitEntry) {
        $date = $visitEntry['date'];
        
        if (!isset($this->data['daily_stats'][$date])) {
            $this->data['daily_stats'][$date] = [
                'total_visits' => 0,
                'unique_visitors' => 0,
                'browsers' => [],
                'operating_systems' => [],
                'countries' => []
            ];
        }
        
        $this->data['daily_stats'][$date]['total_visits']++;
        
        if ($visitEntry['is_unique_visitor']) {
            $this->data['daily_stats'][$date]['unique_visitors']++;
        }
        
        // Update browser stats for this day
        $browser = $visitEntry['browser'];
        if (!isset($this->data['daily_stats'][$date]['browsers'][$browser])) {
            $this->data['daily_stats'][$date]['browsers'][$browser] = 0;
        }
        $this->data['daily_stats'][$date]['browsers'][$browser]++;
        
        // Update OS stats for this day
        $os = $visitEntry['operating_system'];
        if (!isset($this->data['daily_stats'][$date]['operating_systems'][$os])) {
            $this->data['daily_stats'][$date]['operating_systems'][$os] = 0;
        }
        $this->data['daily_stats'][$date]['operating_systems'][$os]++;
        
        // Update country stats for this day
        $country = $visitEntry['location']['country'] ?? 'Unknown';
        if (!isset($this->data['daily_stats'][$date]['countries'][$country])) {
            $this->data['daily_stats'][$date]['countries'][$country] = 0;
        }
        $this->data['daily_stats'][$date]['countries'][$country]++;
    }
    
    /**
     * Update browser and OS statistics
     * 
     * @param array $visitEntry Visit entry data
     */
    private function updateBrowserOsStats($visitEntry) {
        // Update browser stats
        $browser = $visitEntry['browser'];
        if (!isset($this->data['browser_stats'][$browser])) {
            $this->data['browser_stats'][$browser] = 0;
        }
        $this->data['browser_stats'][$browser]++;
        
        // Update OS stats
        $os = $visitEntry['operating_system'];
        if (!isset($this->data['os_stats'][$os])) {
            $this->data['os_stats'][$os] = 0;
        }
        $this->data['os_stats'][$os]++;
    }
    
    /**
     * Clean up old data to prevent unlimited growth
     */
    private function cleanupOldData() {
        // Keep only last 1000 visits in detailed log
        if (count($this->data['visits_log']) > 1000) {
            $this->data['visits_log'] = array_slice($this->data['visits_log'], -1000);
        }
        
        // Keep only last 60 days of daily stats
        if (count($this->data['daily_stats']) > 60) {
            $this->data['daily_stats'] = array_slice($this->data['daily_stats'], -60, null, true);
        }
        
        // Keep only last 500 IP tracking entries
        if (count($this->data['ip_tracking']) > 500) {
            $this->data['ip_tracking'] = array_slice($this->data['ip_tracking'], -500, null, true);
            // Recalculate unique IPs count
            $this->data['summary']['unique_ips'] = count($this->data['ip_tracking']);
        }
    }
    
    /**
     * Get summary statistics
     * 
     * @return array Summary data
     */
    public function getSummary() {
        return $this->data['summary'];
    }
    
    /**
     * Get daily statistics
     * 
     * @param string|null $date Specific date (Y-m-d) or null for all
     * @return array Daily statistics
     */
    public function getDailyStats($date = null) {
        if ($date) {
            return $this->data['daily_stats'][$date] ?? [];
        }
        return $this->data['daily_stats'];
    }
    
    /**
     * Get visits log
     * 
     * @param int $limit Number of recent visits to return
     * @return array Visits log
     */
    public function getVisitsLog($limit = null) {
        $log = $this->data['visits_log'];
        if ($limit) {
            $log = array_slice($log, -$limit);
        }
        return $log;
    }
    
    /**
     * Get IP tracking data
     * 
     * @param string|null $ip Specific IP address or null for all
     * @return array IP tracking data
     */
    public function getIpTracking($ip = null) {
        if ($ip) {
            return $this->data['ip_tracking'][$ip] ?? [];
        }
        return $this->data['ip_tracking'];
    }
    
    /**
     * Get browser statistics
     * 
     * @return array Browser statistics
     */
    public function getBrowserStats() {
        return $this->data['browser_stats'];
    }
    
    /**
     * Get operating system statistics
     * 
     * @return array OS statistics
     */
    public function getOsStats() {
        return $this->data['os_stats'];
    }
    
    /**
     * Get today's statistics
     * 
     * @return array Today's statistics
     */
    public function getTodayStats() {
        $today = date('Y-m-d');
        return $this->getDailyStats($today);
    }
    
    /**
     * Get total visits count
     * 
     * @return int Total visits
     */
    public function getTotalVisits() {
        return $this->data['summary']['total_visits'];
    }
    
    /**
     * Get unique visitors count
     * 
     * @return int Unique visitors
     */
    public function getUniqueVisitors() {
        return $this->data['summary']['unique_ips'];
    }
    
    /**
     * Get most used browser
     * 
     * @return string|null Browser name or null if no data
     */
    public function getMostUsedBrowser() {
        if (empty($this->data['browser_stats'])) {
            return null;
        }
        return array_keys($this->data['browser_stats'], max($this->data['browser_stats']))[0];
    }
    
    /**
     * Get most used operating system
     * 
     * @return string|null OS name or null if no data
     */
    public function getMostUsedOs() {
        if (empty($this->data['os_stats'])) {
            return null;
        }
        return array_keys($this->data['os_stats'], max($this->data['os_stats']))[0];
    }
    
    /**
     * Get all data
     * 
     * @return array Complete data structure
     */
    public function getAllData() {
        return $this->data;
    }
    
    /**
     * Reset all data (dangerous operation)
     * 
     * @return bool Success status
     */
    public function resetData() {
        $this->initializeDefaultStructure();
        return $this->saveData();
    }
    
    /**
     * Export data to JSON string
     * 
     * @return string JSON formatted data
     */
    public function exportToJson() {
        return json_encode($this->data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }
    
    /**
     * Import data from JSON string
     * 
     * @param string $jsonData JSON data string
     * @return bool Success status
     */
    public function importFromJson($jsonData) {
        $data = json_decode($jsonData, true);
        if ($data && is_array($data)) {
            $this->data = $data;
            return $this->saveData();
        }
        return false;
    }
}

/**
 * Dashboard UI and Authentication functionality
 */

// Define the correct password (for "OSHO1977")
define('PASSWORD_PLAIN', 'OSHO1977');
// For better security, we should use password_hash, but for simplicity we'll use direct comparison

// Process login
$authenticated = false;
$loginError = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'login') {
        $password = $_POST['password'] ?? '';
        
        // Direct password comparison for simplicity
        if ($password === PASSWORD_PLAIN) {
            $_SESSION['authenticated'] = true;
            $authenticated = true;
        } else {
            $loginError = 'Invalid password. Please try again.';
        }
    } elseif (isset($_POST['action']) && $_POST['action'] === 'logout') {
        // Handle logout
        unset($_SESSION['authenticated']);
        session_destroy();
        $authenticated = false;
    }
} else {
    // Check if already authenticated
    $authenticated = isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true;
}

// Initialize visits manager and get data
$visitsManager = new VisitsManager('visits.json');
$summary = $visitsManager->getSummary();
$todayStats = $visitsManager->getTodayStats();
$totalVisits = $visitsManager->getTotalVisits();
$uniqueVisitors = $visitsManager->getUniqueVisitors();
$mostUsedBrowser = $visitsManager->getMostUsedBrowser() ?? 'Unknown';
$mostUsedOs = $visitsManager->getMostUsedOs() ?? 'Unknown';
$recentVisits = $visitsManager->getVisitsLog(10); // Get last 10 visits
$browserStats = $visitsManager->getBrowserStats();
$osStats = $visitsManager->getOsStats();
$dailyStats = $visitsManager->getDailyStats();

// Sort daily stats by date (newest first)
krsort($dailyStats);

// Prepare data for charts
$chartLabels = [];
$visitData = [];
$uniqueData = [];

// Get last 14 days for chart
$last14Days = array_slice($dailyStats, 0, 14, true);
krsort($last14Days);

foreach ($last14Days as $date => $stats) {
    $chartLabels[] = $date;
    $visitData[] = $stats['total_visits'];
    $uniqueData[] = $stats['unique_visitors'];
}

// Reverse arrays to show oldest first
$chartLabels = array_reverse($chartLabels);
$visitData = array_reverse($visitData);
$uniqueData = array_reverse($uniqueData);

// Output HTML
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visits Analytics Dashboard</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --primary-color: #4a6cf7;
            --secondary-color: #6c757d;
            --success-color: #28a745;
            --info-color: #17a2b8;
            --warning-color: #ffc107;
            --danger-color: #dc3545;
            --light-color: #f8f9fa;
            --dark-color: #343a40;
            --body-bg: #f5f8fb;
            --card-bg: #ffffff;
            --border-color: #e5e9f2;
            --text-color: #495057;
            --text-muted: #6c757d;
            --shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
            --shadow-lg: 0 1rem 3rem rgba(0, 0, 0, 0.175);
            --border-radius: 0.5rem;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--body-bg);
            color: var(--text-color);
            line-height: 1.6;
        }
        
        .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 2rem;
        }
        
        .login-card {
            background-color: var(--card-bg);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            width: 100%;
            max-width: 400px;
            padding: 2rem;
            text-align: center;
        }
        
        .login-logo {
            margin-bottom: 2rem;
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--primary-color);
        }
        
        .login-form input {
            width: 100%;
            padding: 0.75rem 1rem;
            margin-bottom: 1rem;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            font-size: 1rem;
            transition: border-color 0.3s, box-shadow 0.3s;
        }
        
        .login-form input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem rgba(74, 108, 247, 0.25);
        }
        
        .login-form button {
            width: 100%;
            padding: 0.75rem;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: var(--border-radius);
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .login-form button:hover {
            background-color: #3a57d5;
        }
        
        .login-error {
            color: var(--danger-color);
            margin-bottom: 1rem;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            margin-bottom: 2rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-color);
        }
        
        .logout-btn {
            padding: 0.5rem 1rem;
            background-color: var(--danger-color);
            color: white;
            border: none;
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .logout-btn:hover {
            background-color: #c82333;
        }
        
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .card {
            background-color: var(--card-bg);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            padding: 1.5rem;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-lg);
        }
        
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .card-title {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-muted);
            text-transform: uppercase;
        }
        
        .card-icon {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            color: white;
            font-size: 1.2rem;
        }
        
        .icon-primary {
            background-color: var(--primary-color);
        }
        
        .icon-success {
            background-color: var(--success-color);
        }
        
        .icon-info {
            background-color: var(--info-color);
        }
        
        .icon-warning {
            background-color: var(--warning-color);
        }
        
        .card-value {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        
        .card-label {
            font-size: 0.875rem;
            color: var(--text-muted);
        }
        
        .chart-container {
            background-color: var(--card-bg);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            padding: 1.5rem;
            margin-bottom: 2rem;
            height: 400px;
            position: relative;
        }
        
        .chart-container canvas {
            max-height: 300px !important;
        }
        
        .chart-header {
            margin-bottom: 1rem;
        }
        
        .chart-title {
            font-size: 1.25rem;
            font-weight: 600;
        }
        
        .table-container {
            background-color: var(--card-bg);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            padding: 1.5rem;
            margin-bottom: 2rem;
            overflow-x: auto;
        }
        
        .table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .table th,
        .table td {
            padding: 0.75rem 1rem;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }
        
        .table th {
            font-weight: 600;
            background-color: var(--light-color);
        }
        
        .table tbody tr:hover {
            background-color: rgba(74, 108, 247, 0.05);
        }
        
        .table-responsive {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }
        
        .badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .badge-primary {
            background-color: rgba(74, 108, 247, 0.1);
            color: var(--primary-color);
        }
        
        .badge-success {
            background-color: rgba(40, 167, 69, 0.1);
            color: var(--success-color);
        }
        
        .badge-info {
            background-color: rgba(23, 162, 184, 0.1);
            color: var(--info-color);
        }
        
        .badge-warning {
            background-color: rgba(255, 193, 7, 0.1);
            color: var(--warning-color);
        }
        
        .grid-2 {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
        }
        
        .grid-2 .chart-container {
            height: 350px;
        }
        
        .grid-2 .chart-container canvas {
            max-height: 250px !important;
        }
        
        @media (max-width: 768px) {
            .grid-2 {
                grid-template-columns: 1fr;
            }
            
            .container {
                padding: 0.5rem;
            }
            
            .dashboard {
                grid-template-columns: 1fr;
            }
            
            .card {
                padding: 1rem;
            }
            
            .chart-container {
                padding: 1rem;
                height: 300px;
            }
            
            .table-container {
                padding: 1rem;
            }
            
            .table {
                font-size: 0.875rem;
            }
            
            .table th,
            .table td {
                padding: 0.5rem;
            }
        }
        
        .footer {
            text-align: center;
            padding: 1.5rem 0;
            color: var(--text-muted);
            font-size: 0.875rem;
            border-top: 1px solid var(--border-color);
            margin-top: 2rem;
        }
        
        .pie-chart-container {
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
        }
        
        .pie-chart {
            flex: 1;
            min-width: 300px;
        }
        
        .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
            color: var(--text-muted);
        }
        
        .no-data {
            text-align: center;
            padding: 2rem;
            color: var(--text-muted);
        }
        
        .card-value.large {
            font-size: 2.5rem;
        }
        
        .badge.small {
            font-size: 0.65rem;
            padding: 0.2rem 0.4rem;
        }
        
        .truncate {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 200px;
        }
    </style>
</head>
<body>
    <?php if (!$authenticated): ?>
    <!-- Login Form -->
    <div class="login-container">
        <div class="login-card">
            <div class="login-logo">
                <i class="fas fa-chart-line"></i> Visits Analytics
            </div>
            <?php if ($loginError): ?>
                <div class="login-error"><?php echo htmlspecialchars($loginError); ?></div>
            <?php endif; ?>
            <form class="login-form" method="post">
                <input type="hidden" name="action" value="login">
                <input type="password" name="password" placeholder="Enter password" required>
                <button type="submit">Login</button>
            </form>
        </div>
    </div>
    <?php else: ?>
    <!-- Dashboard -->
    <div class="container">
        <div class="header">
            <div class="logo"><i class="fas fa-chart-line"></i> Visits Analytics Dashboard</div>
            <form method="post">
                <input type="hidden" name="action" value="logout">
                <button type="submit" class="logout-btn">Logout</button>
            </form>
        </div>
        
        <div class="dashboard">
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Total Visits</div>
                    <div class="card-icon icon-primary">
                        <i class="fas fa-eye"></i>
                    </div>
                </div>
                <div class="card-value"><?php echo number_format($totalVisits); ?></div>
                <div class="card-label">All time visits</div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Unique Visitors</div>
                    <div class="card-icon icon-success">
                        <i class="fas fa-users"></i>
                    </div>
                </div>
                <div class="card-value"><?php echo number_format($uniqueVisitors); ?></div>
                <div class="card-label">Unique IP addresses</div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Today's Visits</div>
                    <div class="card-icon icon-info">
                        <i class="fas fa-calendar-day"></i>
                    </div>
                </div>
                <div class="card-value"><?php echo number_format($todayStats['total_visits'] ?? 0); ?></div>
                <div class="card-label">Visits today</div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Popular Browser</div>
                    <div class="card-icon icon-warning">
                        <i class="fas fa-globe"></i>
                    </div>
                </div>
                <div class="card-value"><?php echo htmlspecialchars($mostUsedBrowser); ?></div>
                <div class="card-label">Most used browser</div>
            </div>
        </div>
        
        <div class="chart-container">
            <div class="chart-header">
                <h2 class="chart-title">Visit Trends (Last 14 Days)</h2>
            </div>
            <canvas id="visitsChart"></canvas>
        </div>
        
        <div class="grid-2">
            <div class="chart-container">
                <div class="chart-header">
                    <h2 class="chart-title">Browser Distribution</h2>
                </div>
                <canvas id="browserChart"></canvas>
            </div>
            
            <div class="chart-container">
                <div class="chart-header">
                    <h2 class="chart-title">Operating System Distribution</h2>
                </div>
                <canvas id="osChart"></canvas>
            </div>
        </div>
        
        <div class="table-container">
            <div class="chart-header">
                <h2 class="chart-title">Recent Visits</h2>
            </div>
            <div class="table-responsive">
                <table class="table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>IP Address</th>
                        <th>Location</th>
                        <th>Browser</th>
                        <th>OS</th>
                        <th>Referrer</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($recentVisits as $visit): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($visit['timestamp']); ?></td>
                        <td><?php echo htmlspecialchars($visit['ip_address']); ?></td>
                        <td>
                            <?php 
                            $location = $visit['location']['city'] ?? 'Unknown';
                            $location .= ', ' . ($visit['location']['country'] ?? 'Unknown');
                            echo htmlspecialchars($location); 
                            ?>
                        </td>
                        <td>
                            <span class="badge badge-primary">
                                <?php echo htmlspecialchars($visit['browser']); ?>
                            </span>
                        </td>
                        <td>
                            <span class="badge badge-info">
                                <?php echo htmlspecialchars($visit['operating_system']); ?>
                            </span>
                        </td>
                        <td><?php echo htmlspecialchars($visit['referer']); ?></td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            </div>
        </div>
        
        <div class="table-container">
            <div class="chart-header">
                <h2 class="chart-title">Daily Statistics</h2>
            </div>
            <div class="table-responsive">
                <table class="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Total Visits</th>
                        <th>Unique Visitors</th>
                        <th>Top Browser</th>
                        <th>Top OS</th>
                        <th>Top Country</th>
                    </tr>
                </thead>
                <tbody>
                    <?php 
                    // Display only last 10 days
                    $counter = 0;
                    foreach ($dailyStats as $date => $stats): 
                        if ($counter++ >= 10) break;
                    ?>
                    <tr>
                        <td><?php echo htmlspecialchars($date); ?></td>
                        <td><?php echo number_format($stats['total_visits']); ?></td>
                        <td><?php echo number_format($stats['unique_visitors']); ?></td>
                        <td>
                            <?php 
                            $topBrowser = !empty($stats['browsers']) ? array_keys($stats['browsers'], max($stats['browsers']))[0] : 'None';
                            ?>
                            <span class="badge badge-primary">
                                <?php echo htmlspecialchars($topBrowser); ?>
                            </span>
                        </td>
                        <td>
                            <?php 
                            $topOs = !empty($stats['operating_systems']) ? array_keys($stats['operating_systems'], max($stats['operating_systems']))[0] : 'None';
                            ?>
                            <span class="badge badge-info">
                                <?php echo htmlspecialchars($topOs); ?>
                            </span>
                        </td>
                        <td>
                            <?php 
                            $topCountry = !empty($stats['countries']) ? array_keys($stats['countries'], max($stats['countries']))[0] : 'None';
                            ?>
                            <span class="badge badge-success">
                                <?php echo htmlspecialchars($topCountry); ?>
                            </span>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            </div>
        </div>
        
        <div class="footer">
            &copy; <?php echo date('Y'); ?> Visits Analytics Dashboard | Powered by VisitsManager
        </div>
    </div>
    <?php endif; ?>
    
    <script>
        // Chart.js configurations
        document.addEventListener('DOMContentLoaded', function() {
            // Check if Chart.js is loaded
            if (typeof Chart === 'undefined') {
                console.error('Chart.js is not loaded');
                return;
            }
            
            // Visits trend chart
            const visitsCtx = document.getElementById('visitsChart');
            if (visitsCtx) {
                const chartData = <?php echo json_encode($visitData); ?>;
                const chartLabels = <?php echo json_encode($chartLabels); ?>;
                
                if (chartLabels.length === 0) {
                    visitsCtx.parentElement.innerHTML = '<div class="no-data"><i class="fas fa-chart-line fa-3x"></i><br><br>No data available for the chart</div>';
                } else {
                    new Chart(visitsCtx.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: chartLabels,
                        datasets: [
                            {
                                label: 'Total Visits',
                                data: chartData,
                                borderColor: '#4a6cf7',
                                backgroundColor: 'rgba(74, 108, 247, 0.1)',
                                borderWidth: 2,
                                tension: 0.3,
                                fill: true
                            },
                            {
                                label: 'Unique Visitors',
                                data: <?php echo json_encode($uniqueData); ?>,
                                borderColor: '#28a745',
                                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                                borderWidth: 2,
                                tension: 0.3,
                                fill: true
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            tooltip: {
                                mode: 'index',
                                intersect: false,
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    precision: 0
                                }
                            }
                        }
                    }
                });
                }
            }
            
            // Browser distribution chart
            const browserCtx = document.getElementById('browserChart');
            if (browserCtx) {
                const browserLabels = <?php echo json_encode(array_keys($browserStats)); ?>;
                const browserData = <?php echo json_encode(array_values($browserStats)); ?>;
                
                if (browserLabels.length === 0) {
                    browserCtx.parentElement.innerHTML = '<div class="no-data"><i class="fas fa-globe fa-3x"></i><br><br>No browser data available</div>';
                } else {
                    new Chart(browserCtx.getContext('2d'), {
                    type: 'doughnut',
                    data: {
                        labels: browserLabels,
                        datasets: [{
                            data: browserData,
                            backgroundColor: [
                                '#4a6cf7',
                                '#28a745',
                                '#17a2b8',
                                '#ffc107',
                                '#dc3545',
                                '#6c757d',
                                '#fd7e14',
                                '#20c997',
                                '#e83e8c',
                                '#6610f2'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right',
                            }
                        }
                    }
                });
                }
            }
            
            // OS distribution chart
            const osCtx = document.getElementById('osChart');
            if (osCtx) {
                const osLabels = <?php echo json_encode(array_keys($osStats)); ?>;
                const osData = <?php echo json_encode(array_values($osStats)); ?>;
                
                if (osLabels.length === 0) {
                    osCtx.parentElement.innerHTML = '<div class="no-data"><i class="fas fa-desktop fa-3x"></i><br><br>No OS data available</div>';
                } else {
                    new Chart(osCtx.getContext('2d'), {
                    type: 'doughnut',
                    data: {
                        labels: osLabels,
                        datasets: [{
                            data: osData,
                            backgroundColor: [
                                '#17a2b8',
                                '#28a745',
                                '#ffc107',
                                '#dc3545',
                                '#4a6cf7',
                                '#6c757d',
                                '#fd7e14',
                                '#20c997',
                                '#e83e8c',
                                '#6610f2'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right',
                            }
                        }
                    }
                });
                }
            }
        });
    </script>
</body>
</html>
<?php
// Stop PHP execution after rendering the page
exit; 