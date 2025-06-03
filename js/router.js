document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".sidebar a");
    const main = document.getElementById("main-content");

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

    // Load initial view
    loadView("active_attrition");

    links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();

            // Remove active from all, add to clicked
            links.forEach(l => l.classList.remove("Active"));
            link.classList.add("Active");

            const title = link.querySelector("h3").textContent.trim();
            const viewKey = title.toLowerCase().replace(/ & | /g, "_");

            loadView(viewKey);
        });

        link.addEventListener("click", e => {
            e.preventDefault();

            const title = link.querySelector("h3").textContent.trim().toLowerCase();

            if (title === "logout") {
                window.location.href = "logout.php"; // Full redirect
                return;
            }

            // Remove active from all, add to clicked
            links.forEach(l => l.classList.remove("Active"));
            link.classList.add("Active");

            const viewKey = title.replace(/ & | /g, "_");
            loadView(viewKey);

            // ✅ Update the URL in the browser
            history.pushState(null, "", `#${viewKey}`);
        });        
    });

    function loadView(viewName) {
        fetch(`views/${viewName}.html`)
            .then(res => {
                if (!res.ok) throw new Error("View not found");
                return res.text();
            })
            .then(html => {
                main.innerHTML = html;
                // After injecting the HTML, initialize event listeners for the new content
                initializeViewScripts(viewName);
            })
            .catch(err => {
                main.innerHTML = `<h2>Error loading view</h2><p>${err.message}</p>`;
            });
    }

    // Initialize any view-specific JS here
    function initializeViewScripts(viewName) {
        if (viewName == 'bps_dashboard') {
            initBpsDashboardCharts();
        } else if (viewName === "active_attrition") {
            initActiveAttritionView();
        }
        // add other views if needed
    }

    function initActiveAttritionView() {
        const applyBtn = document.getElementById("apply-btn");
        const startInput = document.getElementById("start-date");
        const endInput = document.getElementById("end-date");
        const entitySelect = document.getElementById("entity-select");

        // ✅ INITIAL FETCH
        fetchData(null, null, "ALL"); // Summary metrics
        fetchEmployeeUpdate("ALL");   // Employee update table

        if (applyBtn && startInput && endInput && entitySelect) {
            applyBtn.addEventListener("click", () => {
                const startDate = startInput.value;
                const endDate = endInput.value;
                const entity = entitySelect.value;

                if (startDate && endDate) {
                    fetchData(startDate, endDate, entity);              // Update summary
                    fetchEmployeeUpdate(entity, startDate, endDate);    // Update employee list
                    showNotification("Data loaded successfully!", true);
                } else {
                    showNotification("Please select dates!", false);
                }
            });

            startInput.addEventListener("input", validateDates);
            endInput.addEventListener("input", validateDates);
            validateDates();
        } else {
            console.warn("Active & Attrition view: missing expected elements.");
        }
    }

    function initBpsDashboardCharts() {
    // Safety check in case HTML didn't load correctly
    if (!document.querySelector("#chart1")) return;

    // Chart 1 (Area)
    const options1 = {
        series: [{
            name: 'series1',
            data: [31, 40, 28, 51, 42, 109, 100]
        }, {
            name: 'series2',
            data: [11, 32, 45, 32, 34, 52, 41]
        }],
        chart: {
            type: 'area',
            height: 300,
            width: '100%'
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        xaxis: {
            type: 'datetime',
            categories: [
                "2018-09-19T00:00:00.000Z",
                "2018-09-19T01:30:00.000Z",
                "2018-09-19T02:30:00.000Z",
                "2018-09-19T03:30:00.000Z",
                "2018-09-19T04:30:00.000Z",
                "2018-09-19T05:30:00.000Z",
                "2018-09-19T06:30:00.000Z"
            ]
        },
        tooltip: { x: { format: 'dd/MM/yy HH:mm' } },
        responsive: [{ breakpoint: 480, options: { chart: { height: 200 } } }]
    };

    new ApexCharts(document.querySelector("#chart1"), options1).render();

    // Add Chart 2
    const options2 = {
        series: [
            { data: [44, 55, 41, 64, 22, 43, 21] },
            { data: [53, 32, 33, 52, 13, 44, 32] }
        ],
        chart: {
            type: 'bar',
            height: 350,
            width: '100%'
        },
        plotOptions: {
            bar: {
                horizontal: true,
                dataLabels: { position: 'top' }
            }
        },
        dataLabels: {
            enabled: true,
            offsetX: -6,
            style: { fontSize: '12px', colors: ['#fff'] }
        },
        stroke: { show: true, width: 1, colors: ['#fff'] },
        tooltip: { shared: true, intersect: false },
        xaxis: { categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007] },
        responsive: [{ breakpoint: 480, options: { chart: { height: 250 } } }]
    };

    new ApexCharts(document.querySelector("#chart2"), options2).render();

    // Add Chart 3
    const options3 = {
        series: [
            {
                name: 'Website Blog',
                type: 'column',
                data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
            },
            {
                name: 'Social Media',
                type: 'line',
                data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
            }
        ],
        chart: {
            type: 'line',
            height: 350,
            width: '100%'
        },
        stroke: { width: [0, 4] },
        title: { text: 'Traffic Sources' },
        dataLabels: { enabled: true, enabledOnSeries: [1] },
        labels: [
            '01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001',
            '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001',
            '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'
        ],
        yaxis: [
            { title: { text: 'Website Blog' } },
            { opposite: true, title: { text: 'Social Media' } }
        ],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: { height: 250 },
                title: { style: { fontSize: '14px' } }
            }
        }]
    };

    new ApexCharts(document.querySelector("#chart3"), options3).render();
    
    //added chart 4
    const dates = [
    { x: new Date('2025-01-01').getTime(), y: 12000000 },
    { x: new Date('2025-01-02').getTime(), y: 13500000 },
    { x: new Date('2025-01-03').getTime(), y: 12800000 },
    { x: new Date('2025-01-04').getTime(), y: 14200000 },
    { x: new Date('2025-01-05').getTime(), y: 13800000 },
    { x: new Date('2025-01-06').getTime(), y: 14500000 },
    { x: new Date('2025-01-07').getTime(), y: 14900000 }
    ];

    const options4 = {
        series: [{
            name: 'XYZ MOTORS',
            data: dates
        }],
        chart: {
            type: 'area',
            stacked: false,
            height: 350,
            width: '100%',
            zoom: {
                type: 'x',
                enabled: true,
                autoScaleYaxis: true
            },
            toolbar: {
                autoSelected: 'zoom'
            }
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 0
        },
        title: {
            text: 'Stock Price Movement',
            align: 'left'
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 90, 100]
            }
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    return (val / 1000000).toFixed(0);
                }
            },
            title: {
                text: 'Price'
            }
        },
        xaxis: {
            type: 'datetime'
        },
        tooltip: {
            shared: false,
            y: {
                formatter: function (val) {
                    return (val / 1000000).toFixed(0);
                }
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: { height: 250 },
                title: { style: { fontSize: '14px' } }
            }
        }]
    };

    new ApexCharts(document.querySelector("#chart4"), options4).render();

    flatpickr("#dateRange", {
        mode: "range",
        dateFormat: "Y-m-d",
        onChange: function(selectedDates) {
            if (selectedDates.length === 2) {
                const start = selectedDates[0].getTime();
                const end = selectedDates[1].getTime();

                [chart1, chart2, chart3, chart4].forEach(chart => {
                    chart.updateOptions({
                        xaxis: {
                            min: start,
                            max: end
                        }
                    });
                });
            }
        }
    });
}

});


window.addEventListener("popstate", () => {
    const hash = location.hash.slice(1); // remove the #
    if (hash) {
        loadView(hash);
    } else {
        loadView("active_attrition"); // default
    }
});
