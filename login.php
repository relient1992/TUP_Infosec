<?php
session_start();

$servername = "10.200.168.89";
$username   = "supersu";
$password   = "H110mds2!";
$database   = "database_rda";

// $servername = "localhost";
// $username = "root";
// $password = "";
// $database = "businessdb";

// Create DB connection
// $conn = new mysqli($servername, $username, $password, $database);
// if ($conn->connect_error) {
//     die("Connection failed: " . $conn->connect_error);
// }
// if ($_SERVER['REQUEST_METHOD'] === 'POST') {
//     $employee_id = $_POST['employee_id'];
//     $password = $_POST['password'];

//     // Static fallback credentials
//     $default_employee_id = '1579';
//     $default_password = 'admin123'; // Plaintext for now; use hash if needed

//     // Static login bypass
//     if ($employee_id === $default_employee_id && $password === $default_password) {
//         $_SESSION['employee_id'] = $default_employee_id;

//         echo "<!DOCTYPE html><html><head>";
//         echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
//         echo "</head><body>";

//         echo "<script>
//             Swal.fire({
//                 icon: 'success',
//                 title: 'Static Login Successful!',
//                 text: 'Redirecting to main page...',
//                 timer: 2000,
//                 showConfirmButton: false
//             }).then(() => {
//                 window.location.href = 'main.php';
//             });
//         </script>";

//         echo "</body></html>";
//         exit(); // Skip DB code
//     }

//     // Proceed to database login check
//     $servername = "localhost";  // change as needed
//     $username = "your_db_user";
//     $password = "your_db_password";
//     $database = "your_db_name";

//     $conn = new mysqli($servername, $username, $password, $database);
//     if ($conn->connect_error) {
//         die("Connection failed: " . $conn->connect_error);
//     }

//     $stmt = $conn->prepare("SELECT * FROM user_accounts WHERE employee_id = ?");
//     $stmt->bind_param("s", $employee_id);
//     $stmt->execute();
//     $result = $stmt->get_result();

//     echo "<!DOCTYPE html><html><head>";
//     echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
//     echo "</head><body>";

//     if ($result->num_rows === 1) {
//         $user = $result->fetch_assoc();

//         if (password_verify($password, $user['password'])) {
//             $_SESSION['employee_id'] = $user['employee_id'];

//             echo "<script>
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Login Successful!',
//                     text: 'Redirecting to main page...',
//                     timer: 2000,
//                     showConfirmButton: false
//                 }).then(() => {
//                     window.location.href = 'main.php';
//                 });
//             </script>";
//         } else {
//             echo "<script>
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Incorrect Password',
//                     text: 'Please try again.'
//                 }).then(() => {
//                     window.location.href = 'index.html';
//                 });
//             </script>";
//         }
//     } else {
//         echo "<script>
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Employee ID Not Found',
//                 text: 'Please register or try again.'
//             }).then(() => {
//                 window.location.href = 'index.html';
//             });
//         </script>";
//     }

//     echo "</body></html>";
//     $stmt->close();
//     $conn->close();
// }
// 


$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $employee_id = $_POST['employee_id'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT * FROM user_accounts WHERE employee_id = ?");
    $stmt->bind_param("s", $employee_id);
    $stmt->execute();
    $result = $stmt->get_result();

    echo "<!DOCTYPE html><html><head>";
    echo "<script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>";
    echo "</head><body>";

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password'])) {
            $_SESSION['employee_id'] = $user['employee_id'];

            echo "<script>
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful!',
                    text: 'Redirecting to main page...',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'main.php';
                });
            </script>";
        } else {
            echo "<script>
                Swal.fire({
                    icon: 'error',
                    title: 'Incorrect Password',
                    text: 'Please try again.'
                }).then(() => {
                    window.location.href = 'index.html';
                });
            </script>";
        }
    } else {
        echo "<script>
            Swal.fire({
                icon: 'error',
                title: 'Employee ID Not Found',
                text: 'Please register or try again.'
            }).then(() => {
                window.location.href = 'index.html';
            });
        </script>";
    }

    echo "</body></html>";
    $stmt->close();
}

$conn->close();
?>