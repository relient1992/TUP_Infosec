document.addEventListener("DOMContentLoaded", () => {
    const USER_ROLE = sessionStorage.getItem("user_role"); // assuming this is set after login
    const allowedPagesByRole = {
        Admin: [
            "active_attrition.html",
            "bps_absenteeism.html",
            "bps_attendance_db.html",
            "bps_bfp.html",
            "bps_dashboard.html",
            "lhi_absenteeism.html",
            "project_efficiency.html",
            "team_member.html",
            "quality_scores.html",
            "lhi_scorecard.html",
            "lhi_weekly_efficiency.html"
        ],
        Manager: [
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
            "bu_lhi.html",
            "quality_scores.html",
            "lhi_scorecard.html",
            "lhi_weekly_efficiency.html"

        ],
        User: [
            "active_attrition.html",
            "bps_absenteeism.html",
            "bps_attendance_db.html",
            "bps_bfp.html",
            "bps_dashboard.html",
            "team_member.html",
            "quality_scores.html"
        ]
    };

    const userAllowedPages = allowedPagesByRole[USER_ROLE] || [];

    // Find all sidebar <a> links and match against href targets
    document.querySelectorAll('.sidebar a[data-view]').forEach(link => {
        const page = `${link.dataset.view}.html`;
        if (!userAllowedPages.includes(page)) {
            link.style.display = 'none';
        }
    });

    // Handle child dropdown items (if inside div.child-dropdown)
    document.querySelectorAll('.child-dropdown a[data-view]').forEach(link => {
        const page = `${link.dataset.view}.html`;
        if (!userAllowedPages.includes(page)) {
            link.style.display = 'none';
        }
    });

    // Optional: hide entire parent dropdown if all children are hidden
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const children = dropdown.querySelectorAll('.child-dropdown a');
        const visibleChildren = Array.from(children).filter(c => c.style.display !== 'none');
        if (visibleChildren.length === 0) {
            dropdown.style.display = 'none';
        }
    });
});
