# Session 1: First Steps in Terminal & Filesystem Navigation

::: info 🎯 Learning Objectives
By the end of this session, you will be able to:
- Understand the critical role of **Linux** in modern QA engineering ecosystems (backend microservices, Docker containers, CI/CD runners).
- Deconstruct the anatomy of any Bash command: command name, options/flags (`-a`, `-l`, `-h`), and path arguments.
- Navigate the Linux filesystem hierarchy with precision using fundamental commands (`pwd`, `cd`, `ls`).
- Master the vital difference between **absolute paths** (starting from `/`) and **relative paths**, along with shortcut notations (`~` home, `..` parent, and `.` current).
- Manipulate test files and directories using `mkdir -p`, `touch`, `cp -r`, `mv`, and `rm -rf`.
- Practice and validate commands live using the **interactive Linux terminal embedded directly in this page**.
:::

---

## Chapter 1: Why is Linux Essential for Software Testers? 🐧

::: info 🧠 Perspective
When performing manual GUI testing or developing initial automated scripts locally, you typically interact with Windows or macOS desktop windows. But the moment code is deployed to test environments (**Staging**, **UAT**) or queued in a continuous integration pipeline (**GitHub Actions**, **GitLab CI**, **Jenkins**), graphical interfaces vanish completely.  
There, only **Headless Linux** exists. If an automated test fails at 2:00 AM on a cloud runner, you cannot open a visual file explorer. Your only diagnostic tools to inspect logs, verify generated test artifacts, and restart services reside in the Linux command line.
:::

---

### 1.1 Anatomy of a Bash Command

Every command typed in a Linux terminal follows a simple, predictable pattern:

$$\text{command} \quad [\text{options / flags}] \quad [\text{arguments}]$$

```bash
ls -la /var/log
```

1. **`ls` (The Command):** The binary executable instructed to run (in this case, *list* directory contents).
2. **`-la` (Options / Flags):** Modifies default command behavior.  
   - `-l` activates long listing format (displays permissions, file size, modification timestamp).  
   - `-a` (all) forces the display of hidden files (those prefixed with a dot `.`).  
   - In Linux, short flags can be chained together: `-l -a` becomes `-la`.
3. **`/var/log` (The Argument):** The target upon which the command operates (the directory path).

---

## Chapter 2: The Linux Filesystem Map 🗺️

