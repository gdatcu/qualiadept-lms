# **Session 3: Vector Basis and Embeddings**

<a href="/pdfs/sessions/n8n-openai-rag/session-3-en.pdf" class="download-btn" download><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>Download the PDF version of Session 3</a>

## **Chapter 5: Artificial Intelligence, Vector Bases and Data Ingestion**

|  📝 In this chapter, we build the brain of our assistant.  So far we have successfully downloaded documents and kept them in the memory of the n8n platform. Now we want the Artificial Intelligence to read a large text document (a log file or documentation) and be able to answer questions extracted from it. We will learn how to use Vector Databases and "Chunking" techniques. |
| :---- |

### **1\. Problem: Why don't we send the entire document to ChatGPT?**

As QA or DevOps engineers, we work with massive logs and miles of documentation. The first instinct is to send the entire document to a model like OpenAI (GPT-4) and tell it:*"Read it and answer my questions"*.

This approach is **wrong** for two major reasons:

* **Context Limit (Token Limit):** AI models have limited "short-term memory." They can't memorize an entire book in one go.  
* **The huge costs:** OpenAI charges you for every word you submit. If you submit dozens of pages over and over, you'll quickly burn through your budget.

**The Solution: RAG (Retrieval-Augmented Generation) Architecture**

Instead of giving the AI ​​the whole book, we will "cut" it into small paragraphs using a *Text Splitter* (Text Shredder). Then, we will convert these paragraphs into numbers (Vectors) and store them in a special database. When we have a question, we will extract *only* the relevant paragraph.

### **2\. AI Theory: What are "Embeddings" and Vector Basis?**

To a computer, words mean nothing. AI models understand the world through mathematics. The process of taking a word or sentence and translating it into a long string of mathematical coordinates is called **Embedding**.

**Vector Database** is the storage space optimized specifically for searching and comparing these strings of numbers at breakneck speeds. We will use **Pinecone** , the market leader in free vector bases.

### **3\. Pinecone Setup: Creating the "Shelf" for Vectors**

