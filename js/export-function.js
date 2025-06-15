const ExportManager = {
    
    // Configuration
    config: {
        buttonContainerClass: 'export-buttons-container',
        tableId: 'team-table',
        selectId: 'teamSelect',
        fetchUrl: 'fetch_data.php'
    },

    // Initialize export functionality
    init(customConfig = {}) {
        // Merge custom config with defaults
        this.config = { ...this.config, ...customConfig };
        this.addStyles();
        this.addButtons();
        
        console.log('Export Manager initialized');
    },

    // Add export buttons to the page
    addButtons() {
        // Find container or create one
        let container = document.querySelector(`.${this.config.buttonContainerClass}`);
        
        if (!container) {
            const table = document.getElementById(this.config.tableId);
            if (table) {
                container = document.createElement('div');
                container.className = this.config.buttonContainerClass;
                table.parentElement.insertBefore(container, table);
            } else {
                console.warn('No suitable container found for export buttons');
                return;
            }
        }

        // Check if buttons already exist
        if (container.querySelector('#exportCsvBtn')) {
            return;
        }

        // Create buttons container
        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'export-buttons';

        // CSV Export Button
        const csvButton = document.createElement('button');
        csvButton.id = 'exportCsvBtn';
        csvButton.innerHTML = '📄 Export CSV';
        csvButton.className = 'export-btn csv-btn';
        csvButton.onclick = () => this.exportToCSV();

        // Excel Export Button
        const excelButton = document.createElement('button');
        excelButton.id = 'exportExcelBtn';
        excelButton.innerHTML = '📊 Export Excel';
        excelButton.className = 'export-btn excel-btn';
        excelButton.onclick = () => this.exportToExcel();

        // All Data Export Button (optional)
        const allDataButton = document.createElement('button');
        allDataButton.id = 'exportAllBtn';
        allDataButton.innerHTML = '📋 Export All Data';
        allDataButton.className = 'export-btn all-data-btn';
        allDataButton.onclick = () => this.exportAllData();

        // Add buttons to wrapper
        buttonWrapper.appendChild(csvButton);
        buttonWrapper.appendChild(excelButton);
        buttonWrapper.appendChild(allDataButton);

        // Add wrapper to container
        container.appendChild(buttonWrapper);
    },

    // Export current table to CSV
    exportToCSV() {
        const table = document.getElementById(this.config.tableId);
        const select = document.getElementById(this.config.selectId);
        
        if (!this.validateTable(table)) return;

        const rows = table.querySelectorAll('tr');
        let csvContent = '';
        
        // Process each row
        rows.forEach((row, index) => {
            const cells = Array.from(row.cells).map(cell => {
                const text = cell.textContent.trim().replace(/"/g, '""');
                return `"${text}"`;
            });
            csvContent += cells.join(',') + '\n';
        });

        // Generate filename
        const supervisorName = select?.value || 'TeamMembers';
        const filename = this.generateFilename(supervisorName, 'csv');

        this.downloadFile(csvContent, filename, 'text/csv');
    },

    // Export current table to Excel
    exportToExcel() {
        const table = document.getElementById(this.config.tableId);
        const select = document.getElementById(this.config.selectId);
        
        if (!this.validateTable(table)) return;

        const rows = table.querySelectorAll('tr');
        let excelContent = '<table border="1">';
        
        rows.forEach(row => {
            excelContent += '<tr>';
            Array.from(row.cells).forEach(cell => {
                excelContent += `<td>${cell.textContent.trim()}</td>`;
            });
            excelContent += '</tr>';
        });
        
        excelContent += '</table>';

        const supervisorName = select?.value || 'TeamMembers';
        const filename = this.generateFilename(supervisorName, 'xls');

        this.downloadFile(excelContent, filename, 'application/vnd.ms-excel');
    },

    // Export fresh data from server
    exportAllData() {
        const button = document.getElementById('exportAllBtn');
        const originalText = button.innerHTML;
        

        button.innerHTML = '⏳ Exporting...';
        button.disabled = true;

        fetch(`${this.config.fetchUrl}?action=export_all`)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) {
                    alert('No data available for export');
                    return;
                }

                // Create CSV content
                const headers = ['EDS', 'Full Name', 'Project', 'Position', 'Site', 'Supervisor', 'Status', 'Date Hired'];
                let csvContent = '"' + headers.join('","') + '"\n';

                data.forEach(row => {
                    const rowData = [
                        row.EDS || '',
                        row.FULLNAME || '',
                        row.PROJECT || '',
                        row.POSITION || '',
                        row.SITE || '',
                        row.SUPERVISOR || '',
                        row.emp_status || '',
                        row.DATEHIRED || ''
                    ];
                    
                    const escapedData = rowData.map(cell => 
                        `"${String(cell).replace(/"/g, '""')}"`
                    );
                    csvContent += escapedData.join(',') + '\n';
                });

                const filename = this.generateFilename('AllTeamMembers', 'csv');
                this.downloadFile(csvContent, filename, 'text/csv');
            })
            .catch(error => {
                console.error('Export error:', error);
                alert('Error exporting data. Please try again.');
            })
            .finally(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            });
    },

    // Export filtered data by supervisor
    exportFilteredData(supervisorName) {
        if (!supervisorName) {
            alert('Please select a supervisor first');
            return;
        }

        const button = document.getElementById('exportCsvBtn');
        const originalText = button.innerHTML;
        
        button.innerHTML = '⏳ Exporting...';
        button.disabled = true;

        fetch(`${this.config.fetchUrl}?action=filter&name=${encodeURIComponent(supervisorName)}`)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) {
                    alert('No data found for this supervisor');
                    return;
                }

                const headers = ['EDS', 'Full Name', 'Project', 'Position', 'Site', 'Supervisor', 'Status', 'Date Hired'];
                let csvContent = '"' + headers.join('","') + '"\n';

                data.forEach(row => {
                    const rowData = [
                        row.EDS || '', row.FULLNAME || '', row.PROJECT || '', row.POSITION || '',
                        row.SITE || '', row.SUPERVISOR || '', row.emp_status || '', row.DATEHIRED || ''
                    ];
                    
                    const escapedData = rowData.map(cell => `"${String(cell).replace(/"/g, '""')}"`);
                    csvContent += escapedData.join(',') + '\n';
                });

                const filename = this.generateFilename(supervisorName, 'csv');
                this.downloadFile(csvContent, filename, 'text/csv');
            })
            .catch(error => {
                console.error('Export error:', error);
                alert('Error exporting data. Please try again.');
            })
            .finally(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            });
    },

    // Utility functions
    validateTable(table) {
        if (!table) {
            alert('No table found to export');
            return false;
        }

        const rows = table.querySelectorAll('tr');
        if (rows.length <= 1) {
            alert('No data to export');
            return false;
        }

        return true;
    },

    generateFilename(prefix, extension) {
        const date = new Date().toISOString().split('T')[0];
        const sanitizedPrefix = prefix.replace(/[^a-zA-Z0-9]/g, '_');
        return `${sanitizedPrefix}_${date}.${extension}`;
    },

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            // Fallback for older browsers
            const url = `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;
            window.open(url);
        }
    },

    addStyles() {
        
        if (document.getElementById('export-styles')) return;

        const style = document.createElement('style');
        style.id = 'export-styles';
        style.textContent = `
            .export-buttons-container {
                margin-bottom: 20px;
            }
            
            .export-buttons {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                align-items: center;
            }
            
            .export-btn {
                padding: 10px 16px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 5px;
            }
            
            .export-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            
            .export-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            
            .csv-btn {
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
            }
            
            .excel-btn {
                background: linear-gradient(135deg, #007bff, #6f42c1);
                color: white;
            }
            
            .all-data-btn {
                background: linear-gradient(135deg, #ffc107, #fd7e14);
                color: #212529;
            }
            
            @media (max-width: 768px) {
                .export-buttons {
                    flex-direction: column;
                    align-items: stretch;
                }
                
                .export-btn {
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

function addExportButtons() {
    ExportManager.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExportManager;
}