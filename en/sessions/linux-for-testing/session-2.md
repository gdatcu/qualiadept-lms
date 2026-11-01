# Session 2: Inspecting and Filtering Server Logs in QA

::: info 🎯 Learning Objectives
By the end of this session, you will be able to:
- Understand why **server log files** represent the primary technical evidence attached to professional bug reports.
- Decode the structure of an enterprise log entry: ISO timestamp, severity levels (`DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`), originating service, and stack traces.
- Inspect text files without freezing terminals using `cat`, `head -n`, and `tail -n`.
- Master real-time continuous log observation (`tail -f`) during manual exploratory or automated test runs.
- Execute surgical text searches with **`grep`**, mastering indispensable flags: `-i` (case-insensitive), `-n` (line numbers), `-c` (counting occurrences), and `-v` (noise inversion).
- Redirect search outputs (`>`) into dedicated defect evidence files.
- Solve interactive terminal challenges directly inside the browser.
:::

---

## Chapter 1: Why Logs are a QA Engineer's First Line of Defense 📜

::: info 🧠 Perspective
The distinction between an entry-level tester and a respected QA Automation Engineer lies in the precision of the diagnostic data they provide:
- **The novice tester** logs a ticket stating: *"Checkout button fails, white error screen displayed."*  
  The developer replies: *"Works on my machine, cannot reproduce."*
- **The senior QA engineer** logs: *"Clicking Checkout triggers an HTTP 500 caused by `Deadlock detected in table orders_queue` at 10:04:22 UTC. Full stack trace extracted from `/var/log/app.log`, line 8."*  
  The developer resolves the issue in 10 minutes!
:::

A server log is a chronological, line-by-line transcript of everything occurring inside the application: incoming HTTP requests, database transactions, cache hits, memory pressure warnings, and unhandled exceptions.

---

### 1.1 Anatomy of a Server Log Entry

Here is an authentic log line from our sandbox application (`/var/log/app.log`):

```text
2026-10-31 10:01:02 ERROR [PaymentGateway] Connection timeout to payment provider gateway.stripe.local:443
```

1. **`2026-10-31 10:01:02` (Timestamp):** The exact UTC timestamp. Correlates client-side UI actions directly with backend processing events.
2. **`ERROR` (Severity Level):**  
   - `DEBUG`: Highly verbose diagnostic traces used during active development.
   - `INFO`: Normal business events (e.g., user authenticated, order created).
   - `WARN`: Unexpected anomalies handled gracefully (e.g., connection retries).
   - `ERROR`: Operations that failed to complete (e.g., payment declined, network timeout).
   - `FATAL` / `CRITICAL`: Severe crashes halting the microservice.
3. **`[PaymentGateway]` (Context / Subsystem):** The specific code module emitting the log.
4. **`Connection timeout...` (Message & Details):** Precise diagnosis of the failure condition.

---

## Chapter 2: File Viewing Utilities (`cat`, `head`, `tail`) 👁️

### 2.1 `cat` — Display Entire File Contents

`cat` prints the entire content of a file to stdout in one immediate burst:

```bash
cat /home/qa-tester/readme.txt
```

::: warning 🛑 The `cat` Trap on Production Logs
Running `cat` on a multi-gigabyte production log file floods your terminal with millions of lines, freezing your terminal session and potentially terminating your SSH tunnel.  
Reserve `cat` **strictly** for small configs (`config.json`, test scripts). For enterprise logs, always use `head`, `tail`, or `grep`!
:::

---

### 2.2 `head` — Inspecting the Top of Files

`head` prints the first lines of a file (defaulting to 10 lines). Use the `-n` flag to specify line counts:

```bash
# View the initial 3 boot log entries:
head -n 3 /var/log/app.log

# Inspect headers of a test CSV fixture:
head -n 1 /app/users.csv
# Output: id,username,email,role,status
```

---

### 2.3 `tail` — Inspecting the Bottom of Files (Where New Errors Reside)

Because logs are appended chronologically, recent exceptions always lie at the **very bottom of the file**. `tail` is your daily go-to tool:

```bash
# Print the last 5 events:
tail -n 5 /var/log/app.log
```

---

### 2.4 ⚡ QA Superpower: Real-Time Tailoring with `tail -f`

The `-f` (follow) flag keeps the file open and streams newly appended lines to your screen dynamically as the server processes requests!

```bash
tail -f /var/log/app.log
```

**Professional QA Workflow:**
1. Open a terminal and run `tail -f /var/log/app.log`.
2. In your browser or Postman, trigger the critical user scenario.
3. Watch the terminal: the exact moment an error occurs, you see the stack trace live!
4. Press `Ctrl + C` to detach.

---

## Chapter 3: Precision Search with `grep` 🔍

`grep` (Global Regular Expression Print) searches through gigabytes of text files, returning only lines matching your query pattern.

$$\text{grep} \quad [\text{flags}] \quad \text{'pattern'} \quad [\text{file}]$$

```bash
grep 'timeout' /var/log/app.log
```

---

### 3.1 The 5 Essential `grep` Flags for Testers

| Flag | Name | Functionality | QA Example |
| :--- | :--- | :--- | :--- |
| **`-i`** | Ignore Case | Matches uppercase and lowercase (`error`, `ERROR`, `Error`). | `grep -i 'error' /var/log/app.log` |
| **`-n`** | Line Number | Outputs the exact line index where each match occurred. | `grep -n 'Deadlock' /var/log/app.log` |
| **`-c`** | Count | Outputs total count of matching lines without printing text. | `grep -c '500' /var/log/nginx_access.log` |
| **`-v`** | Invert Match | **Excludes** matching lines (filters out repetitive noise). | `grep -v 'INFO' /var/log/app.log` |
| **`-E`** | Extended Regex | Supports regex OR logic `\|`. | `grep -E 'ERROR\|WARN' /var/log/app.log` |

