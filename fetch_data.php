<?php

$servername = "localhost";
$username = "root";
$password = "";
$database = "businessdb";

// $servername = "10.200.168.89";
// $username   = "supersu";
// $password   = "H110mds2!";
// $database   = "database_rda";



// Connect

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// ✅ ADD THIS: Handle dynamic Team Member filtering via action
if (isset($_GET['action'])) {
    $action = $_GET['action'];

    // 🔁 List all unique supervisors for the dropdown
    if ($action === 'list_names') {
        $result = $conn->query("SELECT DISTINCT SUPERVISOR FROM employee_listings WHERE SUPERVISOR != '' ORDER BY SUPERVISOR ASC");
        $supervisors = [];
        while ($row = $result->fetch_assoc()) {
            $supervisors[] = $row['SUPERVISOR'];
        }
        header('Content-Type: application/json');
        echo json_encode($supervisors);
        $conn->close();
        exit;
    }

    // 🔁 Filter employees by selected supervisor
    if ($action === 'filter' && isset($_GET['name'])) {
        $supervisor = $conn->real_escape_string($_GET['name']);
        $sql = "SELECT EDS, FULLNAME, PROJECT, POSITION, SITE, SUPERVISOR, emp_status, DATEHIRED 
                FROM employee_listings 
                WHERE SUPERVISOR = '$supervisor'";
        $result = $conn->query($sql);
        $employees = [];
        while ($row = $result->fetch_assoc()) {
            $employees[] = $row;
        }
        header('Content-Type: application/json');
        echo json_encode($employees);
        $conn->close();
        exit;
    }
}

// ---------------- YOUR ORIGINAL LOGIC BELOW ----------------

// Get date range and entity from the request
$startDate = isset($_GET['startDate']) ? $_GET['startDate'] : null;
$endDate = isset($_GET['endDate']) ? $_GET['endDate'] : null;
$entity = isset($_GET['entity']) ? $_GET['entity'] : 'ALL';

// If no date range is selected, default to current year
if (!$startDate || !$endDate) {
    $startDate = date('Y') . '-01-01';
    $endDate = date('Y') . '-12-31';
}

$data = [];

// Define the entity filter
$entityFilter = '';
$params = [];
$types = '';

if ($entity === 'LHI') {
    $entityFilter = " AND PROJECT IN (?, ?)";
    $params = ["ADMIN, LHI", "LHI"];
    $types = 'ss';
} elseif ($entity === 'BPS') {
    $entityFilter = " AND PROJECT NOT IN (?, ?)";
    $params = ["ADMIN, LHI", "LHI"];
    $types = 'ss';
}
// If entity is 'ALL', no filter is applied

// --- ACTIVE count ---
if ($entity === 'ALL') {
    $stmt = $conn->prepare("SELECT COUNT(EDS) AS total_active 
                            FROM employee_listings 
                            WHERE emp_status = 'ACTIVE'");
} else {
    $stmt = $conn->prepare("SELECT COUNT(EDS) AS total_active 
                            FROM employee_listings 
                            WHERE emp_status = 'ACTIVE' $entityFilter");
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$resultActive = $stmt->get_result();
$stmt->close();

$data['ACTIVE'] = ($resultActive && $resultActive->num_rows > 0) 
    ? (int)$resultActive->fetch_assoc()["total_active"] 
    : 0;

// --- INACTIVE count filtered by dateresigned ---
if ($entity === 'ALL') {
    $stmt = $conn->prepare("SELECT COUNT(EDS) AS total_inactive_year 
                            FROM employee_listings 
                            WHERE emp_status = 'INACTIVE' 
                            AND dateresigned BETWEEN ? AND ?");
    $stmt->bind_param("ss", $startDate, $endDate);
} else {
    $stmt = $conn->prepare("SELECT COUNT(EDS) AS total_inactive_year 
                            FROM employee_listings 
                            WHERE emp_status = 'INACTIVE' 
                            AND dateresigned BETWEEN ? AND ? $entityFilter");
    $stmt->bind_param("ss" . $types, $startDate, $endDate, ...$params);
}
$stmt->execute();
$resultInactive = $stmt->get_result();
$stmt->close();

$data['INACTIVE_CURRENT_YEAR'] = ($resultInactive && $resultInactive->num_rows > 0) 
    ? (int)$resultInactive->fetch_assoc()["total_inactive_year"] 
    : 0;

// --- NEWHIRES count filtered by datehired ---
if ($entity === 'ALL') {
    $stmt = $conn->prepare("SELECT COUNT(EDS) AS total_newhires_year 
                            FROM employee_listings 
                            WHERE emp_status = 'ACTIVE' 
                            AND datehired BETWEEN ? AND ?");
    $stmt->bind_param("ss", $startDate, $endDate);
} else {
    $stmt = $conn->prepare("SELECT COUNT(EDS) AS total_newhires_year 
                            FROM employee_listings 
                            WHERE emp_status = 'ACTIVE' 
                            AND datehired BETWEEN ? AND ? $entityFilter");
    $stmt->bind_param("ss" . $types, $startDate, $endDate, ...$params);
}
$stmt->execute();
$resultNewHires = $stmt->get_result();
$stmt->close();

$data['NEWHIRES_CURRENT_YEAR'] = ($resultNewHires && $resultNewHires->num_rows > 0) 
    ? (int)$resultNewHires->fetch_assoc()["total_newhires_year"] 
    : 0;

// --- LATEST 10 EMPLOYEES ---
$sqlLatestEmployees = "SELECT * FROM employee_listings WHERE EDS<50000 ORDER BY EDS DESC LIMIT 10";
$resultLatest = $conn->query($sqlLatestEmployees);

$latestEmployees = [];

if ($resultLatest && $resultLatest->num_rows > 0) {
    while ($row = $resultLatest->fetch_assoc()) {
        $latestEmployees[] = [
            'EDS' => $row['EDS'],
            'FULLNAME' => $row['FULLNAME'],
            'PROJECT' => $row['PROJECT'],
            'POSITION' => $row['POSITION'],
            'SITE' => $row['SITE'],
            'SUPERVISOR' => $row['SUPERVISOR'],
            'STATUS' => $row['emp_status'],
            'HIREDDATE' => isset($row['DATEHIRED']) ? date('m-d-Y', strtotime($row['DATEHIRED'])) : "",
            'RESIGNEDDATE' => isset($row['DATERESIGNED']) ? date('m-d-Y',strtotime($row['DATERESIGNED'])) : "",
        ];
    }
}

// --- ACTIVE EMPLOYEES SUM BY PROJECT & SITE ---
$sqlProjectSummary = "SELECT PROJECT, SITE, COUNT(*) AS EMPLOYEECOUNT 
                      FROM employee_listings 
                      WHERE emp_status = 'ACTIVE' 
                      GROUP BY PROJECT, SITE 
                      ORDER BY SITE, PROJECT";
$resultProjectSummary = $conn->query($sqlProjectSummary);

$projectSummary = [];

if ($resultProjectSummary && $resultProjectSummary->num_rows > 0) {
    while ($row = $resultProjectSummary->fetch_assoc()) {
        $projectSummary[] = [
            'PROJECT' => $row['PROJECT'],
            'EMPLOYEECOUNT' => (int)$row['EMPLOYEECOUNT'],
            'SITE' => $row['SITE']
        ];
    }
}

$data['PROJECT_EMPLOYEE_SUMMARY'] = $projectSummary;
$data['LATEST_EMPLOYEES'] = $latestEmployees;

// Return JSON
header('Content-Type: application/json');
echo json_encode($data);

$conn->close();
?>
