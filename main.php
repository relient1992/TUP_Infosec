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
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
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

                <div class="dropdown">
                    <a href="#" class="parent">
                        <span class="material-icons-sharp">calendar_month</span>
                        <h3>Attendance & Absenteeism</h3>
                        <span class="dropdown-indicator">&#9662;</span>
                    </a>
                    <div class="child-dropdown">
                        <a href="#"><h3>LHI Absenteeism</h3></a>
                        <a href="#"><h3>BPS Absenteeism</h3></a>
                        <a href="#"><h3>BPS Attendance DB</h3></a>
                    </div>
                </div>

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

                <a href="#" data-view="lhi-financial">
                    <span class="material-icons-sharp">insert_chart</span>
                    <h3>LHI Financial</h3>
                </a>

                <!-- <a href="#">
                    <span class="material-icons-sharp">settings</span>
                    <h3>Settings</h3>
                </a> -->

                <a href="#" id="logout-link">
                    <span class="material-icons-sharp">logout</span>
                    <h3>Log Out</h3>
                </a>

            </div>


        </aside>


        <!-- END OF ASIDE -->

        <main id="main-content">

            <div id="loading-screen" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.9); /* Semi-transparent white background */
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999; /* Ensure it's on top of everything */
                transition: opacity 0.5s ease-out; /* Smooth fade-out */">
                <div class="spinner" style="
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border-left-color: #09f;
                    animation: spin 1s ease infinite;">
                </div>
                <p style="margin-left: 10px; font-family: sans-serif; font-size: 1.2em;">Loading...</p>
            </div>

            

            <style>
                /* Basic spinner animation - You can put this in your style.css as well */
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>

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

        </div>
        <!-- END OF RIGHT SECTION -->

    </div>

    <script src="js/fetch_data.js"></script>
    <script src="js/employee_updates.js"></script>
    <script src="js/project_employees.js"></script>
    <script src="js/index.js"></script>
    <script src="js/router.js"></script>
    <script src="js/sidebartoggle.js"></script>

    

</body>
</html>
