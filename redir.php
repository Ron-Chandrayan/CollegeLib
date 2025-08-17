<?php
// Visit counter functionality
$visits_file = 'visits.json';

// Function to get client IP address
function getClientIP() {
    $ip_keys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 
                'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 
                'REMOTE_ADDR'];
    
    foreach ($ip_keys as $key) {
        if (array_key_exists($key, $_SERVER) === true) {
            foreach (explode(',', $_SERVER[$key]) as $ip) {
                $ip = trim($ip);
                if (filter_var($ip, FILTER_VALIDATE_IP, 
                    FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                    return $ip;
                }
            }
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

// Function to get geolocation info (basic)
function getLocationInfo($ip) {
    if ($ip === 'unknown' || filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
        return ['country' => 'Unknown', 'city' => 'Unknown', 'region' => 'Unknown'];
    }
    
    // Using a simple IP API (you can replace with your preferred service)
    $api_url = "http://ip-api.com/json/{$ip}?fields=status,country,countryCode,region,regionName,city,timezone,isp,org";
    $context = stream_context_create(['http' => ['timeout' => 3]]);
    $response = @file_get_contents($api_url, false, $context);
    
    if ($response) {
        $data = json_decode($response, true);
        if ($data && $data['status'] === 'success') {
            return [
                'country' => $data['country'] ?? 'Unknown',
                'country_code' => $data['countryCode'] ?? 'Unknown',
                'region' => $data['regionName'] ?? 'Unknown',
                'city' => $data['city'] ?? 'Unknown',
                'timezone' => $data['timezone'] ?? 'Unknown',
                'isp' => $data['isp'] ?? 'Unknown',
                'org' => $data['org'] ?? 'Unknown'
            ];
        }
    }
    
    return ['country' => 'Unknown', 'city' => 'Unknown', 'region' => 'Unknown'];
}

// Initialize visits data structure
$visits_data = [
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

// Read existing data or create new file
if (file_exists($visits_file)) {
    $existing_data = json_decode(file_get_contents($visits_file), true);
    if ($existing_data && is_array($existing_data)) {
        $visits_data = array_merge($visits_data, $existing_data);
    }
}

// Collect current visit data
$current_time = date('Y-m-d H:i:s');
$current_date = date('Y-m-d');
$client_ip = getClientIP();
$user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
$referer = $_SERVER['HTTP_REFERER'] ?? 'Direct';
$request_uri = $_SERVER['REQUEST_URI'] ?? '/';
$host = $_SERVER['HTTP_HOST'] ?? 'Unknown';
$accept_language = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? 'Unknown';

// Get location info (with timeout to avoid delays)
$location_info = getLocationInfo($client_ip);

// Parse user agent for browser and OS info
function parseUserAgent($userAgent) {
    $browser = 'Unknown';
    $os = 'Unknown';
    
    // Browser detection
    if (strpos($userAgent, 'Chrome') !== false) $browser = 'Chrome';
    elseif (strpos($userAgent, 'Firefox') !== false) $browser = 'Firefox';
    elseif (strpos($userAgent, 'Safari') !== false) $browser = 'Safari';
    elseif (strpos($userAgent, 'Edge') !== false) $browser = 'Edge';
    elseif (strpos($userAgent, 'Opera') !== false) $browser = 'Opera';
    
    // OS detection
    if (strpos($userAgent, 'Windows NT 10') !== false) $os = 'Windows 10';
    elseif (strpos($userAgent, 'Windows NT 6.3') !== false) $os = 'Windows 8.1';
    elseif (strpos($userAgent, 'Windows NT 6.1') !== false) $os = 'Windows 7';
    elseif (strpos($userAgent, 'Mac OS X') !== false) $os = 'macOS';
    elseif (strpos($userAgent, 'Linux') !== false) $os = 'Linux';
    elseif (strpos($userAgent, 'Android') !== false) $os = 'Android';
    elseif (strpos($userAgent, 'iOS') !== false) $os = 'iOS';
    
    return ['browser' => $browser, 'os' => $os];
}

$ua_info = parseUserAgent($user_agent);

// Create detailed visit entry
$visit_entry = [
    'id' => uniqid('visit_', true),
    'timestamp' => $current_time,
    'date' => $current_date,
    'ip_address' => $client_ip,
    'user_agent' => $user_agent,
    'browser' => $ua_info['browser'],
    'operating_system' => $ua_info['os'],
    'referer' => $referer,
    'request_uri' => $request_uri,
    'host' => $host,
    'accept_language' => $accept_language,
    'location' => $location_info,
    'session_duration' => 0, // Could be calculated if tracking sessions
    'is_unique_visitor' => !isset($visits_data['ip_tracking'][$client_ip])
];

// Update summary statistics
$visits_data['summary']['total_visits']++;
$visits_data['summary']['last_visit'] = $current_time;

// Track unique IPs
if (!isset($visits_data['ip_tracking'][$client_ip])) {
    $visits_data['ip_tracking'][$client_ip] = [
        'first_visit' => $current_time,
        'last_visit' => $current_time,
        'visit_count' => 1,
        'locations' => [$location_info],
        'user_agents' => [$user_agent]
    ];
    $visits_data['summary']['unique_ips']++;
} else {
    $visits_data['ip_tracking'][$client_ip]['last_visit'] = $current_time;
    $visits_data['ip_tracking'][$client_ip]['visit_count']++;
    
    // Add location if different
    $existing_locations = $visits_data['ip_tracking'][$client_ip]['locations'];
    $location_exists = false;
    foreach ($existing_locations as $loc) {
        if ($loc['city'] === $location_info['city'] && $loc['country'] === $location_info['country']) {
            $location_exists = true;
            break;
        }
    }
    if (!$location_exists) {
        $visits_data['ip_tracking'][$client_ip]['locations'][] = $location_info;
    }
    
    // Add user agent if different
    if (!in_array($user_agent, $visits_data['ip_tracking'][$client_ip]['user_agents'])) {
        $visits_data['ip_tracking'][$client_ip]['user_agents'][] = $user_agent;
    }
}

// Update daily statistics
if (!isset($visits_data['daily_stats'][$current_date])) {
    $visits_data['daily_stats'][$current_date] = [
        'total_visits' => 0,
        'unique_visitors' => 0,
        'browsers' => [],
        'operating_systems' => [],
        'countries' => []
    ];
}

$visits_data['daily_stats'][$current_date]['total_visits']++;

if ($visit_entry['is_unique_visitor']) {
    $visits_data['daily_stats'][$current_date]['unique_visitors']++;
}

// Update browser stats
$browser = $ua_info['browser'];
if (!isset($visits_data['daily_stats'][$current_date]['browsers'][$browser])) {
    $visits_data['daily_stats'][$current_date]['browsers'][$browser] = 0;
}
$visits_data['daily_stats'][$current_date]['browsers'][$browser]++;

if (!isset($visits_data['browser_stats'][$browser])) {
    $visits_data['browser_stats'][$browser] = 0;
}
$visits_data['browser_stats'][$browser]++;

// Update OS stats
$os = $ua_info['os'];
if (!isset($visits_data['daily_stats'][$current_date]['operating_systems'][$os])) {
    $visits_data['daily_stats'][$current_date]['operating_systems'][$os] = 0;
}
$visits_data['daily_stats'][$current_date]['operating_systems'][$os]++;

if (!isset($visits_data['os_stats'][$os])) {
    $visits_data['os_stats'][$os] = 0;
}
$visits_data['os_stats'][$os]++;

// Update country stats
$country = $location_info['country'] ?? 'Unknown';
if (!isset($visits_data['daily_stats'][$current_date]['countries'][$country])) {
    $visits_data['daily_stats'][$current_date]['countries'][$country] = 0;
}
$visits_data['daily_stats'][$current_date]['countries'][$country]++;

// Add visit to log
$visits_data['visits_log'][] = $visit_entry;

// Keep only last 1000 visits in detailed log to prevent file from getting too large
if (count($visits_data['visits_log']) > 1000) {
    $visits_data['visits_log'] = array_slice($visits_data['visits_log'], -1000);
}

// Keep only last 60 days of daily stats
if (count($visits_data['daily_stats']) > 60) {
    $visits_data['daily_stats'] = array_slice($visits_data['daily_stats'], -60, null, true);
}

// Keep only last 500 IP tracking entries to prevent unlimited growth
if (count($visits_data['ip_tracking']) > 500) {
    $visits_data['ip_tracking'] = array_slice($visits_data['ip_tracking'], -500, null, true);
    // Recalculate unique IPs count
    $visits_data['summary']['unique_ips'] = count($visits_data['ip_tracking']);
}

// Save updated data
file_put_contents($visits_file, json_encode($visits_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

// Variables for display
$total_visits = $visits_data['summary']['total_visits'];
$today_visits = $visits_data['daily_stats'][$current_date]['total_visits'] ?? 0;
$unique_visitors = $visits_data['summary']['unique_ips'];
$top_browser = '';
$top_os = '';

if (!empty($visits_data['browser_stats'])) {
    $top_browser = array_keys($visits_data['browser_stats'], max($visits_data['browser_stats']))[0];
}

if (!empty($visits_data['os_stats'])) {
    $top_os = array_keys($visits_data['os_stats'], max($visits_data['os_stats']))[0];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="4;url=https://library-sies-92fbc1e81669.herokuapp.com/" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>EthicCode Technology Software Systems - Browser Management Portal</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: #000080;
      background-image: 
        radial-gradient(circle at 25% 25%, #000099 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, #000066 0%, transparent 50%);
      color: #ffffff;
      font-family: 'Courier New', 'MS Sans Serif', monospace;
      font-size: 12px;
      line-height: 1.4;
      overflow-x: hidden;
    }

    .main-container {
      width: 100%;
      max-width: 1024px;
      margin: 0 auto;
      background: #c0c0c0;
      border: 2px outset #c0c0c0;
      min-height: 100vh;
    }

    .title-bar {
      background: linear-gradient(90deg, #0080ff 0%, #0060df 100%);
      color: white;
      padding: 4px 8px;
      font-weight: bold;
      border-bottom: 1px solid #000080;
      font-size: 11px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .window-icon {
      width: 16px;
      height: 16px;
      background: #ffff00;
      border: 1px solid #000000;
      display: inline-block;
    }

    .header-section {
      background: #c0c0c0;
      padding: 20px;
      border-bottom: 2px inset #c0c0c0;
      text-align: center;
    }

    .company-logo {
      font-size: 28px;
      font-weight: bold;
      color: #000080;
      text-shadow: 2px 2px 0px #ffffff;
      margin-bottom: 5px;
      font-family: 'Times New Roman', serif;
      letter-spacing: 2px;
    }

    .company-tagline {
      font-size: 11px;
      color: #800000;
      font-weight: bold;
      margin-bottom: 15px;
      text-transform: uppercase;
    }

    .established {
      background: #000080;
      color: #ffff00;
      padding: 2px 8px;
      font-size: 10px;
      font-weight: bold;
      display: inline-block;
      border: 1px solid #000000;
      margin-bottom: 10px;
    }

    .main-content {
      background: #c0c0c0;
      padding: 20px;
      color: #000000;
    }

    .warning-box {
      background: #ffff00;
      border: 3px solid #ff0000;
      padding: 15px;
      margin-bottom: 20px;
      font-weight: bold;
      color: #000000;
      text-align: center;
      animation: blink 2s infinite;
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0.7; }
    }

    .status-panel {
      background: #808080;
      border: 2px inset #c0c0c0;
      padding: 15px;
      margin-bottom: 20px;
      font-family: 'Courier New', monospace;
    }

    .status-title {
      color: #ffffff;
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 14px;
      text-decoration: underline;
    }

    .status-line {
      color: #00ff00;
      font-size: 11px;
      margin-bottom: 3px;
      font-family: 'Courier New', monospace;
    }

    .stats-table {
      width: 100%;
      border: 2px inset #c0c0c0;
      border-collapse: collapse;
      margin-bottom: 20px;
      background: #ffffff;
    }

    .stats-table th {
      background: #000080;
      color: #ffffff;
      padding: 8px;
      border: 1px solid #000000;
      font-weight: bold;
      font-size: 11px;
    }

    .stats-table td {
      padding: 8px;
      border: 1px solid #808080;
      text-align: center;
      font-weight: bold;
      color: #000080;
    }

    .redirect-panel {
      background: #008080;
      border: 3px outset #008080;
      padding: 20px;
      text-align: center;
      margin-bottom: 20px;
      color: #ffffff;
    }

    .redirect-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      text-shadow: 1px 1px 0px #000000;
    }

    .countdown-display {
      background: #000000;
      color: #00ff00;
      padding: 10px;
      font-family: 'Courier New', monospace;
      font-size: 24px;
      font-weight: bold;
      border: 2px inset #c0c0c0;
      margin: 10px 0;
      text-align: center;
    }

    .progress-container {
      background: #808080;
      border: 2px inset #c0c0c0;
      padding: 5px;
      margin: 15px 0;
    }

    .progress-bar {
      background: #000000;
      height: 20px;
      border: 1px solid #ffffff;
      position: relative;
      overflow: hidden;
    }

    .progress-fill {
      background: #00ff00;
      height: 100%;
      width: 0%;
      animation: progress 4s linear forwards;
      position: relative;
    }

    .progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(
        90deg,
        transparent 0px,
        transparent 2px,
        rgba(255,255,255,0.3) 2px,
        rgba(255,255,255,0.3) 4px
      );
    }

    @keyframes progress {
      to { width: 100%; }
    }

    .button-container {
      text-align: center;
      margin: 20px 0;
    }

    .retro-button {
      background: #c0c0c0;
      border: 2px outset #c0c0c0;
      padding: 8px 16px;
      font-family: 'MS Sans Serif', sans-serif;
      font-size: 11px;
      font-weight: bold;
      color: #000000;
      text-decoration: none;
      display: inline-block;
      cursor: pointer;
    }

    .retro-button:hover {
      background: #e0e0e0;
    }

    .retro-button:active {
      border: 2px inset #c0c0c0;
    }

    .info-panel {
      background: #ffffff;
      border: 2px inset #c0c0c0;
      padding: 15px;
      margin-bottom: 20px;
      color: #000000;
    }

    .info-title {
      color: #000080;
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 10px;
      text-decoration: underline;
    }

    .info-text {
      font-size: 11px;
      line-height: 1.5;
      margin-bottom: 8px;
    }

    .footer-bar {
      background: #808080;
      border-top: 2px inset #c0c0c0;
      padding: 8px 20px;
      color: #ffffff;
      font-size: 10px;
      text-align: center;
    }

    .marquee {
      background: #000080;
      color: #ffff00;
      padding: 5px;
      font-weight: bold;
      font-size: 11px;
      white-space: nowrap;
      overflow: hidden;
      border: 1px solid #000000;
      margin: 10px 0;
    }

    .marquee-text {
      display: inline-block;
      animation: scroll 15s linear infinite;
    }

    @keyframes scroll {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }

    .blinking {
      animation: blink-text 1s infinite;
    }

    @keyframes blink-text {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }

    @media (max-width: 768px) {
      .main-container {
        margin: 0;
        border: none;
      }
      
      .company-logo {
        font-size: 20px;
      }
      
      .countdown-display {
        font-size: 18px;
      }
    }
  </style>
</head>
<body>
  <div class="main-container">
    <div class="title-bar">
      <span class="window-icon"></span>
      EthicCode Browser Management System v2.1 - [ACTIVE SESSION]
    </div>

    <div class="header-section">
      <div class="company-logo">ETHICCODE TECHNOLOGY SOFTWARE SYSTEMS</div>
      <div class="company-tagline">Professional Software Solutions Since 1987</div>
      <div class="established">★ ESTABLISHED 1987 ★ TRUSTED WORLDWIDE ★</div>
      
      <div class="marquee">
        <div class="marquee-text">
          ★★★ Welcome to EthicCode Technology Software Systems - We Manage This Browser - Your Trusted Computing Partner ★★★
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="warning-box">
        <strong>⚠ NOTICE: WE MANAGE THIS BROWSER ⚠</strong><br>
        This browser session is managed by EthicCode Technology Software Systems
      </div>

      <div class="status-panel">
        <div class="status-title">═══ SYSTEM STATUS REPORT ═══</div>
        <div class="status-line">► Browser Management: ACTIVE</div>
        <div class="status-line">► Session Control: ENABLED</div>
        <div class="status-line">► Redirect Service: OPERATIONAL</div>
        <div class="status-line">► Security Protocol: ETHICCODE-SSL-2000</div>
        <div class="status-line">► Current Time: <?php echo date('Y-m-d H:i:s'); ?></div>
      </div>

      <table class="stats-table">
        <tr>
          <th>TOTAL SESSIONS</th>
          <th>TODAY'S SESSIONS</th>
          <th>UNIQUE VISITORS</th>
          <th>SYSTEM STATUS</th>
        </tr>
        <tr>
          <td><?php echo number_format($total_visits); ?></td>
          <td><?php echo $today_visits; ?></td>
          <td><?php echo number_format($unique_visitors); ?></td>
          <td class="blinking">ONLINE</td>
        </tr>
      </table>

      <div class="info-panel">
        <div class="info-title">═══ CURRENT SESSION DETAILS ═══</div>
        <div class="info-text">
          <strong>IP Address:</strong> <?php echo htmlspecialchars($client_ip); ?> | 
          <strong>Location:</strong> <?php echo htmlspecialchars($location_info['city'] . ', ' . $location_info['country']); ?>
        </div>
        <div class="info-text">
          <strong>Browser:</strong> <?php echo htmlspecialchars($ua_info['browser']); ?> | 
          <strong>Operating System:</strong> <?php echo htmlspecialchars($ua_info['os']); ?>
        </div>
        <div class="info-text">
          <strong>Session ID:</strong> <?php echo htmlspecialchars($visit_entry['id']); ?> | 
          <strong>Timestamp:</strong> <?php echo $current_time; ?>
        </div>
        <?php if (!empty($top_browser) || !empty($top_os)): ?>
        <div class="info-text">
          <strong>Most Used Browser:</strong> <?php echo htmlspecialchars($top_browser); ?> | 
          <strong>Most Used OS:</strong> <?php echo htmlspecialchars($top_os); ?>
        </div>
        <?php endif; ?>
      </div>

      <div class="redirect-panel">
        <div class="redirect-title">═══ AUTOMATIC REDIRECT IN PROGRESS ═══</div>
        <p>EthicCode Technology Software Systems is redirecting you to:</p>
        <p><strong>SIES Library Management System</strong></p>
        
        <div class="countdown-display" id="countdown">10</div>
        
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
        </div>
      </div>

      <div class="info-panel">
        <div class="info-title">About EthicCode Technology Software Systems</div>
        <div class="info-text">
          <strong>Founded in 1987</strong>, EthicCode Technology Software Systems has been a leading provider of enterprise software solutions for over three decades. Our cutting-edge browser management technology ensures seamless user experiences across all computing platforms.
        </div>
        <div class="info-text">
          <strong>Services Include:</strong> Browser Management • Session Control • Automated Redirections • System Integration • Enterprise Solutions • Y2K Compliance • Network Administration
        </div>
        <div class="info-text">
          <strong>Certifications:</strong> ISO 9001:2000 • Microsoft Certified Partner • Novell Authorized • CompTIA A+ Certified Technicians
        </div>
      </div>

      <div class="button-container">
        <a href="https://library-sies-92fbc1e81669.herokuapp.com/" class="retro-button">
          ► SKIP REDIRECT - GO NOW ◄
        </a>
      </div>
    </div>

    <div class="footer-bar">
      Copyright © 1987-2025 EthicCode Technology Software Systems, Inc. All Rights Reserved. | 
      Patent Pending | This browser session is managed by EthicCode Technology Software Systems
    </div>
  </div>

  <script>
    // Countdown timer
    let countdown = 4;
    const countdownElement = document.getElementById('countdown');
    
    function updateCountdown() {
      countdownElement.textContent = countdown.toString().padStart(2, '0');
    }
    
    const timer = setInterval(() => {
      countdown--;
      updateCountdown();
      
      if (countdown <= 0) {
        clearInterval(timer);
        countdownElement.textContent = '00';
      }
    }, 1000);

    // Add some retro sound effects simulation
    document.addEventListener('click', function() {
      // Visual feedback for clicks
      document.body.style.backgroundColor = '#000099';
      setTimeout(() => {
        document.body.style.backgroundColor = '';
      }, 100);
    });

    // Simulate old computer processing
    setTimeout(() => {
      console.log('EthicCode Technology Software Systems - Browser Management Active');
      console.log('Session initialized at: ' + new Date().toISOString());
      console.log('Redirect protocol: ETHICCODE-REDIRECT-v2.1');
    }, 1000);
  </script>
</body>
</html>