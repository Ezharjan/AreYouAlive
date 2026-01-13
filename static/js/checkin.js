// Daily Check-In JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const checkinBtn = document.getElementById('checkin-btn');
    const statusMessage = document.getElementById('status-message');

    // Handle check-in button click
    checkinBtn.addEventListener('click', async function() {
        checkinBtn.disabled = true;
        statusMessage.textContent = 'Checking in...';

        try {
            const response = await fetch('/api/checkin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (result.status === 'success') {
                statusMessage.textContent = result.message;
                statusMessage.style.color = 'green';
            } else if (result.status === 'info') {
                statusMessage.textContent = result.message;
                statusMessage.style.color = '#0ea5e9';
            } else {
                statusMessage.textContent = result.message || 'Check-in failed.';
                statusMessage.style.color = 'red';
            }

        } catch (error) {
            console.error('Check-in failed:', error);
            statusMessage.textContent = 'Check-in failed. Please try again.';
            statusMessage.style.color = 'red';
        } finally {
            checkinBtn.disabled = false;
        }
    });
});