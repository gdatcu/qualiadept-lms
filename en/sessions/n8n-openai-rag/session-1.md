# **Session 1: Introduction to n8n and Process Automation**

## **Chapter 1: What is n8n and why is it revolutionizing AI integration?**

| 📝 In this chapter, we learn the basics of low-code visual automation. n8n is not just a tool to connect two applications; it is a powerful runtime environment that allows us to orchestrate complex data flows and integrate artificial intelligence directly into a company's daily processes. |
| :---- |

### **1. The Need for Automation in the AI Era**

In any modern organization, employees spend hours moving data between applications: copying details from an email to a CRM, downloading invoices and uploading them to Google Drive, or sending Slack notifications.

When we add artificial intelligence (LLMs like GPT-4) to the equation, automation becomes autonomous. AI needs "hands and feet" to interact with the real world (read documents, search the web, send messages). This is where n8n comes in.

### **2. What is n8n?**

**n8n** is an extensible, node-based workflow automation tool. Unlike other proprietary platforms, n8n offers a *fair-code* model, allowing for free self-hosting and providing maximum flexibility in data manipulation.

* **Nodes:** The fundamental building blocks of n8n. Each node performs a specific action (e.g., sending an email, querying a database, calling the OpenAI API).
* **Connections:** The lines connecting the nodes that define the direction of the data flow.
* **Triggers:** Special nodes that start the execution of a workflow (e.g., receiving a new email, a webhook call, or a scheduled time interval).
* **Executions:** The run history, where you can inspect input and output data for each node.

---

## **Chapter 2: n8n vs. Zapier vs. Make**

When choosing a tool for our projects, we must understand the advantages and limitations of each:

| Feature | **n8n** | **Zapier** | **Make (Integromat)** |
| :--- | :--- | :--- | :--- |
| **Hosting** | Self-hosted (Free) or Cloud | Cloud Only | Cloud Only |
| **Data Security** | Excellent (data stays on your server) | Medium (transits third-party servers) | Medium (transits third-party servers) |
| **Data Manipulation** | Native JS support & full JSON control | Limited or requires paid code helper nodes | Proprietary functions, sometimes clunky |
| **AI Integration** | Advanced native nodes (built-in LangChain) | Basic (simple API calls only) | Medium (requires manual logic building) |
| **Cost** | Extremely low (or free self-hosted) | High as execution volume increases | Moderate to high |

---

## **Chapter 3: Practice - Your First Workflow in n8n**

### **Exercise Objective**
Build a workflow that monitors incoming leads (via a Webhook form) and automatically sends a structured alert to Email and Slack.

1. **Add Webhook node:** This will be our starting point (Trigger).
2. **Add a Code node (JavaScript):** To sanitize the user's name (e.g., transforming to Title Case).
3. **Add Email / Slack node:** To send the final alert.

```javascript
// Example JavaScript code to sanitize a name in the Code node
for (const item of $input.all()) {
  if (item.json.name) {
    item.json.formattedName = item.json.name.trim()
      .replace(/\b\w/g, c => c.toUpperCase());
  }
}
return $input.all();
```

---

## **Session 1 Challenge**
Install n8n locally (using npm or Docker) and configure a workflow that fetches the daily exchange rate (from a public API) and emails it to your inbox every morning at 9:00 AM.
