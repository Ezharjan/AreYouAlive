from flask import Flask, render_template, request, jsonify
import json
import os
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import schedule
import time
import threading

# Load environment variables from .env file if it exists
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = Flask(__name__)

# Configuration
CONFIG = {
    'checkin_schedule': '08:00',
    'alert_time': '20:00',
    'grace_period_hours': 4,
    'emergency_email': os.environ.get('EMERGENCY_EMAIL', 'your-email@example.com'),
    'smtp_server': os.environ.get('SMTP_SERVER', 'smtp.gmail.com'),
    'smtp_port': int(os.environ.get('SMTP_PORT', 587)),
    'smtp_username': os.environ.get('SMTP_USERNAME', ''),
    'smtp_password': os.environ.get('SMTP_PASSWORD', ''),
    'smtp_from_email': os.environ.get('SMTP_FROM_EMAIL', ''),
    'notification_subject': 'Daily Check-In Reminder',
    'notification_message': '''This is an automated reminder from your Daily Check-In Monitor.

You haven't checked in today. Please visit your check-in page and click the check-in button.

If you're unable to check in, please contact your emergency contact.'''
}

CHECKINS_FILE = 'checkins.json'

def load_checkins():
    if os.path.exists(CHECKINS_FILE):
        with open(CHECKINS_FILE, 'r') as f:
            return json.load(f)
    return []

def save_checkins(checkins):
    with open(CHECKINS_FILE, 'w') as f:
        json.dump(checkins, f)

def send_email(subject, message, to_email):
    try:
        msg = MIMEMultipart()
        msg['From'] = CONFIG['smtp_from_email']
        msg['To'] = to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(message, 'plain'))

        server = smtplib.SMTP(CONFIG['smtp_server'], CONFIG['smtp_port'])
        server.starttls()
        server.login(CONFIG['smtp_username'], CONFIG['smtp_password'])
        text = msg.as_string()
        server.sendmail(CONFIG['smtp_from_email'], to_email, text)
        server.quit()
        print('Email sent successfully')
        return True
    except Exception as e:
        print(f'Failed to send email: {e}')
        return False

def check_missed_checkin():
    today = datetime.now().date().isoformat()
    checkins = load_checkins()
    
    if today not in checkins:
        print(f"No check-in detected for {today}. Sending notification.")
        success = send_email(CONFIG['notification_subject'], CONFIG['notification_message'], CONFIG['emergency_email'])
        if success:
            print("Notification email sent successfully.")
        else:
            print("Failed to send notification email.")
    else:
        print(f"Check-in confirmed for {today}.")

def schedule_checker():
    # Schedule daily check at alert_time
    schedule.every().day.at(CONFIG['alert_time']).do(check_missed_checkin)
    
    while True:
        schedule.run_pending()
        time.sleep(60)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/checkin', methods=['POST'])
def checkin():
    try:
        today = datetime.now().date().isoformat()
        checkins = load_checkins()

        if today not in checkins:
            checkins.append(today)
            # Sort checkins by date (newest first)
            checkins.sort(reverse=True)
            # Keep only last 30 days to prevent file from growing too large
            cutoff_date = (datetime.now() - timedelta(days=30)).date().isoformat()
            checkins = [date for date in checkins if date >= cutoff_date]
            save_checkins(checkins)
            return jsonify({'status': 'success', 'message': 'Check-in successful!'})
        else:
            return jsonify({'status': 'info', 'message': 'Already checked in today!'})
    except Exception as e:
        print(f"Error during check-in: {e}")
        return jsonify({'status': 'error', 'message': 'Check-in failed. Please try again.'}), 500

@app.route('/api/checkins')
def get_checkins():
    checkins = load_checkins()
    return jsonify(checkins)

if __name__ == '__main__':
    print("Starting Daily Check-In Monitor...")
    print(f"Alert time: {CONFIG['alert_time']}")
    print(f"Emergency email: {CONFIG['emergency_email']}")
    
    # Start the scheduler in a separate thread
    scheduler_thread = threading.Thread(target=schedule_checker, daemon=True)
    scheduler_thread.start()
    print("Scheduler started.")
    
    app.run(debug=os.environ.get('FLASK_DEBUG', 'False').lower() == 'true', 
            host='0.0.0.0', 
            port=int(os.environ.get('PORT', 5000)))