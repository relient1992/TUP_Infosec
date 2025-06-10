<?php
//testing
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method.'
    ]);
    exit;
}

$servername = "10.200.168.89";
$username   = "supersu";
$password   = "H110mds2!";
$database   = "database_rda";
$charset = "utf8mb4";

// Database connection
// $servername = "localhost";
// $username = "root";
// $password = "";
// $database = "businessdb";
// $charset = "utf8mb4";

$dsn = "mysql:host=$servername;dbname=$database;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (\PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit;
}

// Validate POST data
if (!isset($_POST['employee_id'], $_POST['password'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields.'
    ]);
    exit;
}

$employee_id = $_POST['employee_id'];
$password = $_POST['password'];

// Check if the Employee ID already exists
$stmt = $pdo->prepare("SELECT * FROM user_accounts WHERE employee_id = ?");
$stmt->execute([$employee_id]);
$user = $stmt->fetch();

if ($user) {
    echo json_encode([
        'status' => 'error',
        'message' => 'This Employee ID is already used.'
    ]);
    exit;
}

// Hash and insert into user_accounts
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$insert = $pdo->prepare("INSERT INTO user_accounts (employee_id, password) VALUES (?, ?)");
$insert->execute([$employee_id, $hashed_password]);

// Insert default role into user_roles
$insertRole = $pdo->prepare("INSERT INTO user_roles (employee_id, role_id) VALUES (?, ?)");
$insertRole->execute([$employee_id, 2]);

echo json_encode([
    'status' => 'success',
    'message' => 'Registration successful!'
]);
?>