# mongo-pinger

![npm](https://img.shields.io/npm/v/mongo-pinger?color=blue)
![License: MIT](https://img.shields.io/badge/License-MIT-green)
![GitHub Actions](https://img.shields.io/github/workflow/status/lankyjo/mongo-pinger/Node.js%20CI)

🔔 **Keep your MongoDB Atlas clusters alive** with an automated ping system.  
This CLI prevents MongoDB Atlas from pausing idle clusters by running scheduled pings via **GitHub Actions**.

---

## ✨ Features
- ✅ Simple CLI (`npx mongo-pinger setup`)  
- ✅ Keeps MongoDB clusters awake  
- ✅ Fully automated with GitHub Actions  
- ✅ Customizable schedule (weekly or monthly)  
- ✅ Uses `mongoose` for connectivity check  

---

## 📦 Installation

Run directly with `npx` (no global install needed):

```bash
npx mongo-pinger setup
This interactive setup will:

Ask for ping frequency (weekly or monthly).

If weekly → pick a day of the week.

If monthly → pick a day of the month.

Generate a GitHub Actions workflow: .github/workflows/ping.yml.

⚙️ Setup
1. Add MongoDB Secret
Go to your repo settings:
Settings > Secrets and variables > Actions > New repository secret

Name: DATABASE_URI

Value: your MongoDB Atlas URI

2. Workflow file
After running setup, your repo will contain:

bash
Copy code
.github/
  workflows/
    ping.yml   # GitHub Action to ping your DB
This workflow runs automatically on the schedule you chose and can also be triggered manually via GitHub.

🚀 Usage
Run locally to test ping:

bash
Copy code
npx mongo-pinger
Example GitHub Action logs:

bash
Copy code
✅ MongoDB ping successful
❌ MongoDB ping failed: connection timeout
🛠 Development
Clone the repo and build locally:

bash
Copy code
git clone https://github.com/lankyjo/mongo-pinger.git
cd mongo-pinger
npm install
npm run build
npm link
mongo-pinger
🧹 Recommended .gitignore
bash
Copy code
node_modules/
dist/
.env
*.log
.vscode/
.idea/
.DS_Store
Thumbs.db
coverage/
📄 License
MIT © Ikeji Joshua