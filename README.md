# 🔄 mongo-pinger

[![npm version](https://img.shields.io/npm/v/mongo-pinger?color=blue)](https://www.npmjs.com/package/mongo-pinger)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

**Keep your MongoDB Atlas free-tier clusters alive with automated scheduled pings.**

MongoDB Atlas pauses inactive free-tier clusters. This CLI tool prevents that by pinging your database on a schedule via GitHub Actions—completely hands-off after a 30-second setup.

---

## 🎯 Why Use This?

- 🆓 **Free tier stays active** - No more "cluster paused" surprises
- ⚡ **30-second setup** - One command, fully automated
- 🤖 **GitHub Actions** - Runs automatically, no server needed
- 🎨 **Flexible scheduling** - Weekly, monthly, or custom cron
- 🔒 **Secure** - Uses GitHub Secrets for credentials

---

## 🚀 Quick Start

### One-Command Setup

```bash
npx mongo-pinger setup
```

That's it! The interactive wizard will:
1. ✨ Ask for your preferred schedule (weekly/monthly/custom)
2. ⏰ Let you pick the day and time
3. 📝 Generate a GitHub Actions workflow
4. 🔧 Optionally commit and push to git
5. 📋 Show you exactly what to do next

### What You Get

After setup, you'll have:
```
your-repo/
└── .github/
    └── workflows/
        └── ping.yml    # Auto-generated, ready to use
```

---

## 📖 Configuration

### 1. Add Your MongoDB URI as a Secret

The only manual step:

1. Go to your GitHub repo
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. **Name:** `DATABASE_URI`
5. **Value:** Your MongoDB connection string
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database
   ```

### 2. Push the Workflow (if not done automatically)

```bash
git add .github/workflows/ping.yml
git commit -m "Add MongoDB pinger workflow"
git push
```

### 3. Test It!

- Go to the **Actions** tab in your GitHub repo
- Click **"MongoDB Pinger"**
- Click **"Run workflow"** to test manually
- ✅ You should see "MongoDB ping successful"

---

## ⚙️ Scheduling Options

The setup wizard supports three modes:

### 📅 Weekly (Recommended)
Pick any day of the week. Perfect for free-tier clusters.

**Example:** Every Sunday at midnight UTC
```
Cron: 0 0 * * 0
```

### 📆 Monthly
Pick a day of the month (1-31). Great for low-traffic apps.

**Example:** 1st of every month at midnight UTC
```
Cron: 0 0 1 * *
```

### ⚡ Custom
Enter any valid cron expression for advanced scheduling.

**Examples:**
- `0 */12 * * *` - Every 12 hours
- `0 0 * * 1-5` - Weekdays only at midnight
- `*/30 * * * *` - Every 30 minutes (overkill!)

Use [crontab.guru](https://crontab.guru) to build custom expressions.

---

## 🧪 Testing Locally

Test your MongoDB connection before pushing:

```bash
# With environment variable
DATABASE_URI='mongodb+srv://user:pass@cluster.mongodb.net/db' npx mongo-pinger

# Or create a .env file
echo "DATABASE_URI=your_connection_string" > .env
npx mongo-pinger
```

**Expected output:**
```
✅ MongoDB ping successful
```

---

## 🔧 How It Works

1. **GitHub Actions** triggers on schedule (or manually)
2. **Installs** `mongo-pinger` from npm
3. **Connects** to your MongoDB cluster using `mongoose`
4. **Pings** the database with `db.admin().ping()`
5. **Logs** success or failure
6. **Disconnects** cleanly

The ping is lightweight—just verifies the connection. No data is modified.

---

## 📊 Monitoring

### View Execution History
1. Go to your repo's **Actions** tab
2. Click **"MongoDB Pinger"** workflow
3. See all past runs with timestamps and results

### Enable Notifications
**Settings** → **Notifications** → **GitHub Actions**
- Get emails when pings fail
- Stay informed without checking manually

### Check Next Run
The setup wizard shows you when the next ping will happen in UTC time.

---

## 🛠️ Advanced Usage

### Update Schedule

Just run setup again:
```bash
npx mongo-pinger setup
```
Choose "Yes" when asked to overwrite the existing workflow.

### Manual Trigger

Besides the schedule, you can always run manually:
- GitHub Actions tab → MongoDB Pinger → **Run workflow**

### Multiple Databases

Create separate workflows for each database:
```bash
# Rename the workflow in .github/workflows/
ping-production.yml   # Uses DATABASE_URI_PROD
ping-staging.yml      # Uses DATABASE_URI_STAGING
```

Then add multiple secrets with different names.

---

## 🐛 Troubleshooting

### "DATABASE_URI not configured"
- ✅ Check the secret name is exactly `DATABASE_URI` (case-sensitive)
- ✅ Verify you added it in **Settings → Secrets → Actions**
- ✅ Make sure you're on the default branch (`main` or `master`)

### "MongoDB ping failed: connection timeout"
- ✅ Test connection locally first: `DATABASE_URI='...' npx mongo-pinger`
- ✅ Verify your connection string is correct
- ✅ Check MongoDB Atlas **Network Access**:
  - Add `0.0.0.0/0` to whitelist GitHub Actions IPs
  - Or enable "Allow access from anywhere"

### Workflow doesn't run on schedule
- ⏰ GitHub Actions can delay 5-15 minutes during high load
- 📅 First scheduled run may not happen immediately after setup
- 💤 Repos inactive for 60+ days have schedules disabled
  - **Fix:** Make a commit to re-enable

### "Module not found" errors
- 🔄 The new version uses `npx mongo-pinger@latest` (no build needed)
- 📦 If using an old workflow, run `npx mongo-pinger setup` again

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repo
2. **Create** a feature branch: `git checkout -b feature/amazing`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing`
5. **Open** a Pull Request

### Development Setup

```bash
# Clone and install
git clone https://github.com/lankyjo/mongo-pinger.git
cd mongo-pinger
npm install

# Build TypeScript
npm run build

# Run locally
npm start

# Run setup wizard
npm run setup
```

---

## 📄 License

MIT © [Ikeji Joshua](https://github.com/lankyjo)

---

## 🙏 Acknowledgments

- Built with [Mongoose](https://mongoosejs.com/) for MongoDB connectivity
- Powered by [GitHub Actions](https://github.com/features/actions)
- Interactive prompts via [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)

---

## 📧 Support

- 🐛 [Report a bug](https://github.com/lankyjo/mongo-pinger/issues)
- 💡 [Request a feature](https://github.com/lankyjo/mongo-pinger/issues)
- ⭐ [Star on GitHub](https://github.com/lankyjo/mongo-pinger)

---

<div align="center">

**Made with ❤️ to keep your MongoDB Atlas clusters alive**

[npm](https://www.npmjs.com/package/mongo-pinger) • [GitHub](https://github.com/lankyjo/mongo-pinger) • [Issues](https://github.com/lankyjo/mongo-pinger/issues)

</div>