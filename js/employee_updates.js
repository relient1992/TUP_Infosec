function fetchEmployeeUpdate(entity = 'ALL', startDate = null, endDate = null) {
    const params = new URLSearchParams();

    // Add entity
    params.append('entity', entity);

    // Add date filters if provided
    if (startDate && endDate) {
        params.append('startDate', startDate);
        params.append('endDate', endDate);
    }

    fetch(`fetch_data.php?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            const employeeList = data.LATEST_EMPLOYEES;

            const tbody = document.querySelector('table tbody');
            tbody.innerHTML = ''; // Clear old rows

            employeeList.forEach(employee => {
                const tr = document.createElement('tr');
                const trContent = `
                    <td>${employee.EDS}</td>
                    <td>${employee.FULLNAME}</td>
                    <td>${employee.PROJECT}</td>
                    <td>${employee.POSITION}</td>
                    <td>${employee.SITE}</td>
                    <td>${employee.SUPERVISOR}</td>
                    <td class="${employee.STATUS === 'INACTIVE' ? 'danger' : 'success'}">${employee.STATUS}</td>
                    <td>${employee.HIREDDATE}</td>
                    <td>${employee.RESIGNEDDATE ?? ''}</td>
                 
                `;
                tr.innerHTML = trContent;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error("Error fetching employee updates:", error));
}
