// Handle parent click to toggle dropdown
document.querySelectorAll('.sidebar .dropdown > .parent').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const parentDropdown = this.parentElement;

        // Close all dropdowns and Only remove 'active' if it's not the clicked dropdown
        document.querySelectorAll('.sidebar .dropdown').forEach(dropdown => {
            if (dropdown !== parentDropdown) {
                dropdown.classList.remove('active');
            }
        });

        parentDropdown.classList.toggle('active');
    });
});

// Handle child click
document.querySelectorAll('.sidebar .child-dropdown a').forEach(childLink => {
    childLink.addEventListener('click', function (e) {
        e.stopPropagation();

        
        document.querySelectorAll('.sidebar .dropdown').forEach(openDropdown => {
            openDropdown.classList.remove('active');
        });

        
        const dropdown = this.closest('.dropdown');
        if (dropdown) {
            dropdown.classList.add('active');
        }

        // Highlight the clicked child
        document.querySelectorAll('.sidebar .child-dropdown a.active').forEach(link => {
            link.classList.remove('active');
        });
        this.classList.add('active');
    });
});

document.addEventListener('click', function(e) {
    if (!e.target.closest('.sidebar .dropdown')) {
        document.querySelectorAll('.sidebar .dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        
    }
});