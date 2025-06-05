// Global references for elements
const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.getElementById("main-content");

const rolePages = {
    'Manager': [
        "active_attrition.html",
        "bps_absenteeism.html",
        "bps_attendance_db.html",
        "bps_bfp.html",
        "bps_dashboard.html",
        "lhi_absenteeism.html",
        "project_efficiency.html",
        "team_member.html",
        "lhi_financial.html",
        "bps_financial.html",
        "lhi_bfp.html",
        "lhi_dashboard.html",
        "bu_bps.html",
        "bu_lhi.html"
    ],
    'Admin': [
        "active_attrition.html",
        "bps_absenteeism.html",
        "bps_attendance_db.html",
        "bps_bfp.html",
        "bps_dashboard.html",
        "lhi_absenteeism.html",
        "project_efficiency.html",
        "team_member.html"
    ],
    'User': [
        "active_attrition.html",
        "team_member.html",
        "bps_absenteeism.html",
        "bps_attendance_db.html",
        "bps_bfp.html",
        "bps_dashboard.html"

    ]
};

function loadPage(pageName) {
    const mainContent = document.getElementById('main-content');

    // Allow all pages if Super User
    if (USER_ROLE === 'Super User') {
        // Allow loading of any existing page under views
        fetch(`views/${pageName}`)
            .then(res => {
                if (!res.ok) throw new Error("Page not found");
                return res.text();
            })
            .then(html => {
                mainContent.innerHTML = html;
            }).catch(() => {
                mainContent.innerHTML = '<h2>Page not found</h2>';
            });
        return;
    }

    // Check access for other roles
    const allowedPages = USER_ROLE === 'Super User' ? null : rolePages[USER_ROLE] || [];
    if (allowedPages.includes(pageName)) {
        fetch(`views/${pageName}`)
            .then(res => res.text())
            .then(html => {
                mainContent.innerHTML = html;
            }).catch(() => {
                mainContent.innerHTML = '<h2>Page not found</h2>';
            });
    } else {
        mainContent.innerHTML = '<h2>Access Denied</h2>';
    }
}

function updateMenuVisibility() {
    const links = document.querySelectorAll('.nav-link');
    const allowedPages = USER_ROLE === 'Super User' ? null : rolePages[USER_ROLE] || [];

    links.forEach(link => {
        const page = link.getAttribute('data-page');
        if (USER_ROLE === 'Super User' || (allowedPages && allowedPages.includes(page))) {
            link.style.display = 'block';
        } else {
            link.style.display = 'none';
        }
    });
}



// Global chart instances for ApexCharts updates
let chart1Instance, chart2Instance, chart3Instance, chart4Instance;

document.addEventListener("DOMContentLoaded", () => {
    // Show initial loading screen for 2 seconds on full page load
    if (loadingScreen) {
        loadingScreen.style.opacity = '1';
        loadingScreen.style.display = 'flex';

        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                initializeRouter();
                updateMenuVisibility(); 
            }, 500);
        }, 2000);
    } else {
        initializeRouter();
        updateMenuVisibility(); 
    }
});

function initializeRouter() {
    const links = document.querySelectorAll(".sidebar a");
    const logoutLink = document.getElementById("logout-link");

    if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            Swal.fire({
                title: 'Are you sure you want to log out?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, logout',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "logout.php";
                }
            });
        });
    }


    // Load default view after initial loading screen
    loadView("active_attrition");

    links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const title = link.querySelector("h3").textContent.trim().toLowerCase();

            if (title === "logout") {
                window.location.href = "logout.php";
                return;
            }

            links.forEach(l => l.classList.remove("Active"));
            link.classList.add("Active");

            const viewKey = title.replace(/ & | /g, "_");
            loadView(viewKey);
            history.pushState(null, "", `#${viewKey}`);
        });
    });

    // Flatpickr setup
    if (document.getElementById("dateRange")) {
        flatpickr("#dateRange", {
            mode: "range",
            dateFormat: "Y-m-d",
            onChange: function(selectedDates) {
                if (selectedDates.length === 2) {
                    const start = selectedDates[0].getTime();
                    const end = selectedDates[1].getTime();

                    [chart1Instance, chart2Instance, chart3Instance, chart4Instance].forEach(chart => {
                        if (chart && typeof chart.updateOptions === 'function') {
                            chart.updateOptions({ xaxis: { min: start, max: end } });
                        }
                    });
                }
            }
        });
    }
}

