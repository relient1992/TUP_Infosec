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
        if (viewName === "active_attrition") {
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

});


window.addEventListener("popstate", () => {
    const hash = location.hash.slice(1); // remove the #
    if (hash) {
        loadView(hash);
    } else {
        loadView("active_attrition"); // default
    }
});
