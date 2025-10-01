#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import inquirer from "inquirer";

// Helper to convert cron to human-readable format
function cronToHuman(cron: string, frequency: string, dayOrDate: string): string {
  if (frequency === "Weekly") {
    return `Every ${dayOrDate} at 12:00 AM UTC`;
  } else {
    const suffix = (n: number) => {
      if (n >= 11 && n <= 13) return "th";
      switch (n % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };
    const num = parseInt(dayOrDate);
    return `Every ${num}${suffix(num)} of the month at 12:00 AM UTC`;
  }
}

// Calculate next run time
function getNextRun(cron: string): string {
  const now = new Date();
  const [minute, hour, dayOfMonth, month, dayOfWeek] = cron.split(" ");
  
  if (dayOfWeek !== "*") {
    // Weekly schedule
    const targetDay = parseInt(dayOfWeek ?? "0");
    const currentDay = now.getUTCDay();
    let daysUntil = targetDay - currentDay;
    if (daysUntil <= 0) daysUntil += 7;
    
    const nextRun = new Date(now);
    nextRun.setUTCDate(now.getUTCDate() + daysUntil);
    nextRun.setUTCHours(parseInt(hour ?? "0"), parseInt(minute ?? "0"), 0, 0);
    
    return nextRun.toUTCString();
  } else {
    // Monthly schedule
    const targetDate = parseInt(dayOfMonth ?? "1");
    const nextRun = new Date(now);
    
    if (now.getUTCDate() >= targetDate) {
      nextRun.setUTCMonth(now.getUTCMonth() + 1);
    }
    nextRun.setUTCDate(targetDate);
    nextRun.setUTCHours(parseInt(hour ?? "0"), parseInt(minute ?? "0"), 0, 0);
    
    return nextRun.toUTCString();
  }
}

// Check if git repo exists
function isGitRepo(): boolean {
  try {
    execSync("git rev-parse --git-dir", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// Get current branch name
function getCurrentBranch(): string {
  try {
    return execSync("git branch --show-current", { encoding: "utf8" }).trim();
  } catch {
    return "main";
  }
}

export async function setup() {
  console.log("🚀 Setting up MongoDB Pinger GitHub Action...\n");

  try {
    const prompt = inquirer.createPromptModule();

    // Check if workflow already exists
    const workflowPath = path.join(process.cwd(), ".github", "workflows", "ping.yml");
    if (fs.existsSync(workflowPath)) {
      const { overwrite } = await prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: "⚠️  Workflow file already exists. Overwrite it?",
          default: false
        }
      ]);
      
      if (!overwrite) {
        console.log("❌ Setup cancelled. Existing workflow preserved.");
        return;
      }
    }

    const { frequency } = await prompt([
      {
        type: "list",
        name: "frequency",
        message: "How often do you want to ping MongoDB?",
        choices: [
          { name: "📅 Weekly (Recommended for free tier)", value: "Weekly" },
          { name: "📆 Monthly", value: "Monthly" },
          { name: "⚡ Custom cron expression", value: "Custom" }
        ],
      },
    ]);

    let cron = "";
    let scheduleDescription = "";

    if (frequency === "Custom") {
      const { customCron } = await prompt([
        {
          type: "input",
          name: "customCron",
          message: "Enter cron expression (e.g., '0 */12 * * *' for every 12 hours):",
          validate: (val) => {
            const parts = val.trim().split(/\s+/);
            if (parts.length !== 5) {
              return "Cron expression must have exactly 5 parts (minute hour day month day-of-week)";
            }
            return true;
          }
        }
      ]);
      cron = customCron.trim();
      scheduleDescription = `Custom: ${cron}`;
    } else if (frequency === "Weekly") {
      const { day } = await prompt([
        {
          type: "list",
          name: "day",
          message: "Pick a day of the week:",
          choices: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        }
      ]);
      const days: Record<string, number> = {
        Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
        Thursday: 4, Friday: 5, Saturday: 6
      };
      cron = `0 0 * * ${days[day]}`;
      scheduleDescription = cronToHuman(cron, frequency, day);
    } else {
      const { date } = await prompt([
        {
          type: "input",
          name: "date",
          message: "Enter day of the month (1–28 recommended):",
          validate: (val) => {
            const num = parseInt(val);
            if (isNaN(num) || num < 1 || num > 31) {
              return "Please enter a number between 1 and 31";
            }
            return true;
          },
          filter: (val) => parseInt(val)
        }
      ]);
      
      if (date > 28) {
        console.log("⚠️  Note: Days 29-31 will be skipped in months that don't have them.");
      }
      
      cron = `0 0 ${date} * *`;
      scheduleDescription = cronToHuman(cron, frequency, date.toString());
    }

    // Time zone customization
    const { customTime } = await prompt([
      {
        type: "confirm",
        name: "customTime",
        message: "Would you like to customize the time? (Default is midnight UTC)",
        default: false
      }
    ]);

    if (customTime) {
      const { hour, minute } = await prompt([
        {
          type: "input",
          name: "hour",
          message: "Hour (0-23, UTC):",
          default: "0",
          validate: (val) => {
            const num = parseInt(val);
            return (num >= 0 && num <= 23) || "Must be between 0 and 23";
          },
          filter: (val) => parseInt(val)
        },
        {
          type: "input",
          name: "minute",
          message: "Minute (0-59):",
          default: "0",
          validate: (val) => {
            const num = parseInt(val);
            return (num >= 0 && num <= 59) || "Must be between 0 and 59";
          },
          filter: (val) => parseInt(val)
        }
      ]);
      
      const parts = cron.split(" ");
      parts[0] = minute.toString();
      parts[1] = hour.toString();
      cron = parts.join(" ");
      
      const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      scheduleDescription = scheduleDescription.replace("12:00 AM", timeStr);
    }

    // --- Confirmation ---
    console.log("\n📅 Schedule Configuration:");
    console.log(`   Cron: ${cron}`);
    console.log(`   Runs: ${scheduleDescription}`);
    console.log(`   Next: ${getNextRun(cron)}`);
    console.log(`   Timezone: UTC\n`);

    const { confirm } = await prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "Does this look correct?",
        default: true
      }
    ]);

    if (!confirm) {
      console.log("❌ Setup cancelled. Run 'npx mongo-pinger setup' to try again.");
      return;
    }

    // --- Generate workflow YAML ---
    const workflow = `name: MongoDB Pinger

on:
  schedule:
    - cron: "${cron}"
  workflow_dispatch: # Manual trigger button in GitHub Actions tab

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
      
      - name: Run MongoDB Pinger
        run: npx mongo-pinger@latest
        env:
          DATABASE_URI: \${{ secrets.DATABASE_URI }}
`;

    const dir = path.join(process.cwd(), ".github", "workflows");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(workflowPath, workflow);

    console.log("✅ Workflow created at .github/workflows/ping.yml");

    // --- Git integration ---
    if (isGitRepo()) {
      const { commitWorkflow } = await prompt([
        {
          type: "confirm",
          name: "commitWorkflow",
          message: "Commit the workflow file to git?",
          default: true
        }
      ]);

      if (commitWorkflow) {
        try {
          execSync("git add .github/workflows/ping.yml", { stdio: "ignore" });
          execSync('git commit -m "Add MongoDB Pinger workflow"', { stdio: "ignore" });
          console.log("✅ Workflow committed to git");
          
          const currentBranch = getCurrentBranch();
          const { pushNow } = await prompt([
            {
              type: "confirm",
              name: "pushNow",
              message: `Push to remote (${currentBranch})?`,
              default: false
            }
          ]);

          if (pushNow) {
            execSync(`git push origin ${currentBranch}`, { stdio: "inherit" });
            console.log("✅ Pushed to remote");
          }
        } catch (error) {
          console.log("⚠️  Git operations failed. You can commit manually.");
        }
      }
    }

    // --- Create .env.example ---
    const envExamplePath = path.join(process.cwd(), ".env.example");
    if (!fs.existsSync(envExamplePath)) {
      fs.writeFileSync(envExamplePath, "DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/database\n");
      console.log("✅ Created .env.example for reference");
    }

    // --- Final instructions ---
    console.log("\n" + "=".repeat(60));
    console.log("🎉 Setup Complete!");
    console.log("=".repeat(60));
    console.log("\n📋 Next Steps:");
    console.log("\n1️⃣  Add DATABASE_URI as a GitHub Actions secret:");
    console.log("   • Go to your repo on GitHub");
    console.log("   • Settings → Secrets and variables → Actions");
    console.log("   • Click 'New repository secret'");
    console.log("   • Name: DATABASE_URI");
    console.log("   • Value: your MongoDB connection string");
    
    if (!isGitRepo() || !fs.existsSync(path.join(process.cwd(), ".git", "config"))) {
      console.log("\n2️⃣  Commit and push the workflow file:");
      console.log("   git add .github/workflows/ping.yml");
      console.log("   git commit -m 'Add MongoDB pinger workflow'");
      console.log("   git push");
    }
    
    console.log("\n3️⃣  Test the workflow:");
    console.log("   • Go to the 'Actions' tab in your GitHub repo");
    console.log("   • Click 'MongoDB Pinger' workflow");
    console.log("   • Click 'Run workflow' button to test manually");
    console.log("\n4️⃣  Monitor scheduled runs:");
    console.log(`   • Next automatic run: ${getNextRun(cron)}`);
    console.log("   • Check the Actions tab for execution history");
    console.log("   • Enable notifications: Settings → Notifications → Actions");
    console.log("\n💡 Test locally first:");
    console.log("   DATABASE_URI='your_uri' npx mongo-pinger");
    console.log("\n🔗 Useful links:");
    console.log("   • Verify cron: https://crontab.guru");
    console.log("   • MongoDB Atlas: https://cloud.mongodb.com");
    console.log("\n" + "=".repeat(60) + "\n");

  } catch (error) {
    if (error instanceof Error) {
      // Handle Ctrl+C or prompt cancellation
      if (error.name === "ExitPromptError" || error.message.includes("User force closed")) {
        console.log("\n\n❌ Setup cancelled by user.");
        process.exit(0);
      }
      console.error("\n❌ Setup failed:", error.message);
      process.exit(1);
    }
  }
}