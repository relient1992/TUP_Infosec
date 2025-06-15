function fetchProjectEmployeeSummary() {
    fetch("fetch_data.php")
        .then(response => response.json())
        .then(data => {
            const projectEmployeeList = data.PROJECT_EMPLOYEE_SUMMARY || [];

            const tbody = document.querySelector('.employee-count table tbody');
            tbody.innerHTML = ''; 

            projectEmployeeList.forEach(item => {
                const tr = document.createElement('tr');
                const trContent = `
                    <td>${item.PROJECT}</td>
                    <td>${item.EMPLOYEECOUNT}</td>
                    <td>${item.SITE}</td>
                `;
                tr.innerHTML = trContent;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error("Error fetching project employee summary:", error));
}


window.addEventListener("DOMContentLoaded", fetchProjectEmployeeSummary);
