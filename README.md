# Daily Check-In Monitor

## 基于'死了吗'/'活着吗'软件产生的灵感 - Inspired by 'Are You Alive' apps

A simple, serverless daily check-in system that runs entirely on GitHub Pages and GitHub Actions. Get notified if you forget to check in daily.



Keywords/Tags: Are You Alive; AreYouAlive; daily check-in; check-in monitor; check-in reminder; daily check-in app; wellness check; elderly monitoring; senior safety; caregiver alerts; family alerts; emergency contact; email alerts; automated alerts; Python; Flask; SMTP; background tasks; scheduled tasks; cron; responsive web app; mobile-friendly; accessibility; 'I'm Alive' button; check-in dashboard; 7-day history; health monitoring; fall detection; home safety; lone worker check-in; 老年人; 签到提醒; 每日签到; 活着吗; 死了吗.

A simple, open-source server-based daily check-in system that helps you monitor well-being and sends automated email alerts if a check-in is missed.


Developed by [Alexander Ezharjan](https://ezharjan.github.io/).


<br>


### 🚀 One-Click Deployment

1. **Create a new GitHub repository** from this template
2. **Enable GitHub Pages** in repository settings (Settings → Pages → Source: Deploy from a branch → main)
3. **Create a Personal Access Token**:
   - Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
   - Generate new token with `repo` scope
   - Copy the token
4. **Edit `config.yml`** in your repository:
   - Set `repo_owner` to your GitHub username
   - Set `repo_name` to your repository name
   - Set `emergency_email` to your contact email
   - **Security Note**: Your Personal Access Token is now entered securely through the app interface and stored locally in your browser only.
5. **Set up email notifications** (choose one option):
   
   **Option A: SendGrid (recommended)**
   - Sign up at [SendGrid](https://sendgrid.com)
   - Create an API key
   - Add to GitHub Secrets: `SENDGRID_API_KEY`
   - Verify your sender email in SendGrid
   
   **Option B: Direct SMTP (free, using Gmail)**
   - For Gmail: Go to Google Account settings → Security → 2-Step Verification → App passwords
   - Generate an App Password for "Mail"
   - Add to GitHub Secrets: `SMTP_USERNAME` (your Gmail address), `SMTP_PASSWORD` (the App Password)
   - Edit `config.yml` with your SMTP settings
6. **Visit your site**: `https://your-username.github.io/your-repo-name/`

### ⚙️ Configuration

Edit `config.yml` to customize:

```yaml
# Repository settings
repo_owner: "your-github-username"
repo_name: "daily-checkin-monitor"

# NOTE: Personal Access Token is now entered securely via the app interface
# Do NOT put your PAT in this file - it will be stored locally in your browser

# Check-in settings
checkin_schedule: "08:00"  # Expected check-in time (UTC)
alert_time: "20:00"        # When to check for missed check-ins (UTC)
grace_period_hours: 4      # Hours of grace after schedule

# Emergency contact
emergency_email: "your-email@example.com"

# SendGrid settings
sendgrid_from_email: "noreply@yourdomain.com"
```

### 📊 How It Works

1. **Daily Check-In**: Click the "I'm Alive!" button on the main page
2. **Automated Monitoring**: GitHub Actions checks daily at the configured time
3. **Email Alerts**: If no check-in detected, sends notification to emergency contact
4. **Dashboard**: View your check-in history for the last 7 days

### 🧪 Local Testing

Before deploying to GitHub, you can test the application locally:

#### Option 1: Simple Browser Test (Limited)
1. Open `index.html` directly in your browser
2. The UI will load, but check-in functionality will fail due to CORS restrictions
3. Open `dashboard.html` to see the dashboard layout (will show no data initially)

#### Option 2: Local Server (Recommended)
1. **Using Python** (if installed):
   ```bash
   cd /path/to/your/project
   python -m http.server 8000
   ```
   Then visit `http://localhost:8000`

2. **Using Node.js** (if installed):
   ```bash
   npm install -g http-server
   cd /path/to/your/project
   http-server
   ```
   Then visit `http://localhost:8080`

3. **Using VS Code**:
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

#### Testing Checklist
- [x] Page loads without errors
- [x] Config validation shows setup section (since config has placeholder values)
- [x] When config is set, app prompts for Personal Access Token (enter a test token or skip for UI testing)
- [x] Large round "I'm Alive!" button displays prominently
- [x] Dashboard shows "No check-in data available yet"
- [x] No console errors in browser dev tools
- [x] Mobile responsive (resize browser window)

**Note**: Full check-in functionality requires a GitHub repository. API calls will fail locally due to CORS, but you can verify the UI and logic.

### 🔧 Troubleshooting

**Check-in button not working:**
- Verify `config.yml` is properly configured
- Check browser console for errors
- Ensure Personal Access Token has `repo` scope

**No email notifications:**
- For SendGrid: Confirm SendGrid API key is set in GitHub Secrets and sender email is verified
- For SMTP: Confirm SMTP_USERNAME and SMTP_PASSWORD are set in GitHub Secrets, and config.yml has correct SMTP settings
- Check SendGrid/SMTP sender email is verified
- Review GitHub Actions logs for errors

**GitHub Pages not loading:**
- Ensure Pages is enabled in repository settings
- Wait a few minutes after setup for deployment

### 📝 License

MIT License - Feel free to use and modify for personal use.

### 🤝 Contributing

This is a simple project for personal use. Pull requests welcome for improvements!