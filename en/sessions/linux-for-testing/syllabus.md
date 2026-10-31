# **Linux for Testing: From Command Line to CI/CD & Docker**

- 🐧 **Format:** Interactive Theory & Live In-Browser Linux Terminal
- 🎯 **Level:** Beginner / Intermediate (Manual QA, QA Automation, DevOps Starter)
- ⏱️ **Duration:** 6 Complete Sessions
- 💻 **Focus:** Hands-on practice on real QA scenarios (log analysis, test data processing, Bash scripting)

---

## **🎯 Course Objectives**

In modern software quality engineering, **over 90% of backend services, staging environments, Docker containers, and CI/CD runners operate on Linux**. A QA engineer who relies exclusively on graphical user interfaces faces severe roadblocks when microservices fail to boot or when automated suites crash in cloud pipelines.

This course transforms the Linux terminal from an intimidating black screen into **your fastest diagnostic, test execution, and automation superpower**.

Every session embeds an **interactive virtual Linux shell directly within the lesson**, allowing you to execute real commands, explore filesystem hierarchies, and solve practical challenges without setting up complex virtual machines or subsystems.

---

## **📅 Course Curriculum (Syllabus)**

### **Module 1: Linux Foundations & Filesystem Navigation**

*2 Sessions | Orientation, Core Commands & File Inspection*

> * **[Session 1: First Steps in Terminal & Filesystem Navigation](/en/sessions/linux-for-testing/session-1.html)** <SessionBadge :challenges="['linux-s1-c1', 'linux-s1-c2']" lang="en" />  
>   * Why Linux for QA: server architecture, headless test execution, and cloud containers.  
>   * Anatomy of Bash commands: command name, options/flags (`-a`, `-l`, `-h`), and arguments.  
>   * The Linux Filesystem Tree: why there is no `C:\` and where data lives (`/var/log`, `/etc`, `/home`, `/tmp`, `/app`).  
>   * Navigation and orientation: `pwd`, `cd`, absolute vs. relative paths, `~` and `..`.  
>   * Manipulating files and directories: `ls`, `mkdir -p`, `touch`, `cp -r`, `mv`, `rm -rf`.  
>   * *Terminal Challenges:* Reorganizing test execution artifacts and provisioning directory structures.
>
> * **[Session 2: Inspecting and Filtering Server Logs](/en/sessions/linux-for-testing/session-2.html)** <SessionBadge :challenges="['linux-s2-c1', 'linux-s2-c2']" lang="en" />  
>   * Logs — the tester's primary diagnostic weapon when APIs or UIs fail.  
>   * Viewing file contents: `cat`, `less`, `head`, and `tail`.  
>   * Real-time log monitoring during test execution (`tail -f`).  
>   * Rapid error discovery with `grep` (essential flags: `-i`, `-n`, `-c`, `-v`, `-E`).  
>   * *Terminal Challenges:* Extracting all HTTP 500 error traces from an Nginx log and tallying critical incidents.

---

### **Module 2: Data Processing & Text Automation in QA**

*2 Sessions | Pipelines, Redirections & Permissions*

> * **Session 3: Pipelines (`|`), Redirections (`>`, `>>`) & Advanced Filtering**  
>   * The Unix Philosophy: small tools that do one job well and communicate via plain text.  
>   * Standard streams: STDIN (0), STDOUT (1), STDERR (2).  
>   * Output redirection (`>`, `>>`, `2>&1`) to preserve test reports and failure dumps.  
>   * Chaining commands via Pipes (`|`): combining `grep`, `sort`, `uniq -c`, and `wc -l`.  
>   * Column extraction with `cut` and `awk` for CSV datasets and access logs.  
>   * *Terminal Challenges:* Generating a report of unique users affected by system exceptions.
>
> * **Session 4: Permissions, Users and Security (`chmod`, `chown`)**  
>   * The Linux permission model: User, Group, Others (`rwx`).  
>   * Symbolic notation (`u+x`) vs. octal numbers (`755`, `644`, `600` for SSH private keys).  
>   * Troubleshooting `Permission denied` errors and making test scripts executable (`chmod +x`).  
>   * The `root` superuser, `sudo`, and container security best practices.  
>   * *Terminal Challenges:* Securing sensitive API tokens and enabling execution rights for a runner script.

---

### **Module 3: Processes, Networking & Bash Automation for CI/CD**

*2 Sessions | System Diagnostics & Pipeline Orchestration*

> * **Session 5: Process Management, System Health & Networking**  
>   * Identifying frozen background services: `ps aux`, `top`, and process filtering with `pgrep`.  
>   * Terminating runaway processes: graceful shutdown (`kill -15`) vs. forced termination (`kill -9`).  
>   * Inspecting open listening ports and active sockets (`netstat`, `ss`, `lsof -i :8080`).  
>   * Direct API sanity checks with `curl` (headers, status codes, JSON response validation).  
>   * *Terminal Challenges:* Diagnosing a backend refusing connections and freeing up a locked port.
>
> * **Session 6: Bash Scripting for QA & CI/CD Pipelines**  
>   * Anatomy of a Bash script: shebang (`#!/usr/bin/env bash`), variables, and arguments (`$1`, `$@`).  
>   * Exit codes (`exit 0` vs. `exit 1`): how CI/CD runners determine test suite pass or failure.  
>   * Conditional logic (`if [ $? -eq 0 ]`) and loops for regression suites.  
>   * Building a pre-flight test runner script that verifies dependencies and executes pytest/playwright.  
>   * *Terminal Challenges:* Creating a health probe script that triggers pipeline failure upon service outage.

