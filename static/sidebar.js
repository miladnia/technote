"use strict";

function initSidebar() {
    const sidebar = document.getElementById('sidebar');

    if (!sidebar) {
        return;
    }

    const buttons = document.querySelectorAll('button[data-target="sidebar"]');
    buttons.forEach(btn => {
        btn.addEventListener('click', toggleSidebar);
    });

    sidebar.addEventListener('transitionend', event => {
        // TODO check `target`
        const headerBtn = document.getElementById('headerSidebarBtn');
        headerBtn.style.display = (0 === sidebar.offsetWidth) ? 'block' : 'none';
    });

    // Auto close the side bar if the main element has been clicked
    const mainElement = document.querySelector('main');
    mainElement.addEventListener('dblclick', () => {
        if (sidebar.offsetWidth <= 0) {
            return;
        }

        closeSidebar();
    });
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.offsetWidth > 0) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.width = '0px';
    sidebar.classList.remove('full-width');
}

function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('full-width');
    sidebar.style.removeProperty('width');
    // Hide the sidebar button in the header
    const headerBtn = document.getElementById('headerSidebarBtn');
    headerBtn.style.display = 'none';
}