---

### 3.2 Real-World Investigation Scenarios

#### Scenario 1: Counting HTTP 500 Responses in Web Logs
During load testing, calculate how many client requests resulted in server failure:

```bash
grep -c ' 500 ' /var/log/nginx_access.log
# Output: 2
```

#### Scenario 2: Eliminating Noise with `-v`
Filter out thousands of routine `INFO` statements to expose genuine anomalies:

```bash
grep -v 'INFO' /var/log/app.log
```

#### Scenario 3: Combining `-in` for Bug Reports
Find payment failures and record their exact file locations:

```bash
grep -in 'payment' /var/log/app.log
# 3:2026-10-31 10:01:02 ERROR [PaymentGateway] Connection timeout...
# 4:2026-10-31 10:01:05 WARN [OrderService] Payment retry 1 initiated...
# 5:2026-10-31 10:01:12 ERROR [PaymentGateway] Transaction declined...
```

---

## Chapter 4: Exporting Defect Evidence with Redirection (`>`) 💾

When reporting bugs, do not manually copy messy text snippets with your mouse. Redirect grep outputs directly into dedicated report files:

```bash
# Capture payment gateway exceptions into an artifact file:
grep 'PaymentGateway' /var/log/app.log > /tmp/payment_failures.txt

# Inspect the saved evidence:
cat /tmp/payment_failures.txt
```

---

## Chapter 5: QualiAdept Decision Matrix 🧭

| QA Objective | Recommended Command | Syntax |
| :--- | :--- | :--- |
| **Monitoring live server activity during UI testing** | `tail -f` | `tail -f /var/log/app.log` |
| **Viewing the most recent 25 log lines** | `tail -n 25` | `tail -n 25 /var/log/app.log` |
| **Searching for a specific transaction or user ID** | `grep -i` | `grep -i "user 101" /var/log/app.log` |
| **Quantifying total occurrences for test metrics** | `grep -c` | `grep -c "ERROR" /var/log/app.log` |
| **Reading CSV headers and initial schema records** | `head -n` | `head -n 5 /app/users.csv` |

---

## Chapter 6: 🛡️ The Tester's Eye & AI Guardrails

::: info 🧠 AI Traps in Log Processing
1. **Unquoted Search Patterns:** If your query contains spaces or punctuation, typing `grep Connection timeout log.txt` searches for *Connection* across *timeout* and *log.txt*! Always quote patterns: `grep "Connection timeout" log.txt`.
2. **The "Useless Use of Cat" Antipattern:** AI frequently suggests `cat log.txt | grep error`. This spawns an unnecessary subshell. Write `grep error log.txt` directly.
3. **Case Sensitivity Blindspots:** Developers log variations like `Error`, `ERROR`, or `error`. Always use `-i` unless strict casing is required.
:::

---

<script setup>
const challenge1Initial = `# Extract all lines containing "ERROR" from /var/log/app.log
# and save them into /tmp/critical_errors.log
`

const challenge1TestCases = [
  {
    name: "File /tmp/critical_errors.log exists",
    type: "file_exists",
    expectedPath: "/tmp/critical_errors.log"
  },
  {
    name: "File contains payment gateway timeout error",
    type: "file_contains",
    expectedPath: "/tmp/critical_errors.log",
    expected: "Connection timeout to payment provider"
  },
  {
    name: "File contains database deadlock error",
    type: "file_contains",
    expectedPath: "/tmp/critical_errors.log",
    expected: "Deadlock detected in table orders_queue"
  }
]

const challenge1Solution = `grep ERROR /var/log/app.log > /tmp/critical_errors.log
`

const challenge2Initial = `# Count how many HTTP 500 status code requests appear in /var/log/nginx_access.log
# Output only the count number using the appropriate grep flag:
`

const challenge2TestCases = [
  {
    name: "Accurate count of HTTP 500 status occurrences",
    type: "stdout_exact",
    expected: "2"
  }
]

const challenge2Solution = `grep -c "500" /var/log/nginx_access.log
`
</script>

## Chapter 7: 💻 Interactive Terminal Challenges

Apply log inspection and search techniques directly on realistic server log files inside the virtual shell below.

### Challenge 1: Extracting and Saving Critical Errors
**Scenario:** Backend developers require an isolated file containing only critical system errors that occurred overnight.  
**Requirement:** Use `grep` to filter lines containing `ERROR` from `/var/log/app.log` and redirect (`>`) the output into `/tmp/critical_errors.log`.

<LinuxTerminal
  challenge-id="linux-s2-c1"
  title="Challenge 1: Extracting & Saving Critical Errors"
  description="Filter ERROR lines from app.log and generate the critical_errors.log report file in /tmp."
  :initial-code="challenge1Initial"
  :test-cases="challenge1TestCases"
  :solution="challenge1Solution"
  hint="Run: grep ERROR /var/log/app.log > /tmp/critical_errors.log"
/>

---

### Challenge 2: Counting Nginx HTTP 500 Incidents
**Scenario:** Following an automated stress test, report the total number of client requests that failed with status code `500` (Internal Server Error).  
**Requirement:** Use `grep` with the count flag (`-c`) on `/var/log/nginx_access.log` to print the exact number of matching lines.

<LinuxTerminal
  challenge-id="linux-s2-c2"
  title="Challenge 2: Counting HTTP 500 Incidents"
  description="Count occurrences of HTTP status 500 directly in the web server access log."
  :initial-code="challenge2Initial"
  :test-cases="challenge2TestCases"
  :solution="challenge2Solution"
  hint="Use the -c flag with grep: grep -c '500' /var/log/nginx_access.log"
/>

