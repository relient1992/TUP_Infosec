function fetchData(startDate = null, endDate = null, entity = "ALL") {
    let url = `fetch_data.php?entity=${encodeURIComponent(entity)}`;

    if (startDate && endDate) {
        url += `&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {

             console.log("Fetched data:", data);
            // Update core counts
            document.getElementById("activelist").textContent = data.ACTIVE ?? 'N/A';
            document.getElementById("attritionlist").textContent = data.INACTIVE_CURRENT_YEAR ?? 'N/A';
            document.getElementById("newlyhiredlist").textContent = data.NEWHIRES_CURRENT_YEAR ?? 'N/A';

            // Update project-level employee count table
            const projectEmployeeData = data.PROJECT_EMPLOYEE_SUMMARY || [];
            const tableBody = document.querySelector('.employee-count table tbody');
            tableBody.innerHTML = ''; // Clear existing rows

            projectEmployeeData.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.PROJECT}</td>
                    <td>${item.EMPLOYEECOUNT}</td>
                    <td>${item.SITE}</td>
                `;
                tableBody.appendChild(row);
            });

                
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            document.getElementById("activelist").textContent = "Error";
            document.getElementById("attritionlist").textContent = "Error";
            document.getElementById("newlyhiredlist").textContent = "Error";
        });
}

function validateDates(){
        const startDate = document.getElementById("start-date").value;
        const endDate = document.getElementById("end-date").value;
        const applyBtn = document.getElementById("apply-btn");

        //applyBtn.disabled = !(startDate && endDate);        
}

function showNotification(message, isSuccess = true) {
    const popup = document.getElementById("success-popup");
  
    // Set the message text (assuming you want to show a message somewhere)
    popup.querySelector(".message").textContent = message;
  
    // Toggle hidden class to show popup
    popup.classList.remove("hidden");
  
    // Set button color based on success or failure
    if (isSuccess) {
      popup.style.backgroundColor = "#ddffdd";
      
    } else {
        popup.style.backgroundColor = "#ffeb3b";
    }
  
    // Hide popup after 3 seconds
    setTimeout(() => popup.classList.add("hidden"), 3000);
  }


//Fetch data on Apply button click

document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "apply-btn") {
        const startDate = document.getElementById("start-date").value;
        const endDate = document.getElementById("end-date").value;
        const entity = document.getElementById("entity-select").value;

        if (startDate && endDate) {
            fetchData(startDate, endDate, entity);
            showNotification("Data loaded successfully!", true);
        } else {
            showNotification("Please select dates!", false);
        }
    }
});

window.addEventListener("DOMContentLoaded", () => {
    // Initially load data
    fetchData(null, null, "ALL");

    // Grab elements only after DOM is fully loaded
    const applyBtn = document.getElementById("apply-btn");
    const startInput = document.getElementById("start-date");
    const endInput = document.getElementById("end-date");
    const entitySelect = document.getElementById("entity-select");

    if (applyBtn && startInput && endInput && entitySelect) {
        applyBtn.addEventListener("click", () => {
            const startDate = startInput.value;
            const endDate = endInput.value;
            const entity = entitySelect.value;

            if (startDate && endDate) {
                fetchData(startDate, endDate, entity);
                showNotification("Data loaded successfully!", true);
            } else {
                showNotification("Please select dates!", false);
            }
        });

        // Attach validation listeners
        startInput.addEventListener("input", validateDates);
        endInput.addEventListener("input", validateDates);
        validateDates();
    } else {
        console.warn("One or more expected DOM elements are missing.");
    }
});
