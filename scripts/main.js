document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebar = document.getElementById('leftSidebar');
    const overlay = document.getElementById('overlay');

    // Function to toggle sidebar visibility
    function toggleSidebar() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        hamburgerBtn.classList.toggle('active');
        closeSidebarBtn.classList.toggle('active');
    }

    // Event listeners for sidebar controls
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleSidebar);
    }
    
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', toggleSidebar);
    }
    
    // Close sidebar when clicking on overlay
    if (overlay) {
        overlay.addEventListener('click', toggleSidebar);
    }
});