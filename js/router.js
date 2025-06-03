// Global scope variables for the loading screen and main content
const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.getElementById("main-content");

// Global chart instances (if needed for flatpickr)
let chart1Instance, chart2Instance, chart3Instance, chart4Instance;

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content Loaded. Starting initial loading screen logic.");

    // --- Initial Loading Screen Logic (Only on full page load) ---
    // This part ensures the *very first* loading screen is visible for at least 2 seconds,
    // regardless of whether there's an iframe or not.
    if (loadingScreen) {
        console.log("Loading screen element found.");
        loadingScreen.style.opacity = '1';
        loadingScreen.style.display = 'flex';

        // Set a minimum display time for the initial load
        const initialLoadStartTime = Date.now();
        const minDisplayTime = 2000; // 2 seconds

        // We will call initializeRouter once the minimum time is met
        // AND the DOM is fully ready.
        // For the *initial* load, we don't know yet if the first view has an iframe.
        // So, we'll keep the 2-second timeout here.
        setTimeout(() => {
            console.log("Initial load: Minimum 2 seconds met. Hiding loading screen and initializing router.");
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                initializeRouter();
            }, 500); // Matches CSS transition duration
        }, minDisplayTime - (Date.now() - initialLoadStartTime)); // Adjust if initial load was faster than minDisplayTime
    } else {
        console.warn("Loading screen element (#loading-screen) not found in DOM. Proceeding with router initialization immediately.");
        initializeRouter();
    }
});

function initializeRouter() {
    console.log("Router initialized.");
    const links = document.querySelectorAll(".sidebar a");

    //logout
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

    // Load initial view *after* the initial loading screen is hidden
    // For the initial view, loadView will now handle its own loading screen logic.
    loadView("active_attrition");
    console.log("Initial view 'active_attrition' requested.");


    links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            console.log("Sidebar link clicked.");

            const title = link.querySelector("h3").textContent.trim().toLowerCase();

            if (title === "logout") {
                window.location.href = "logout.php";
                return;
            }

            links.forEach(l => l.classList.remove("Active"));
            link.classList.add("Active");

            const viewKey = title.replace(/ & | /g, "_");
            console.log(`Requesting view: ${viewKey}`);
            loadView(viewKey); // Call loadView here for route changes

            history.pushState(null, "", `#${viewKey}`);
        });
    });

    // Root styles for charts (moved here or ensure fontColor is accessible)
    const rootstyles = getComputedStyle(document.documentElement);
    const fontColor = rootstyles.getPropertyValue('--color-dark').trim();

    // Setup flatpickr (if #dateRange exists on the initial view)
    if (document.getElementById("dateRange")) {
        flatpickr("#dateRange", {
            mode: "range",
            dateFormat: "Y-m-d",
            onChange: function(selectedDates) {
                if (selectedDates.length === 2) {
                    const start = selectedDates[0].getTime();
                    const end = selectedDates[1].getTime();
                    console.log(`Flatpickr date range selected: ${new Date(start)} to ${new Date(end)}`);

                    [chart1Instance, chart2Instance, chart3Instance, chart4Instance].forEach(chart => {
                        if (chart && typeof chart.updateOptions === 'function') {
                            chart.updateOptions({
                                xaxis: {
                                    min: start,
                                    max: end
                                }
                            });
                        } else {
                            console.warn("Chart instance not found or updateOptions not a function for date range update.");
                        }
                    });
                }
            }
        });
    } else {
        console.warn("#dateRange element not found for Flatpickr setup during initial router initialization.");
    }
}


// --- Functions moved to global scope for accessibility ---

function loadView(viewName) {
    console.log(`loadView called for: ${viewName}`);

    // Show the loading screen immediately
    if (loadingScreen) {
        console.log("Showing loading screen for view change.");
        loadingScreen.style.opacity = '1'; // Ensure it's fully opaque
        loadingScreen.style.display = 'flex'; // Make it visible (flex for centering)
    } else {
        console.warn("Loading screen element not found in loadView. Cannot display loading screen.");
    }

    if (!mainContent) {
        console.error("Main content container (#main-content) not found!");
        // Attempt to hide loading screen if mainContent is missing
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => { loadingScreen.style.display = 'none'; }, 500);
        }
        return; // Stop if there's no place to load content
    }

    // Capture the start time for the 2-second minimum display
    const viewLoadStartTime = Date.now();
    const minViewDisplayTime = 2000; // 2 seconds for page change

    fetch(`views/${viewName}.html`)
        .then(res => {
            if (!res.ok) {
                console.error(`HTTP error! Status: ${res.status} for view: ${viewName}`);
                throw new Error("View not found");
            }
            return res.text();
        })
        .then(html => {
            console.log(`View '${viewName}' fetched successfully.`);
            mainContent.innerHTML = html;

            const iframe = mainContent.querySelector('iframe');
            if (iframe) {
                console.log("Iframe found in the loaded view. Waiting for iframe to load.");
                return new Promise(resolve => {
                    iframe.onload = () => {
                        console.log("Iframe finished loading.");
                        resolve();
                    };
                    iframe.onerror = () => {
                        console.warn("Iframe loading failed or encountered an error.");
                        resolve(); // Resolve anyway to hide loading screen
                    };
                });
            } else {
                console.log("No iframe found in the loaded view.");
                return Promise.resolve(); // No iframe, so resolve immediately
            }
        })
        .catch(err => {
            console.error(`Error loading view '${viewName}':`, err);
            mainContent.innerHTML = `<h2>Error loading view</h2><p>${err.message}</p>`;
        })
        .finally(() => {
            console.log("Fetch operation and iframe check finished.");

            const timeElapsed = Date.now() - viewLoadStartTime;
            const remainingTime = Math.max(0, minViewDisplayTime - timeElapsed);

            if (loadingScreen) {
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        console.log("Loading screen hidden.");
                    }, 500); // Matches CSS transition duration
                }, remainingTime); // Wait for the remaining time to meet 2s minimum, then hide
            }
            initializeViewScripts(viewName); // Initialize scripts AFTER content is loaded and iframe is ready
        });
}