function loadView(viewName) {
    // If the requested view is 'log_out', stop immediately.
    // The logout process is handled by a separate click listener, not by loading a view.
    if (viewName === 'log_out') {
        return;
    }

    if (!mainContent) {
        console.error("Main content container (#main-content) not found! Cannot load view.");
        return;
    }

    const pageFile = `${viewName}.html`;

    // Enforce access control based on USER_ROLE and allowed pages
    if (USER_ROLE !== 'Super User') {
        const allowedPages = rolePages[USER_ROLE] || [];
        if (!allowedPages.includes(pageFile)) {
            mainContent.innerHTML = '<h2>Access Denied</h2>';
            return;
        }
    }

    let showLoadingScreen = false; // Flag to determine if loading screen should be shown
    let loadingPromise = Promise.resolve(); // Default promise, resolves immediately

    fetch(`views/${viewName}.html`)
        .then(res => {
            if (!res.ok) {
                throw new Error("View not found");
            }
            return res.text();
        })
        .then(html => {
            // Create a temporary element to check for an iframe without altering the DOM yet
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const iframe = tempDiv.querySelector('iframe');

            if (iframe && loadingScreen) {
                showLoadingScreen = true; // Set flag if iframe found and loadingScreen element exists
                loadingScreen.style.opacity = '1'; // Make loading screen visible
                loadingScreen.style.display = 'flex';

                loadingPromise = new Promise(resolve => {
                    // Set a timeout to resolve the promise even if the iframe fails to load (e.g., cross-origin issues)
                    const iframeLoadTimeout = setTimeout(() => {
                        resolve();
                    }, 10000); // 10 seconds timeout for iframe load

                    iframe.onload = () => {
                        clearTimeout(iframeLoadTimeout);
                        resolve();
                    };
                    iframe.onerror = () => {
                        clearTimeout(iframeLoadTimeout);
                        resolve();
                    };
                });
            }

            // Insert the new HTML into the main content area
            mainContent.innerHTML = html;

            // Wait for the loading promise (if an iframe was detected) before hiding the loading screen
            return loadingPromise.then(() => {
                if (showLoadingScreen && loadingScreen) {
                    const viewLoadStartTime = Date.now();
                    const minLoadDisplayTime = 2000; // Minimum 2 seconds display for views with iframes

                    const timeElapsed = Date.now() - viewLoadStartTime;
                    const remainingTime = Math.max(0, minLoadDisplayTime - timeElapsed);

                    return new Promise(resolve => {
                        setTimeout(() => {
                            loadingScreen.style.opacity = '0';
                            setTimeout(() => {
                                loadingScreen.style.display = 'none';
                                resolve();
                            }, 500); // Matches CSS transition duration
                        }, remainingTime); // Wait for the remaining time to meet the minimum display time
                    });
                } else {
                    // If no loading screen was shown (no iframe) or no loadingScreen element, resolve immediately
                    return Promise.resolve();
                }
            });
        })
        .catch(err => {
            // Display error message if view loading fails
            mainContent.innerHTML = `<h2>Error loading view</h2><p>${err.message}</p>`;
            // Ensure loading screen is hidden even if there's an error
            if (showLoadingScreen && loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => { loadingScreen.style.display = 'none'; }, 500);
            }
        })
        .finally(() => {
            // Initialize view-specific scripts after content is loaded and loading screen is handled
            initializeViewScripts(viewName);
        });
}


function initializeViewScripts(viewName) {
    if (viewName === 'bps_dashboard') {
        initBpsDashboardCharts();
    } else if (viewName === "active_attrition") {
        initActiveAttritionView();
    }
}

function initActiveAttritionView() {
    const applyBtn = document.getElementById("apply-btn");
    const startInput = document.getElementById("start-date");
    const endInput = document.getElementById("end-date");
    const entitySelect = document.getElementById("entity-select");

    // Initial fetches
    if (typeof fetchData === 'function') {
        fetchData(null, null, "ALL");
        fetchEmployeeUpdate("ALL");
    }

    if (applyBtn && startInput && endInput && entitySelect) {
        applyBtn.addEventListener("click", () => {
            const startDate = startInput.value;
            const endDate = endInput.value;
            const entity = entitySelect.value;

            if (startDate && endDate) {
                if (typeof fetchData === 'function') fetchData(startDate, endDate, entity);
                if (typeof fetchEmployeeUpdate === 'function') fetchEmployeeUpdate(entity, startDate, endDate);
                if (typeof showNotification === 'function') showNotification("Data loaded successfully!", true);
            } else {
                if (typeof showNotification === 'function') showNotification("Please select dates!", false);
            }
        });

        if (typeof validateDates === 'function') {
            startInput.addEventListener("input", validateDates);
            endInput.addEventListener("input", validateDates);
            validateDates();
        }
    }
}

