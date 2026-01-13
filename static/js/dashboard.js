// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    setupViewToggle();

    async function loadDashboard() {
        try {
            const response = await fetch('/api/checkins');
            const checkins = await response.json();

            renderCalendarView(checkins);
            renderListView(checkins);

        } catch (error) {
            document.getElementById('calendar-container').innerHTML = '<p>Error loading dashboard.</p>';
            document.getElementById('list-container').innerHTML = '<p>Error loading dashboard.</p>';
            console.error(error);
        }
    }

    function setupViewToggle() {
        const calBtn = document.getElementById('calendar-view-btn');
        const listBtn = document.getElementById('list-view-btn');
        const calContainer = document.getElementById('calendar-container');
        const listContainer = document.getElementById('list-container');

        calBtn.addEventListener('click', () => {
            calBtn.classList.add('active');
            listBtn.classList.remove('active');
            calContainer.style.display = '';
            listContainer.style.display = 'none';
        });

        listBtn.addEventListener('click', () => {
            listBtn.classList.add('active');
            calBtn.classList.remove('active');
            listContainer.style.display = '';
            calContainer.style.display = 'none';
        });
    }

    function renderCalendarView(checkins) {
        const today = new Date();
        const container = document.getElementById('calendar-container');
        let html = '<div class="checkin-grid">';

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const checked = checkins.includes(dateStr);
            html += `<div class="day ${checked ? 'checked' : 'missed'}">
                <div class="date">${date.toLocaleDateString(undefined, {weekday: 'short'})}</div>
                <div class="daynum">${date.getDate()}</div>
                <div class="status">${checked ? '✓' : '✗'}</div>
            </div>`;
        }

        html += '</div>';
        container.innerHTML = html;
    }

    function renderListView(checkins) {
        const container = document.getElementById('list-container');
        const today = new Date();
        let html = '<ul class="checkin-list">';

        // last 30 days
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const checked = checkins.includes(dateStr);
            html += `<li class="list-item ${checked ? 'checked' : 'missed'}">
                <div class="list-date">${date.toLocaleDateString()}</div>
                <div class="list-status">${checked ? 'Checked' : 'Missed'}</div>
            </li>`;
        }

        html += '</ul>';
        container.innerHTML = html;
    }
});