* Go on [pinecone.io](https://www.pinecone.io/) and create a free account.  
* Click on **Create Index** (Creating your base).  
* To the section **Name** , put the name: n8n-qa-docs.  
* **Remark\!** Check the box **Custom settings** (to the right of the section*Configuration*). This will unlock hidden options related to the size of the model.  
* At the field **Dimension** newly appeared, write the value **1536** (The metric remains *cosine*). This is the fixed format required by OpenAI.  
* The **Capacity mode**, make sure the free settings are active: **Serverless**, Cloud provider pe **AWS** and Region on **Virginia (us-east-1)**. Press **Create Index**.

![][image1]

### **4\. Building the Ingestion Flow (Data Pipeline) in n8n**

Now we go back to the n8n worksheet to connect all these pieces. Make sure to use the knots from the new category. **AI (**Artificial intelligence) nodes work like Lego pieces: we have a main node on the board, and below it we attach "sub-nodes" using the lower ports.

🚨 **MAJOR ARCHITECTURAL TRAP:**

So far, we have tied the knots in a straight line. **DO NOT tie the Pinecone node after the Execute Command node\!** The terminal node used the filename, but it "consumes" the raw text, sending an empty execution forward. The vector base needs the original file, so we need to create a **Branching (Bifurcation)**\!

* **Main Node (Creating the Bifurcation):** Go to the node **Download file** (which contains the raw data). Grab the connector to its right and pull a **for now** next to the existing wire, so that two parallel paths are created. When you release the click, look for the category **AI** and choose **Pinecone Vector Store**.

![][image2]

* The credentials window will ask you directly for the **API Key**. Go to your Pinecone account (left menu \-\> API Keys), copy the long key and paste it into n8n. Save. The platform connects invisibly to the server.

![][image3]

* On the main operation, make sure it is selected **Insert Documents**.  
  * At the field **Pinecone Index**, click and choose the name of your newly created database from the list: n8n-qa-docs.

![][image4]

💡 **Architect's Eye: The Two "Arms" of the Pipeline**

You might ask: *"If we bypassed it for AI, why do we still keep the Execute Command node on the screen? "*The answer is that we didn't bypass it to cancel it, but we created a **parallel processing (Multitasking)**.

* **Top Arm (DevOps Role):** Run the terminal command. Write it down locally on your hard drive.*the fact*that the file has arrived, for audit and traceability.  
* **Lower Arm (AI Role):** It takes the raw, untouched content and sends it for vectorization.  
  From a single event (Trigger), the n8n platform now performs two completely different and independent actions at the same time\!  
* **Document Loader:** The vector base needs raw data. Look at the bottom of the Pinecone node; you will see some lower connection ports.  
  * Click on the named port **Document** and choose **Default Data Loader.** This will successfully retrieve the massively downloaded document on the new thread.  
* **Text Splitter \- Chunking:** Because we are working with large documents (e.g. hundreds of log lines), we need to cut them.  
  * Look at the sub-node *Default Data Loader* that you just added. On its bottom port (the gray connection point called *Text Splitter*), click, search **Recursive Character Text Splitter** and select it to physically attach it.  
  * Set **Chunk Size** (Fragment size) to 1000 and **Chunk Overlap** (Overlap) to 100\.  
* **Translator (Embeddings):** Now click on the lower left port of the main Pinecone node, named **Embeddings**. Search and choose **OpenAI Embeddings**.  
  * **Step A (Invoicing):** Open a new tab, go to platform.openai.com and log in.*(Note: Your ChatGPT Plus account does not apply here; the API platform is completely separate)*. From the left menu, go to **Settings \-\> Billing \-\> Add to balance** and add the minimum credit (e.g. $5). This amount will last you for months of testing. Without it, OpenAI will block vector generation.

![][image5]

![][image6]

![][image7]

* **Step B (Key):** Go to the main menu at **API Keys**. Press the button **Create new secret key** (you can call it n8n-course).

![][image8]

* **Step C (Danger\!):** As soon as you press Create, OpenAI will display your long key on the screen once. **Press the Copy button immediately\!** If you close the window, you will never be able to see it again and will have to generate another one.  
  * **Step D (Connection):** Return to n8n at the sub-node *OpenAI Embeddings*. At the option *Credential*, select *Create New Credential*, paste the key copied in the previous step and press Save.

![][image9]

* **Step E:** At the parameter*Model*, select text-embedding-3-small. It will generate the vectors at the exact size of 1536 requested by Pinecone.

![][image10]

### **5\. The Moment of Truth: Execution and Validation of Ingestion**

Our hard work was not in vain\! Now that the pipe is connected correctly (on the forked branch), it's time to send your file to AI and Pinecone.

* Make sure you have an actual text file in the folder in Google Drive.  
* Go to your main node, **Pinecone Vector Store**, in n8n.  
* Press the orange button with confidence. **Execute step**. Wait a few seconds for it to process; the node should turn green ("Succeeded").

![][image11]

* **Visual validation:** If the execution is successful, open the Pinecone platform tab in your browser and click on the name of your index n8n-qa-docs.  
* Look at the top left, under your index name, at the metric **Record count**. You will see that the number has increased from 0 to tens or hundreds of fragments\! Also, in the center of the screen, in the tab **BROWSER**, you will see the IDs of the vectors actually stored.

![][image12]

Congratulations\! You have successfully written your first vector to an AI-based external memory\!

🕵️ **Thought Exercise: "Data Detective"**

You asked yourself in Step 3 why AI architects use a *Chunk Overlap* (Overlap) of 100 characters when it cuts text? Think of a technical document cut off halfway through a key sentence. If there was no overlap between fragment 1 and fragment 2, what would the AI ​​miss?

### **✅ Solutions and Answers** {#✅-solutions-and-answers}

**Solution to the "Data Detective" exercise:**

If we "cut" the fixed text to 1000 characters, we risk cutting a word or technical phrase in two. The *Overlap* of 100 characters takes the end of the first fragment and pastes it at the beginning of the second. This way, the cut phrase will be found intact in both pieces, and the meaning (context) is never lost\!

[image1]: /images/sessions/n8n-openai-rag/session-3/image1.png

[image2]: /images/sessions/n8n-openai-rag/session-3/image2.png

[image3]: /images/sessions/n8n-openai-rag/session-3/image3.png

[image4]: /images/sessions/n8n-openai-rag/session-3/image4.png

[image5]: /images/sessions/n8n-openai-rag/session-3/image5.png

[image6]: /images/sessions/n8n-openai-rag/session-3/image6.png

[image7]: /images/sessions/n8n-openai-rag/session-3/image7.png

[image8]: /images/sessions/n8n-openai-rag/session-3/image8.png

[image9]: /images/sessions/n8n-openai-rag/session-3/image9.png

[image10]: /images/sessions/n8n-openai-rag/session-3/image10.png

[image11]: /images/sessions/n8n-openai-rag/session-3/image11.png

[image12]: /images/sessions/n8n-openai-rag/session-3/image12.png