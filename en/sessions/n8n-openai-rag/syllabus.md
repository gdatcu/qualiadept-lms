# **QA & DevOps Automation Bootcamp**

## ***Intelligent Automation with n8n, AI (OpenAI) and RAG Architecture***

## **1\. Course Presentation**

| 📈 This practical course is designed for engineers who want to go beyond classic automation (bash/Python scripts, Selenium) and integrate Artificial intelligence in their daily workflows. Using n8n (visual automation platform) and API OpenAI, we will build complex pipelines that interact with operating systems, analyze logs, answer questions from technical documentation, and send automatic alerts to Discord or Slack. Unlike rigid commercial SaaS tools, the open-source platform n8n allows you to bring your own API key (OpenAI) and pay directly at the source, having absolute control over the architecture and confidentiality of your data. At the end of the 6 sessions, you will have your own AI assistant (RAG Agent) capable of making decisions and executing complex technical tasks. |
| :---- |

## **2\. Target Audience and Pre-requisites**

* **Who is it addressed to:** QA Automation Engineers, DevOps, SysAdmins, Test/DevOps Leads and Programmers.  
* **Prerequisites:** Familiarity with the command line (CLI), basic API concepts (REST/JSON), and general programming logic.*It does not require advanced knowledge of Node.js or machine learning.*  
* **Specific requirement for the course:** Learners must create an account on the OpenAI developer platform and generate an API Key. This requires a minimum account funding (e.g. $5). Running costs during the course will be minimal (under $0.50) as we will be using extremely cost-effective models such as gpt-4o-mini.

## **3\. Laptop Technical Specifications**

Because the "heavy" processing of Artificial Intelligence is delegated to OpenAI servers in the cloud, local hardware requirements are extremely friendly:

| compound | Minimum / Recommended Requirements |
| :---- | :---- |
| **Operating System** | Windows 10/11 (with optional WSL2), macOS, or Linux |
| **RAM memory** | **Minimum 8 GB RAM** (16GB recommended for optimal multitasking) |
| **Processor (CPU)** | Orice procesor modern (Intel i3/i5, AMD Ryzen, Apple M-series) |
| **storage** | 10+ GB free space |
| **Software** | Node.js (v20+), Git, un editor de cod (VS Code) |

## **4\. Complete Syllabus (Planning the 6 Sessions)**

***Format**: 6 evening sessions x 2.5 hours. Standard structure of a session: 15 min review, 45 min concepts/theory, 70 min hands-on, 20 min Q\&A.*

### **Session 1: Environment Setup and First Automated Flow**

**Focus:** Basic n8n Concepts & API Integration

* What is n8n: architecture, nodes, canvas and working with JSON data.  
* Configuring the local work environment (Node.js) and bypassing SSL for local testing (N8N\_SECURE\_COOKIE).  
* Concepte de tip Webhooks vs. Polling.  
* **Hands-on :**Connecting to Google Drive API (Generating OAuth2 Credentials).  
* **Deliverable:** A visual pipeline that listens to folders in Drive and automatically downloads new test plans/documentation to the operating system.

### **Session 2: Integrating OpenAI APIs into n8n**

**Focus:**Large Language Models (LLMs) & OS Interaction

* How OpenAI models and API key security work.  
* Cost optimization: The difference between models (e.g. GPT-4o vs GPT-4o-mini).  
* Integrating n8n with the local OS environment using node*Execute Command*.  
* **Hands-on:** Building an AI decision chain using the OpenAI Chat Model node.  
* **Deliverable:** The AI ​​reads logs or execution statuses ("Exit Codes") from the system and generates intelligent alarms if test scripts/infrastructure fail.

### **Session 3: Vector Basis and Embeddings**

**Focus:** Vector Databases & Data Ingestion

* AI Theory: What are Vectors, Multidimensional Space and how OpenAI Embeddings work (converting text to vectors).  
* Setting up a free index in the Pinecone platform.  
* Preparing QA/DevOps documentation:*Document Loaders* & *Text Splitters* (Chunking).  
* **Hands-on:** Connecting the vectorization node (Embeddings API) to our stream.  
* **Deliverable:** A pipeline that "breaks" a complex technical PDF into fragments, vectorizes them (at a cost of a few cents) and automatically stores them in Pinecone.

### **Session 4: Building the Autonomous AI Agent (RAG Architecture)**

**Focus:** AI Agents, Contextual Memory & Retrieval

* The difference between a simple text completion (LLM Chain) and an "AI Agent" capable of using*Tools*.  
* Memory setting in technical conversations (*Window Buffer Memory*) and agent capabilities (e.g. defining basic rules \- System Prompt).  
* Creating a*Vector Store Tool*for knowledge base search.  
* **Hands-on:** Implementing the visual interface*Chat*in n8n.  
* **Deliverable:** The AI ​​agent answers complex technical questions by reading directly from previously vectorized documentation (Retrieval-Augmented Generation).

### **Session 5: Notifications, Alerts, and the Capstone Project**

**Focus:** Team Integrations & Data Routing

* Closing the automation loop: Reporting essential information extracted by the Agent.  
* Creating integrations with Discord or Slack using Webhooks.  
* **Hands-on:** Routing and formatting AI-generated alerts to a technical team channel (*Send Message*).  
* Establishing final requirements for*Capstone Project* (an individual real-world pipeline created from scratch for each run).  
* Independent work time under the trainer's supervision (Debugging Session).

### **Session 6: Presentations, Code Review and Scaling**

**Focus:** Validation, Optimization & Go-to-Production

* **Final presentations (via Screen Share):** Each learner demonstrates their fully functional Capstone pipeline.  
* Code Review and discussions about optimizing long-term API costs (Prompt caching, limitations).  
* How to move the local n8n setup to a stable production environment dedicated to the team (Docker, AWS/VPS instances).  
* Final Q\&A session, advanced troubleshooting (Troubleshooting / Rate Limits) and next steps in your career.