Unlike Windows, which isolates storage across drive letters (`C:\`, `D:\`), Linux operates on a **single unified hierarchical tree**, rooted at the slash `/` (Root).  
All attached storage volumes, network shares, services, and directories branch from this root.

```
                      / (Root - Filesystem Apex)
     ┌──────────┬──────────┬──────────┬──────────┬──────────┐
   /home       /var       /app       /etc       /tmp       /usr
     │          │          │          │          │
/qa-tester     /log    (source code) (config)  (scratch)
(our home   (server     (containers) (settings) (reports)
 directory)   logs)
```

### Essential Directories Every Tester Must Know:

| Directory | What Does It Hold? | Why It Matters in QA |
| :--- | :--- | :--- |
| **`/home/qa-tester`** (or `~`) | The current user's personal home directory. | Downloaded test execution reports, local SSH keys, user-specific test scripts. |
| **`/var/log`** | System-wide and service log outputs. | **The primary destination for troubleshooting** when an API returns HTTP 500 or workers deadlock (`app.log`, `nginx/access.log`). |
| **`/etc`** | Global system configuration files. | Inspecting host network mappings (`/etc/hosts`), environment variables, and OS metadata (`/etc/os-release`). |
| **`/tmp`** | Ephemeral temporary directory with universal write permissions. | Where automated test suites generate temporary CSVs, download test invoices, and capture screenshots without permission errors. |
| **`/app`** | Root application directory (standard in Docker images). | Validating backend configurations, database schemas, and microservice configurations (`config.json`). |

---

## Chapter 3: Orientation & Core Navigation (`pwd`, `cd`, `ls`) 🧭

### 3.1 `pwd` — Where Am I Right Now? (Print Working Directory)

A terminal has no visual breadcrumb bar. `pwd` prints the exact absolute path of your current working directory:

```bash
pwd
# Output: /home/qa-tester
```

---

### 3.2 `cd` — Change Directory

The `cd` command navigates the filesystem tree:

```bash
# 1. Absolute navigation (always starts with '/')
cd /var/log

# 2. Step backward to the parent directory ('..')
cd ..
# You are now in /var

# 3. Return to your personal home directory ('~' or bare 'cd')
cd ~
# You are now in /home/qa-tester

# 4. Jump back to your previous working directory ('-')
cd -
# Returns automatically to /var
```

::: tip 💡 Absolute vs. Relative Paths
- **Absolute Path:** Always begins at the root `/`. It is globally unambiguous and works regardless of your current location:  
  `cd /var/log/nginx`
- **Relative Path:** Interpreted relative to your current working directory (has no leading slash):  
  If you are already inside `/var`, typing `cd log` navigates directly into `/var/log`.
:::

---

### 3.3 `ls` — Inspecting Directory Contents

```bash
# Simple listing:
ls
# Output: readme.txt  test_notes.txt

# Detailed long format (-l):
ls -l
# -rw-r--r-- 1 qa-tester qa-tester 145 Oct 31 10:00 readme.txt
# -rw-r--r-- 1 qa-tester qa-tester 102 Oct 31 10:00 test_notes.txt

# Complete listing including hidden dotfiles (-la):
ls -la
# drwxr-xr-x 1 qa-tester qa-tester 4096 Oct 31 10:00 .
# drwxr-xr-x 1 qa-tester qa-tester 4096 Oct 31 10:00 ..
# -rw-r--r-- 1 qa-tester qa-tester  145 Oct 31 10:00 readme.txt
```

---

## Chapter 4: File Manipulation & Cleanup (`mkdir`, `touch`, `cp`, `mv`, `rm`) 📁

In automated testing, test suites constantly generate reports, screenshots, and logs. Managing these artifacts cleanly is a daily responsibility:

### 4.1 `mkdir` — Creating Directories (`-p` is Essential!)

```bash
# Creating a single directory:
mkdir reports

# ⚡ QA Superpower: Creating complete nested hierarchies in one shot (-p / parents)
# Without the -p flag, the command fails if parent directories do not already exist!
mkdir -p /home/qa-tester/test-suites/regression/screenshots
```

---

### 4.2 `touch` — Creating Empty Test Files

The `touch` command creates a blank file immediately if it does not exist, or refreshes its modification timestamp:

```bash
touch /home/qa-tester/execution.log
touch smoke_test.py regression_test.py
```

---

### 4.3 `cp` — Copying Files and Directories

```bash
# Copying a single file:
cp /app/config.json /home/qa-tester/config_backup.json

# Copying an entire directory recursively (-r flag is mandatory!):
cp -r /app/test_data /tmp/test_data_copy
```

---

### 4.4 `mv` — Moving and Renaming Files

In Linux, moving a file within the same directory under a new filename represents the exact **rename** operation:

```bash
# Renaming a report:
mv test_notes.txt sprint_42_notes.txt

# Moving a file to a new target directory:
mv sprint_42_notes.txt /tmp/
```

---

### 4.5 `rm` — Removing Files and Cleaning Up

::: danger ⚠️ Extreme Caution with `rm`: Linux Has No Trash Bin!
Files deleted with `rm` are removed immediately and irreversibly. Never execute commands like `rm -rf` without double-checking the exact path argument!
:::

```bash
# Deleting a single file:
rm /tmp/old_report.txt

# Recursively and forcefully cleaning an entire directory of temporary artifacts:
rm -rf /home/qa-tester/test-suites
```

---

## Chapter 5: QualiAdept Decision Matrix 🧭

| QA Scenario | Recommended Command | Key Rationale |
| :--- | :--- | :--- |
| **Confirming current execution environment path** | `pwd` | Essential before triggering scripts or deletion commands. |
| **Provisioning Allure / Playwright report folders** | `mkdir -p results/allure-raw` | The `-p` flag prevents errors when parent folders are absent. |
| **Locating hidden configuration files (`.env`)** | `ls -la` | Hidden files start with a dot and are hidden by default `ls`. |
| **Backing up test database fixtures before execution** | `cp test.db test.db.bak` | Enables instant state rollback after test mutations. |
| **Purging stale artifacts prior to a test run** | `rm -rf target/ test-results/` | Guarantees a fresh execution baseline without leftover failures. |

---

## Chapter 6: 🛡️ The Tester's Eye & AI Guardrails

::: info 🧠 Common AI Hallucinations in Linux Commands
AI assistants often produce subtle cross-platform mistakes when writing shell snippets:
1. **Windows Path Separators:** AI frequently outputs `cd test\fixtures\data`. In Linux, the `\` backslash is reserved for *character escaping*, not path separation! Always use forward slashes `/`.
2. **Missing `-p` on `mkdir`:** If parent directories are absent in a clean container, the CI script crashes with `No such file or directory`.
3. **Omitting `-r` when copying directories:** Running `cp folder1 folder2` will fail with `cp: -r not specified; omitting directory`.
4. **Dangerous Variable Expansions:** AI often writes `rm -rf $ARTIFACTS_DIR/*`. If `$ARTIFACTS_DIR` is accidentally unset or empty, the command resolves to `rm -rf /*`, destroying the host operating system!
:::

---

<script setup>
const challenge1Initial = `# Write commands to create the complete report directory structure
# and navigate into the newly created directory:
`

const challenge1TestCases = [
  {
    name: "Directory /home/qa-tester/reports/artifacts was created",
    type: "file_exists",
    expectedPath: "/home/qa-tester/reports/artifacts"
  },
  {
    name: "Successfully navigated into created directory",
    type: "stdout_exact",
    expected: "/home/qa-tester/reports/artifacts"
  }
]

const challenge1Solution = `mkdir -p /home/qa-tester/reports/artifacts
cd /home/qa-tester/reports/artifacts
pwd
`

const challenge2Initial = `# 1. Create a backup copy of /app/config.json in /home/qa-tester
#    named config_backup.json
# 2. Create an empty log file named test_execution.log in /home/qa-tester
`

const challenge2TestCases = [
  {
    name: "Backup file /home/qa-tester/config_backup.json exists",
    type: "file_exists",
    expectedPath: "/home/qa-tester/config_backup.json"
  },
  {
    name: "Backup file contains expected configuration content",
    type: "file_contains",
    expectedPath: "/home/qa-tester/config_backup.json",
    expected: "qa_ecommerce"
  },
  {
    name: "Log file test_execution.log was created in /home/qa-tester",
    type: "file_exists",
    expectedPath: "/home/qa-tester/test_execution.log"
  }
]

const challenge2Solution = `cp /app/config.json /home/qa-tester/config_backup.json
touch /home/qa-tester/test_execution.log
`
</script>

## Chapter 7: 💻 Interactive Terminal Challenges

Practice Linux filesystem navigation and file management directly inside the virtual terminal below. You can toggle between **Script** mode to test your complete solution and **Live CLI** mode to run commands one-by-one just like on a real server!

### Challenge 1: Creating Report Directories & Navigation
**Scenario:** When initializing an automated test framework on a CI runner, you must ensure directory structures exist for execution reports.  
**Requirement:** Create the full path `/home/qa-tester/reports/artifacts` using `mkdir` with the appropriate flag, switch your working directory into it (`cd`), and output your current location with `pwd`.

<LinuxTerminal
  challenge-id="linux-s1-c1"
  title="Challenge 1: Report Directory Creation & Navigation"
  description="Use mkdir -p to construct the complete report path and confirm location with pwd."
  :initial-code="challenge1Initial"
  :test-cases="challenge1TestCases"
  :solution="challenge1Solution"
  hint="Run three commands: mkdir -p /home/qa-tester/reports/artifacts, then cd /home/qa-tester/reports/artifacts, then pwd."
/>

---

### Challenge 2: Configuration Backup & Test Log Initialization
**Scenario:** Prior to running integration tests, you need to preserve the server configuration and initialize an empty log file.  
**Requirement:**  
1. Copy `/app/config.json` to `/home/qa-tester/config_backup.json`.  
2. Create an empty file named `test_execution.log` inside `/home/qa-tester`.

<LinuxTerminal
  challenge-id="linux-s1-c2"
  title="Challenge 2: Configuration Backup & Test Log Initialization"
  description="Copy the configuration file and initialize a fresh test execution log."
  :initial-code="challenge2Initial"
  :test-cases="challenge2TestCases"
  :solution="challenge2Solution"
  hint="Use cp /app/config.json /home/qa-tester/config_backup.json followed by touch /home/qa-tester/test_execution.log."
/>

