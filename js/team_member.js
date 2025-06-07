document.addEventListener("DOMContentLoaded", function () {
    console.log('=== TEAM MEMBER DEBUG START ===');
    
    // Check if elements exist
    const select = document.getElementById("teamSelect");
    const tbody = document.querySelector("#team-table tbody");
    const table = document.getElementById("team-table");
    
    console.log('Elements found:', {
        select: !!select,
        tbody: !!tbody,
        table: !!table,
        ExportManager: typeof ExportManager
    });

    if (!select) {
        console.error('teamSelect element not found!');
        return;
    }
    if (!tbody) {
        console.error('team-table tbody not found!');
        return;
    }

    // Initialize Export Manager with enhanced debugging
    if (typeof ExportManager !== 'undefined') {
        console.log('Initializing ExportManager...');
        ExportManager.init({
            tableId: 'team-table',
            selectId: 'teamSelect',
            fetchUrl: 'fetch_data.php'
        });
        console.log('Export functionality initialized');
        
        // Check if buttons were created
        setTimeout(() => {
            const csvBtn = document.getElementById('exportCsvBtn');
            const excelBtn = document.getElementById('exportExcelBtn');
            const allBtn = document.getElementById('exportAllBtn');
            const container = document.querySelector('.export-buttons-container');
            
            console.log('Export buttons status:', {
                csvBtn: !!csvBtn,
                excelBtn: !!excelBtn,
                allBtn: !!allBtn,
                container: !!container
            });
            
            if (!csvBtn) {
                console.error('Export buttons were not created!');
                console.log('Table parent element:', table?.parentElement);
                console.log('Available containers:', document.querySelectorAll('.export-buttons-container'));
            }
        }, 100);
        
    } else {
        console.error('ExportManager not found. Make sure export-functions.js is loaded.');
        console.log('Available global objects:', Object.keys(window).filter(key => key.includes('Export')));
    }

    // Add default placeholder option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "-- Select Supervisor --";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    // Populate dropdown with team members
    fetch("fetch_data.php?action=list_names")
        .then(response => response.json())
        .then(data => {
            console.log('Loaded team names:', data.length);
            data.forEach(name => {
                const option = document.createElement("option");
                option.value = name;
                option.textContent = name;
                select.appendChild(option);
            });
        })
        .catch(error => console.error("Error loading team names:", error));

    // On dropdown change, fetch data
    select.addEventListener("change", function () {
        const selectedName = select.value;
        tbody.innerHTML = "";

        if (!selectedName) return;

        // Optional: Show loading row
        const loadingRow = document.createElement("tr");
        const loadingCell = document.createElement("td");
        loadingCell.colSpan = 8;
        loadingCell.textContent = "Loading...";
        loadingCell.style.textAlign = "center";
        loadingRow.appendChild(loadingCell);
        tbody.appendChild(loadingRow);

        fetch(`fetch_data.php?action=filter&name=${encodeURIComponent(selectedName)}`)
            .then(response => response.json())
            .then(data => {
                tbody.innerHTML = ""; // Clear loading row

                if (data.length === 0) {
                    const tr = document.createElement("tr");
                    const td = document.createElement("td");
                    td.colSpan = 8;
                    td.textContent = "No team members found for the selected supervisor.";
                    td.style.textAlign = "center";
                    tr.appendChild(td);
                    tbody.appendChild(tr);
                    return;
                }

                data.forEach(row => {
                    const tr = document.createElement("tr");
                    [
                        row.EDS,
                        row.FULLNAME,
                        row.PROJECT,
                        row.POSITION,
                        row.SITE,
                        row.SUPERVISOR,
                        row.emp_status,
                        row.DATEHIRED
                    ].forEach(cellValue => {
                        const td = document.createElement("td");
                        td.textContent = cellValue || ''; // Handle null/undefined values
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });

                // Update export buttons state after data is loaded
                updateExportButtonsState(selectedName);
            })
            .catch(error => {
                console.error("Error fetching employee data:", error);
                tbody.innerHTML = "";
                const errorRow = document.createElement("tr");
                const errorCell = document.createElement("td");
                errorCell.colSpan = 8;
                errorCell.textContent = "Error loading data. Please try again.";
                errorCell.style.textAlign = "center";
                errorRow.appendChild(errorCell);
                tbody.appendChild(errorRow);
            });
    });

    // Function to update export buttons state
    function updateExportButtonsState(selectedName) {
        const csvBtn = document.getElementById('exportCsvBtn');
        const excelBtn = document.getElementById('exportExcelBtn');
        
        console.log('Updating export buttons for:', selectedName, {
            csvBtn: !!csvBtn,
            excelBtn: !!excelBtn
        });
        
        if (csvBtn && excelBtn) {
            if (selectedName) {
                // Enable buttons and update CSV button to export filtered data
                csvBtn.disabled = false;
                excelBtn.disabled = false;
                
                // Update CSV button to export filtered data from server
                csvBtn.onclick = () => {
                    if (typeof ExportManager !== 'undefined') {
                        ExportManager.exportFilteredData(selectedName);
                    }
                };
            } else {
                // Disable buttons when no supervisor selected
                csvBtn.disabled = true;
                excelBtn.disabled = true;
            }
        } else {
            console.warn('Export buttons not found when trying to update state');
        }
    }

    console.log('=== TEAM MEMBER DEBUG END ===');
});