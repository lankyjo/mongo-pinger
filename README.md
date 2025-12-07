# ⚡ mongo-pinger: Keep Your MongoDB Atlas Free Tier Clusters Alive

[![npm version](https://img.shields.io/npm/v/mongo-pinger?color=blue)](https://www.npmjs.com/package/mongo-pinger)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

**Automated, scheduled pings to prevent MongoDB Atlas from pausing your free-tier clusters.**

This lightweight CLI tool leverages **GitHub Actions** to ping your database on a schedule. It's completely hands-off after a 30-second, one-command setup.

---

## ✨ Key Benefits
* **🆓 Stays Active** - No more "cluster paused" downtime surprises.
* **⏱️ Quick Setup** - One command, fully automated, less than a minute.
* **🤖 Serverless** - Runs automatically via **GitHub Actions** (no dedicated server needed).
* **🗓️ Flexible** - Supports weekly, monthly, or custom cron scheduling.
* **🔒 Secure** - Your connection string is safely stored as a **GitHub Secret**.

---

## 🚀 Quick Start: 30-Second Setup

### 1. Run the Interactive Wizard

Start the setup with a single command. The wizard guides you through scheduling and configuration.

```bash
npx mongo-pinger setup
````

The wizard will:

1.  Ask for your preferred schedule (**Weekly**/Monthly/Custom).
2.  Generate the required **GitHub Actions workflow** (`.github/workflows/ping.yml`).
3.  Optionally commit and push the workflow to your repository.
4.  Show you the exact next steps (adding the secret).

### 2\. What You Get

After the setup, your repository will contain the new workflow file:

```
your-repo/
└── .github/
    └── workflows/
        └── ping.yml # Auto-generated GitHub Actions workflow
```

-----

## 🔑 Configuration: The Only Manual Step

### Add Your MongoDB URI as a GitHub Secret

For security, your MongoDB connection string must be stored as a GitHub Secret.

1.  Go to your GitHub repository.
2.  Navigate to **Settings** → **Secrets and variables** → **Actions**.
3.  Click **"New repository secret"**.
4.  Set the **Name** to: `DATABASE_URI` (must be exact).
5.  Set the **Value** to your MongoDB Atlas connection string:
    ```
    mongodb+srv://username:password@cluster.mongodb.net/database
    ```

### Push and Test

1.  **Commit the workflow** (if the wizard didn't do it automatically):
    ```bash
    git add .github/workflows/ping.yml
    git commit -m "Add MongoDB pinger workflow"
    git push
    ```
2.  **Test It Manually** (Recommended):
      * Go to the **Actions** tab in your GitHub repo.
      * Click the **"MongoDB Pinger"** workflow.
      * Click **"Run workflow"** to execute the ping immediately.
      * **Success** will show: `✅ MongoDB ping successful`.

-----

## 📅 Scheduling Options

The setup wizard helps you build the right cron expression for your needs:

| Mode | Description | Example Cron | Frequency |
| :--- | :--- | :--- | :--- |
| **Weekly** (Recommended) | Pick any day of the week. | `0 0 * * 0` | Every Sunday at midnight UTC |
| **Monthly** | Pick a day of the month (1-31). | `0 0 1 * *` | 1st of every month at midnight UTC |
| **Custom** | Enter any valid cron expression. | `0 */12 * * *` | Every 12 hours |

> **Need a custom cron?** Use [crontab.guru](https://crontab.guru) to build and validate advanced expressions.

-----

## 🛠️ How It Works Under the Hood

The process is lightweight and non-destructive:

1.  **GitHub Actions** triggers on the defined schedule.
2.  **Installs** `mongo-pinger` from npm.
3.  **Connects** to your MongoDB cluster using the `DATABASE_URI` secret.
4.  **Pings** the database using `db.admin().ping()` (a simple connection check).
5.  **Logs** the success or failure.
6.  **Disconnects** cleanly.

**Crucially:** The ping is a connection verification. **No data is modified or accessed.**

-----

## 🔍 Monitoring & Management

### View Execution History

  * In your repo's **Actions** tab, select the **"MongoDB Pinger"** workflow. You can view all past runs, timestamps, and results.

### Enable Notifications

  * Go to **Settings** → **Notifications** → **GitHub Actions** to get emails if a ping fails.

### Test Locally

You can verify your connection before pushing the workflow:

```bash
# Using an environment variable directly
DATABASE_URI='mongodb+srv://user:pass@cluster.mongodb.net/db' npx mongo-pinger

# Or by creating a temporary .env file
echo "DATABASE_URI=your_connection_string" > .env
npx mongo-pinger
```

**Expected output:** `✅ MongoDB ping successful`

### Update Your Schedule

Simply run the setup command again:

```bash
npx mongo-pinger setup
```

Choose "Yes" when prompted to overwrite the existing workflow (`ping.yml`).

-----

## 🚨 Troubleshooting Common Issues

| Issue | Potential Cause(s) | Solution |
| :--- | :--- | :--- |
| **`DATABASE_URI not configured`** | Incorrect secret name or location. | **Name must be exactly `DATABASE_URI`** (case-sensitive). Verify it's in **Settings** → **Secrets** → **Actions**. |
| **`connection timeout`** | Incorrect connection string or Network Access issue. | 1. Test locally first: `DATABASE_URI='...' npx mongo-pinger`. 2. Check MongoDB Atlas **Network Access** settings and add `0.0.0.0/0` to your IP whitelist or enable "Allow access from anywhere." |
| **Workflow doesn't run on schedule** | GitHub delay, or repository is too inactive. | 1. Expect a 5-15 minute delay. 2. Repos inactive for 60+ days have schedules disabled—**make a commit to re-enable them.** |

-----

## 🤝 Contributing

Contributions are warmly welcomed\! Please see our [Contributing Guide](https://www.google.com/search?q=https://github.com/lankyjo/mongo-pinger/blob/main/CONTRIBUTING.md) (or similar link) for details.

### Development Setup

```bash
# Clone and install
git clone [https://github.com/lankyjo/mongo-pinger.git](https://github.com/lankyjo/mongo-pinger.git)
cd mongo-pinger
npm install
# Build TypeScript
npm run build
# Run setup wizard
npm run setup
```

-----

## 📄 License & Acknowledgments

**License:** MIT © [Ikeji Joshua](https://github.com/lankyjo)

**Acknowledgments:**

  * Built with [Mongoose](https://mongoosejs.com/) for reliable MongoDB connectivity.
  * Powered by [GitHub Actions](https://github.com/features/actions) for serverless scheduling.

-----

<div align="center"\>
**Made with ❤️ to keep your MongoDB Atlas clusters alive**
[npm](https://www.npmjs.com/package/mongo-pinger) • [GitHub](https://github.com/lankyjo/mongo-pinger) • [Issues](https://github.com/lankyjo/mongo-pinger/issues)
</div\>
