<?php
session_start();  // Start the session

// Prevent browser caching
header("Cache-Control: no-cache, no-store, must-revalidate"); // HTTP 1.1
header("Pragma: no-cache"); // HTTP 1.0
header("Expires: 0"); // Proxies

// Check if user is logged in (session variable exists)
if (!isset($_SESSION['employee_id'])) {
    // Redirect to login page if not logged in
    header('Location: index.html');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exela Local Website</title>
    <!-- Material Icons -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp"
    rel="stylesheet">
    <link rel="stylesheet" href="./style.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>
    <div class="container">
        <aside>
            <div class="top">
                <div class="logo">
                    <!-- <img id="logo" src="./images/ExelaTech_logo.png" alt="logo"> -->
                </div>
                <div class="close" id="close-btn">
                    <span class="material-icons-sharp">close</span>
                </div>
            </div>

            <div class="sidebar">
                <a href="#" class="Active">
                    <span class="material-icons-sharp">group</span>
                    <h3>Active & Attrition</h3>
                </a>

                <a href="#">
                    <span class="material-icons-sharp">supervisor_account</span>
                    <h3>Team Member</h3>
                </a>

                <a href="#">
                    <span class="material-icons-sharp">grid_view</span>
                    <h3>BPS Dashboard</h3>
                </a>

                <a href="#">
                    <span class="material-icons-sharp">money</span>
                    <h3>BPS BFP</h3>
                </a>

                <a href="#">
                    <span class="material-icons-sharp">query_stats</span>
                    <h3>Project Efficiency</h3>
                </a>

                <a href="#">
                    <span class="material-icons-sharp">calendar_month</span>
                    <h3>Attendance & Absenteeism</h3>
                </a>

                <hr class="menu-divider">

                <a href="#">
                    <span class="material-icons-sharp">grid_view</span>
                    <h3>LHI Dashboard</h3>
                </a>

                <a href="#">
                    <span class="material-icons-sharp">money</span>
                    <h3>LHI BFP</h3>
                </a>

                <hr class="menu-divider">

                <a href="#">
                    <span class="material-icons-sharp">bar_chart</span>
                    <h3>BPS Financial</h3>
                </a>

                <a href="#">
                    <span class="material-icons-sharp">insert_chart</span>
                    <h3>LHI Financial</h3>
                </a>

                <a href="#">
                    <span class="material-icons-sharp">settings</span>
                    <h3>Settings</h3>
                </a>

                <a href="#" id="logout-link">
                    <span class="material-icons-sharp">logout</span>
                    <h3>Log Out</h3>
                </a>

            </div>

        </aside>

        <!-- END OF ASIDE -->

        <main id="main-content">

            <div id="app"></div>
            
            
        </main>
        <!-- END OF MAIN -->

        <!-- RIGHT SECTION: now contains top bar and dynamic insert area -->
        <div class="right-container">

            
            <div class="right-top">
                <div class="top">
                    <button id="menu-btn">
                        <span class="material-icons-sharp">dehaze</span>
                    </button>
                    <div class="theme-toggler">
                        <span class="material-icons-sharp active">light_mode</span>
                        <span class="material-icons-sharp">dark_mode</span>
                    </div>
                    <div class="profile">
                        <div class="info">
                            <p>Hi, <b>Daryl</b></p>
                            <small class="text-muted">FP&A</small>
                        </div>
                        <div class="profile-photo">
                            <span class="material-icons-sharp">account_circle</span>
                        </div>
                    </div>
                </div>
            </div>

           
            <div id="right-bottom-section">
               
            </div>

            <!-- <div class="right-container">
                <div class="employee-count">
                <h2>Total Project Employees</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Project</th>
                        <th>Employee Count</th>
                        <th>Site</th>
                    </tr>
                    </thead>
                    <tbody>
                    
                    </tbody>
                </table>
                </div>
            </div> -->

        </div>
        <!-- END OF RIGHT SECTION -->

    </div>

    <script src="js/fetch_data.js"></script>
    <script src="js/employee_updates.js"></script>
    <script src="js/project_employees.js"></script>
    <script src="js/index.js"></script>
    <script src="js/router.js"></script>

    

</body>
</html>
