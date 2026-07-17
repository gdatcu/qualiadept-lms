# **QA & DevOps Automation Bootcamp**

## ***Automatizare inteligentă cu n8n, AI (OpenAI) și Arhitectură RAG***

## **1\. Prezentarea Cursului**

| 📈 Acest curs practic este conceput pentru inginerii care doresc să treacă dincolo de automatizarea clasică (scripturi bash/Python, Selenium) și să integreze Inteligența Artificială în fluxurile lor zilnice de lucru. Folosind n8n (platformă vizuală de automatizare) și API-ul OpenAI, vom construi pipeline-uri complexe care interacționează cu sisteme de operare, analizează log-uri, răspund la întrebări din documentații tehnice și trimit alerte automate pe Discord sau Slack. Spre deosebire de tool-urile comerciale rigide de tip SaaS, platforma open-source n8n îți permite să îți aduci propria cheie API (OpenAI) și să plătești direct la sursă, având control absolut asupra arhitecturii și a confidențialității datelor tale. La finalul celor 6 sesiuni, vei avea propriul asistent AI (Agent RAG) capabil să ia decizii și să execute sarcini tehnice complexe. |
| :---- |

## **2\. Publicul Țintă și Pre-rechizite**

* **Cui se adresează:** Ingineri QA Automation, DevOps, SysAdmins, Test/DevOps Leads și programatori.  
* **Cerințe preliminare:** Familiaritate cu linia de comandă (CLI), concepte de bază despre API (REST/JSON) și logică de programare generală. *Nu necesită cunoștințe avansate de Node.js sau machine learning.*  
* **Cerință specifică pentru curs:** Cursanții trebuie să își creeze un cont pe platforma de dezvoltatori OpenAI și să genereze o cheie API (API Key). Aceasta necesită o alimentare minimă a contului (ex. 5$). Costurile de rulare pe parcursul cursului vor fi infime (sub 0.50$), deoarece vom folosi modele extrem de rentabile, precum gpt-4o-mini.

## **3\. Specificații Tehnice pentru Laptop**

Deoarece procesarea "grea" a Inteligenței Artificiale este delegată serverelor OpenAI în cloud, cerințele hardware locale sunt extrem de prietenoase:

| Componentă | Cerințe Minime / Recomandate |
| :---- | :---- |
| **Sistem Operare** | Windows 10/11 (cu WSL2 opțional), macOS, sau Linux |
| **Memorie RAM** | **Minim 8 GB RAM** (Recomandat 16GB pentru multitasking optim) |
| **Procesor (CPU)** | Orice procesor modern (Intel i3/i5, AMD Ryzen, Apple M-series) |
| **Stocare** | 10+ GB spațiu liber |
| **Software** | Node.js (v20+), Git, un editor de cod (VS Code) |

## **4\. Syllabus Complet (Planificarea celor 6 Sesiuni)**

***Format**: 6 sesiuni de seară x 2.5 ore. Structura standard a unei sesiuni: 15 min recapitulare, 45 min concepte/teorie, 70 min hands-on, 20 min Q\&A.*

### **Sesiunea 1: Setup-ul Mediului și Primul Flux Automat**

**Focus:** Concepte de bază n8n & Integrarea de API-uri

* Ce este n8n: arhitectură, noduri, canvas și lucrul cu date JSON.  
* Configurarea mediului de lucru local (Node.js) și bypass-ul SSL-ului pentru testare locală (N8N\_SECURE\_COOKIE).  
* Concepte de tip Webhooks vs. Polling.  
* **Hands-on:** Conectarea la Google Drive API (Generare OAuth2 Credentials).  
* **Livrabil:** Un pipeline vizual care ascultă folderele din Drive și descarcă automat noi planuri de testare / documentații pe sistemul de operare.

### **Sesiunea 2: Integrarea API-urilor OpenAI în n8n**

**Focus:** Large Language Models (LLMs) & Interacțiune cu OS-ul

* Cum funcționează modelele OpenAI și securitatea cheilor API.  
* Cost optimization: Diferența dintre modele (ex. GPT-4o vs GPT-4o-mini).  
* Integrarea n8n cu mediul OS local folosind nodul *Execute Command*.  
* **Hands-on:** Construirea unui lanț decizional AI utilizând nodul OpenAI Chat Model.  
* **Livrabil:** AI-ul citește log-uri sau statusuri de executare ("Exit Codes") din sistem și generează alarme inteligente dacă scripturile de test/infrastructură pică.

### **Sesiunea 3: Bazele Vectoriale și Embeddings**

**Focus:** Vector Databases & Ingestia de Date

* Teorie AI: Ce sunt Vectorii, Spațiul Multidimensional și cum funcționează OpenAI Embeddings (conversia textului în vectori).  
* Setarea unui index gratuit în platforma Pinecone.  
* Pregătirea documentației QA/DevOps: *Document Loaders* & *Text Splitters* (Chunking).  
* **Hands-on:** Conectarea nodului de vectorizare (Embeddings API) la fluxul nostru.  
* **Livrabil:** Un pipeline care "sparge" un PDF tehnic complex în fragmente, le vectorizează (la costuri de câțiva cenți) și le stochează automat în Pinecone.

### **Sesiunea 4: Construirea Agentului AI Autonom (Arhitectura RAG)**

**Focus:** AI Agents, Memorie contextuală & Retrieval

* Diferența dintre o simplă completare de text (LLM Chain) și un "AI Agent" capabil să utilizeze *Tools*.  
* Setarea memoriei în conversațiile tehnice (*Window Buffer Memory*) și a capabilităților agentice (ex. definirea regulilor de bază \- System Prompt).  
* Crearea unui *Vector Store Tool* pentru căutare în baza de cunoștințe (Knowledge base search).  
* **Hands-on:** Implementarea interfeței vizuale de *Chat* în n8n.  
* **Livrabil:** Agentul AI răspunde la întrebări tehnice complexe citind direct din documentația vectorizată anterior (Retrieval-Augmented Generation).

### **Sesiunea 5: Notificări, Alerte și Proiectul Capstone**

**Focus:** Integrări de echipă & Rutare date

* Închiderea buclei de automatizare: Raportarea informațiilor esențiale extrase de Agent.  
* Crearea integrărilor cu Discord sau Slack folosind Webhooks.  
* **Hands-on:** Rutarea și formatarea alertelor generate de AI către un canal tehnic de echipă (*Send Message*).  
* Stabilirea cerințelor finale pentru *Proiectul Capstone* (un pipeline real-world individual creat de la zero de fiecare cursant).  
* Timp de lucru independent sub supravegherea trainerului (Debugging Session).

### **Sesiunea 6: Prezentări, Code Review și Scalare**

**Focus:** Validare, Optimizare & Go-to-Production

* **Prezentări finale (via Screen Share):** Fiecare cursant își demonstrează pipeline-ul Capstone complet funcțional.  
* Code Review și discuții despre optimizarea costurilor API pe termen lung (Prompt caching, limitări).  
* Cum mutăm setup-ul local de n8n într-un mediu stabil de producție dedicat echipei (Docker, instanțe AWS/VPS).  
* Sesiune finală de Q\&A, depanare avansată (Troubleshooting / Rate Limits) și pașii următori în carieră.