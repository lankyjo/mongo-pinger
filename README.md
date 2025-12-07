# mongo-pinger [![npm version](https://img.shields.io/npm/v/mongo-pinger?color=blue)](https://www.npmjs.com/package/mongo-pinger) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT) [![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)

**Keep your MongoDB Atlas free-tier (M0) clusters alive — forever. No server needed.**

Atlas pauses inactive free-tier clusters. This tiny CLI prevents that using a scheduled GitHub Actions workflow.

- Completely free  
- 30-second setup  
- Runs automatically via GitHub Actions  
- Works on private repos too  

---

## Quick Start (Actually Works in 2025)

```bash
# Step 1: Install the package locally (required due to Node.js ESM)
npm install mongo-pinger

# Step 2: Run the interactive setup wizard
npx mongo-pinger setup
The wizard will:

Ask your preferred schedule (weekly recommended)
Generate .github/workflows/ping.yml
Optionally commit & push for you

After Setup – One Manual Step

Go to your GitHub repo → Settings → Secrets and variables → Actions
Add new secret:
Name:DATABASE_URI (exactly this, case-sensitive)
Value: Your full MongoDB connection string
mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/<dbname>


Done! Your cluster will stay awake forever.

Test Instantly
Go to Actions tab → "MongoDB Pinger" → Run workflow (blue button)
You should see: MongoDB ping successful

Recommended Schedules

FrequencyCron ExpressionRecommended ForWeekly (default)0 0 * * SUNMost users – perfect balanceEvery 3 days0 0 */3 * *Extra safeDaily0 0 * * *Very active projectsEvery 12 hours0 */12 * * *Maximum safety
Use crontab.guru for custom schedules.

Local Testing (Before Pushing)
Bash# One-liner
DATABASE_URI='mongodb+srv://...' npx mongo-pinger

# Or with .env file
echo "DATABASE_URI=mongodb+srv://..." > .env
npx mongo-pinger
Success output:
textMongoDB ping successful

Update Schedule Later
Just run setup again (safe to overwrite):
Bashnpx mongo-pinger setup
Answer "Yes" when asked to replace the existing workflow.

Troubleshooting (2025 Edition)

ProblemSolutionERR_MODULE_NOT_FOUND: mongooseAlways run npm install mongo-pinger before npx mongo-pinger setupConnection timeout in GitHub ActionsAtlas → Network Access → Add IP 0.0.0.0/0 (allow access from anywhere)DATABASE_URI not configuredSecret name must be exactly DATABASE_URIWorkflow never runs on scheduleMake any commit after adding the workflow (wakes up GitHub scheduler)

Multiple Databases?
Run setup multiple times and rename the files:
Bash.github/workflows/ping-production.yml  → uses DATABASE_URI_PROD
.github/workflows/ping-staging.yml     → uses DATABASE_URI_STAGING
Add corresponding secrets in GitHub.

How It Works

GitHub Actions triggers on schedule
Installs mongo-pinger
Connects using Mongoose
Runs lightweight db.admin().ping()
Disconnects cleanly

No data is read or modified.

License
MIT © Ikeji Joshua


  Never see "Your cluster is paused" again


  GitHub • 
  npm • 
  Issues • 
  Star ⭐

```