function initBpsDashboardCharts() {
    if (!document.querySelector("#chart1")) return;

    const rootstyles = getComputedStyle(document.documentElement);
    const fontColor = rootstyles.getPropertyValue('--color-dark').trim();

    // Chart 1 (Area)
    const options1 = {
        series: [{ name: 'series1', data: [31, 40, 28, 51, 42, 109, 100] }, { name: 'series2', data: [11, 32, 45, 32, 34, 52, 41] }],
        chart: { type: 'area', height: 300, width: '100%', foreColor: fontColor },
        dataLabels: { enabled: false }, stroke: { curve: 'smooth' },
        xaxis: {
            type: 'datetime', categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
            labels: { style: { colors: fontColor } }, axisBorder: { show: true, color: fontColor }, axisTicks: { show: true, color: fontColor }, title: { style: { color: fontColor } }
        },
        yaxis: { labels: { style: { colors: fontColor } }, title: { style: { color: fontColor } } },
        tooltip: { x: { format: 'dd/MM/yy HH:mm' } }, responsive: [{ breakpoint: 480, options: { chart: { height: 200 } } }]
    };
    chart1Instance = new ApexCharts(document.querySelector("#chart1"), options1);
    chart1Instance.render();

    // Chart 2
    const options2 = {
        series: [{ data: [44, 55, 41, 64, 22, 43, 21] }, { data: [53, 32, 33, 52, 13, 44, 32] }],
        chart: { type: 'bar', height: 350, width: '100%' },
        plotOptions: { bar: { horizontal: true, dataLabels: { position: 'top' } } },
        dataLabels: { enabled: true, offsetX: -6, style: { fontSize: '12px', colors: ['#fff'] } },
        stroke: { show: true, width: 1, colors: ['#fff'] }, tooltip: { shared: true, intersect: false },
        xaxis: { categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007] },
        responsive: [{ breakpoint: 480, options: { chart: { height: 250 } } }]
    };
    chart2Instance = new ApexCharts(document.querySelector("#chart2"), options2);
    chart2Instance.render();

    // Chart 3
    const options3 = {
        series: [{ name: 'Website Blog', type: 'column', data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160] }, { name: 'Social Media', type: 'line', data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16] }],
        chart: { type: 'line', height: 350, width: '100%' },
        stroke: { width: [0, 4] }, title: { text: 'Traffic Sources' }, dataLabels: { enabled: true, enabledOnSeries: [1] },
        labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
        yaxis: [{ title: { text: 'Website Blog' } }, { opposite: true, title: { text: 'Social Media' } }],
        responsive: [{ breakpoint: 480, options: { chart: { height: 250 }, title: { style: { fontSize: '14px' } } }}]
    };
    chart3Instance = new ApexCharts(document.querySelector("#chart3"), options3);
    chart3Instance.render();

    // Chart 4
    const dates = [
        { x: new Date('2025-01-01').getTime(), y: 12000000 }, { x: new Date('2025-01-02').getTime(), y: 13500000 },
        { x: new Date('2025-01-03').getTime(), y: 12800000 }, { x: new Date('2025-01-04').getTime(), y: 14200000 },
        { x: new Date('2025-01-05').getTime(), y: 13800000 }, { x: new Date('2025-01-06').getTime(), y: 14500000 },
        { x: new Date('2025-01-07').getTime(), y: 14900000 }
    ];
    const options4 = {
        series: [{ name: 'XYZ MOTORS', data: dates }],
        chart: { type: 'area', stacked: false, height: 350, width: '100%', zoom: { type: 'x', enabled: true, autoScaleYaxis: true }, toolbar: { autoSelected: 'zoom' } },
        dataLabels: { enabled: false }, markers: { size: 0 }, title: { text: 'Stock Price Movement', align: 'left' },
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, inverseColors: false, opacityFrom: 0.5, opacityTo: 0, stops: [0, 90, 100] } },
        yaxis: { labels: { formatter: function (val) { return (val / 1000000).toFixed(0); } }, title: { text: 'Price' } },
        xaxis: { type: 'datetime' },
        tooltip: { shared: false, y: { formatter: function (val) { return (val / 1000000).toFixed(0); } } },
        responsive: [{ breakpoint: 480, options: { chart: { height: 250 }, title: { style: { fontSize: '14px' } } }}]
    };
    chart4Instance = new ApexCharts(document.querySelector("#chart4"), options4);
    chart4Instance.render();
}

// Popstate listener for browser back/forward buttons
window.addEventListener("popstate", () => {
    const hash = location.hash.slice(1);
    if (hash) {
        loadView(hash);
    } else {
        loadView("active_attrition"); // default
    }
});

// --- Placeholder for your other helper functions ---
/*
function fetchData(startDate, endDate, entity) {
    // Your data fetching logic
}

function fetchEmployeeUpdate(entity, startDate, endDate) {
    // Your employee update fetching logic
}

function showNotification(message, isSuccess) {
    // Your notification display logic
}

function validateDates() {
    // Your date validation logic
}
*/