function initializeViewScripts(viewName) {
    console.log(`Initializing scripts for view: ${viewName}`);
    if (viewName === 'bps_dashboard') {
        initBpsDashboardCharts();
    } else if (viewName === "active_attrition") {
        initActiveAttritionView();
    }
    // add other views if needed
}

function initActiveAttritionView() {
    console.log("Initializing Active & Attrition View scripts.");
    const applyBtn = document.getElementById("apply-btn");
    const startInput = document.getElementById("start-date");
    const endInput = document.getElementById("end-date");
    const entitySelect = document.getElementById("entity-select");

    if (typeof fetchData === 'function') {
        fetchData(null, null, "ALL");
        fetchEmployeeUpdate("ALL");
    } else {
        console.warn("fetchData or fetchEmployeeUpdate functions not found for Active & Attrition view.");
    }

    if (applyBtn && startInput && endInput && entitySelect) {
        console.log("Active & Attrition view: All expected elements found.");
        applyBtn.addEventListener("click", () => {
            const startDate = startInput.value;
            const endDate = endInput.value;
            const entity = entitySelect.value;

            if (startDate && endDate) {
                console.log(`Active & Attrition: Fetching data for ${startDate} to ${endDate} and ${entity}`);
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
        } else {
            console.warn("validateDates function not found for Active & Attrition view.");
        }
    } else {
        console.warn("Active & Attrition view: missing expected elements (applyBtn, startInput, endInput, or entitySelect).");
    }
}

function initBpsDashboardCharts() {
    console.log("Initializing BPS Dashboard Charts.");
    if (!document.querySelector("#chart1")) {
        console.warn("initBpsDashboardCharts: #chart1 element not found. Charts may not render.");
        return;
    }

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
    console.log("Chart 1 rendered.");

    // Add Chart 2
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
    console.log("Chart 2 rendered.");

    // Add Chart 3
    const options3 = {
        series: [{ name: 'Website Blog', type: 'column', data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160] }, { name: 'Social Media', type: 'line', data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16] }],
        chart: { type: 'line', height: 350, width: '100%' },
        stroke: { width: [0, 4] }, title: { text: 'Traffic Sources' }, dataLabels: { enabled: true, enabledOnSeries: [1] },
        labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
        yaxis: [{ title: { text: 'Website Blog' } }, { opposite: true, title: { text: 'Social Media' } }],
        responsive: [{ breakpoint: 480, options: { chart: { height: 250 }, title: { style: { fontSize: '14px' } } } }]
    };

    chart3Instance = new ApexCharts(document.querySelector("#chart3"), options3);
    chart3Instance.render();
    console.log("Chart 3 rendered.");

    //added chart 4
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
        responsive: [{ breakpoint: 480, options: { chart: { height: 250 }, title: { style: { fontSize: '14px' } } } }]
    };

    chart4Instance = new ApexCharts(document.querySelector("#chart4"), options4);
    chart4Instance.render();
    console.log("Chart 4 rendered.");
}

window.addEventListener("popstate", () => {
    console.log("Popstate event triggered.");
    const hash = location.hash.slice(1);
    if (hash) {
        loadView(hash);
    } else {
        loadView("active_attrition");
    }
});

// Assume fetchData, fetchEmployeeUpdate, showNotification, validateDates are defined elsewhere
// If not, they must be defined in the global scope like this:
// function fetchData(startDate, endDate, entity) { console.log("Fetching data...", {startDate, endDate, entity}); }
// function fetchEmployeeUpdate(entity, startDate, endDate) { console.log("Fetching employee update...", {entity, startDate, endDate}); }
// function showNotification(message, isSuccess) { console.log(`Notification: ${message} (Success: ${isSuccess})`); }
// function validateDates() { console.log("Validating dates."); }