// Daily Check-In JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const checkinBtn = document.getElementById('checkin-btn');
    const statusMessage = document.getElementById('status-message');
    const setupSection = document.getElementById('setup-section');
    const checkinSection = document.getElementById('checkin-section');

    // Load configuration
    loadConfig();

    async function loadConfig() {
        try {
            const response = await fetch('config.yml');
            if (!response.ok) throw new Error('Config not found');
            const configText = await response.text();
            const config = parseYaml(configText);

            // Check if config is properly set
            if (config.repo_owner === 'your-github-username' ||
                config.repo_name === 'daily-checkin-monitor') {
                setupSection.classList.remove('hidden');
                checkinSection.classList.add('hidden');
                return;
            }

            window.config = config;

            // Check if PAT is stored
            const storedPat = localStorage.getItem('dailyCheckinPat');
            if (!storedPat) {
                // Prompt for PAT
                const pat = prompt('Enter your GitHub Personal Access Token (with repo scope):');
                if (pat) {
                    localStorage.setItem('dailyCheckinPat', pat);
                    checkinBtn.disabled = false;
                } else {
                    statusMessage.textContent = 'Personal Access Token required for check-in.';
                    statusMessage.style.color = 'red';
                    return;
                }
            }

            checkinBtn.disabled = false;

        } catch (error) {
            console.error('Error loading config:', error);
            setupSection.classList.remove('hidden');
            checkinSection.classList.add('hidden');
        }
    }

    // Handle check-in button click
    checkinBtn.addEventListener('click', async function() {
        checkinBtn.disabled = true;
        statusMessage.textContent = 'Checking in...';

        try {
            const today = new Date().toISOString().split('T')[0];
            const pat = localStorage.getItem('dailyCheckinPat');

            // Send repository dispatch event
            const response = await fetch(`https://api.github.com/repos/${window.config.repo_owner}/${window.config.repo_name}/dispatches`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${pat}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    event_type: 'checkin',
                    client_payload: {
                        date: today
                    }
                })
            });

            if (response.ok) {
                statusMessage.textContent = 'Check-in successful! ✓';
                statusMessage.style.color = 'green';
                // Store locally for immediate feedback
                localStorage.setItem('lastCheckin', today);
            } else {
                throw new Error(`HTTP ${response.status}`);
            }

        } catch (error) {
            console.error('Check-in failed:', error);
            statusMessage.textContent = 'Check-in failed. Please try again.';
            statusMessage.style.color = 'red';
        } finally {
            checkinBtn.disabled = false;
        }
    });

    // Simple YAML parser
    function parseYaml(yaml) {
        const lines = yaml.split('\n');
        const config = {};
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split(':');
                if (key && valueParts.length > 0) {
                    config[key.trim()] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
                }
            });
        return config;
    }
});