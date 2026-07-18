# **Sesiunea 3: Bazele Vectoriale și Embeddings**

<a href="/pdfs/sessions/n8n-openai-rag/session-3.pdf" class="download-btn" download><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>Descarcă versiunea PDF a Sesiunii 3</a>

## **Capitolul 5: Inteligența Artificială, Bazele Vectoriale și „Ingestia” de Date**

|  📝 În acest capitol, construim creierul asistentului nostru.  Până acum am descărcat documente cu succes și le ținem în memoria platformei n8n. Acum vrem ca Inteligența Artificială să citească un document text mare (un fișier cu log-uri sau documentație) și să ne poată răspunde la întrebări extrase din el. Vom învăța cum folosim Bazele de Date Vectoriale și tehnicile de "Chunking". |
| :---- |

### **1\. Problema: De ce nu trimitem tot documentul către ChatGPT?**

Ca ingineri QA sau DevOps, lucrăm cu log-uri masive și documentații kilometrice. Primul instinct este să trimitem tot documentul către un model precum OpenAI (GPT-4) și să îi spunem: *"Citește-l și răspunde-mi la întrebări"*.

Această abordare este **greșită** din două motive majore:

* **Limita de Context (Token Limit):** Modelele AI au o "memorie pe termen scurt" limitată. Nu pot ține minte o carte întreagă dintr-o singură lovitură.  
* **Costurile uriașe:** OpenAI te taxează la fiecare cuvânt trimis. Dacă trimiți zeci de pagini mereu, vei consuma bugetul imediat.

**Soluția: Arhitectura RAG (Retrieval-Augmented Generation)**

În loc să îi dăm AI-ului toată cartea, o vom "tăia" în paragrafe mici folosind un *Text Splitter* (Tocător de text). Apoi, vom transforma aceste paragrafe în numere (Vectori) și le vom stoca într-o bază de date specială. Când vom avea o întrebare, vom extrage *doar* paragraful relevant.

### **2\. Teoria AI: Ce sunt "Embeddings" și Bazele Vectoriale?**

Pentru un calculator, cuvintele nu înseamnă nimic. Modelele AI înțeleg lumea prin matematică. Procesul prin care luăm un cuvânt sau o propoziție și o traducem într-un șir lung de coordonate matematice se numește **Embedding**.

**Baza de date vectorială (Vector Database)** este locul de stocare optimizat special pentru a căuta și compara aceste șiruri de numere la viteze amețitoare. Vom folosi **Pinecone**, liderul pieței pe baze vectoriale gratuite.

### **3\. Setup-ul Pinecone: Crearea "Raftului" pentru Vectori**

* Mergi pe [pinecone.io](https://www.pinecone.io/) și creează-ți un cont gratuit.  
* Apasă pe **Create Index** (Crearea bazei tale).  
* La secțiunea **Name**, pune numele: n8n-qa-docs.  
* **Pas Vital\!** Bifează căsuța **Custom settings** (în dreapta secțiunii *Configuration*). Aceasta va debloca opțiunile ascunse referitoare la dimensiunea modelului.  
* La câmpul **Dimension** nou apărut, scrie valoarea **1536** (Metricul rămâne *cosine*). Acesta este formatul fix cerut de OpenAI.  
* La **Capacity mode**, asigură-te că setările gratuite sunt active: **Serverless**, Cloud provider pe **AWS** și Region pe **Virginia (us-east-1)**. Apasă **Create Index**.

![][image1]

### **4\. Construirea Fluxului de Ingestie (Data Pipeline) în n8n**

Acum ne întoarcem în planșa de lucru n8n pentru a lega toate aceste piese. Asigură-te că folosești nodurile din noua categorie **AI**. Nodurile de inteligență artificială funcționează ca niște piese de Lego: avem un nod principal pe planșă, iar sub el atașăm "sub-noduri" folosind porturile inferioare.

🚨 **CAPCANĂ ARHITECTURALĂ MAJORĂ:**

Până acum, am legat nodurile într-o linie dreaptă. **NU lega nodul Pinecone după nodul Execute Command\!** Nodul de terminal a folosit numele fișierului, dar "consumă" textul brut, trimițând mai departe o execuție goală. Baza vectorială are nevoie de fișierul original, așa că trebuie să creăm o **Ramificație (Bifurcație)**\!

* **Nodul Principal (Crearea Bifurcației):** Du-te la nodul **Download file** (care conține datele brute). Prinde de conectorul din dreapta lui și trage un **fir nou** pe lângă firul existent, astfel încât să se creeze două trasee paralele. Când eliberezi click-ul, caută categoria **AI** și alege **Pinecone Vector Store**.

![][image2]

* Fereastra de credențiale îți va cere direct **API Key-ul**. Mergi în contul tău Pinecone (meniul din stânga \-\> API Keys), copiază cheia lungă și lipește-o în n8n. Dă Save. Platforma se conectează invizibil la server.

![][image3]

* La operațiunea principală, asigură-te că este selectat **Insert Documents**.  
  * La câmpul **Pinecone Index**, dă click și alege din listă numele bazei tale proaspăt create: n8n-qa-docs.

![][image4]

💡 **Ochi de Arhitect: Cele Două "Brațe" ale Pipeline-ului**

Te-ai putea întreba: *"Dacă l-am ocolit pentru AI, de ce mai ținem nodul Execute Command pe ecran?"*. Răspunsul este că nu l-am ocolit pentru a-l anula, ci am creat o **procesare paralelă (Multitasking)**.

* **Brațul de Sus (Rolul de DevOps):** Execută comanda de terminal. Notează local pe hard disk *faptul* că fișierul a sosit, pentru audit și trasabilitate.  
* **Brațul de Jos (Rolul AI):** Preia conținutul brut, neatins, și îl trimite spre vectorizare.  
  Dintr-un singur eveniment (Trigger), platforma n8n face acum două acțiuni complet diferite și independente în același timp\!  
* **Încărcătorul de Documente:** Baza vectorială are nevoie de date brute. Uită-te la partea de jos a nodului Pinecone; vei vedea niște porturi de conectare inferioare.  
  * Apasă pe portul numit **Document** și alege **Default Data Loader**. Acesta va prelua cu succes documentul masiv descărcat pe firul cel nou.  
* **Tocătorul de text (Text Splitter \- Chunking):** Pentru că lucrăm cu documente mari (ex: sute de linii de log-uri), trebuie să le tăiem.  
  * Uită-te la sub-nodul *Default Data Loader* pe care tocmai l-ai adăugat. Pe portul lui inferior (punctul gri de conectare numit *Text Splitter*), dă click, caută **Recursive Character Text Splitter** și selectează-l pentru a-l atașa fizic.  
  * Setează **Chunk Size** (Dimensiunea fragmentului) la 1000 și **Chunk Overlap** (Suprapunerea) la 100\.  
* **Traducătorul (Embeddings):** Acum dă click pe portul inferior stâng al nodului principal Pinecone, denumit **Embeddings**. Caută și alege **OpenAI Embeddings**.  
  * **Pasul A (Facturarea):** Deschide un tab nou, mergi pe platform.openai.com și loghează-te. *(Atenție: Contul tău de ChatGPT Plus nu se aplică aici; platforma de API este complet separată)*. Din meniul din stânga, mergi la **Settings \-\> Billing \-\> Add to balance** și adaugă creditul minim (ex: 5$). Această sumă îți va ajunge luni de zile pentru teste. Fără ea, OpenAI va bloca generarea vectorilor.

![][image5]

![][image6]

![][image7]

* **Pasul B (Cheia):** Mergi în meniul principal la **API Keys**. Apasă butonul **Create new secret key** (o poți numi n8n-curs).

![][image8]

* **Pasul C (Pericol\!):** Imediat ce apeși Create, OpenAI îți va afișa pe ecran o singură dată cheia ta lungă. **Apasă butonul Copy imediat\!** Dacă închizi fereastra, nu o vei mai putea vedea niciodată și va trebui să generezi alta.  
  * **Pasul D (Conectarea):** Revino în n8n la sub-nodul *OpenAI Embeddings*. La opțiunea *Credential*, selectează *Create New Credential*, lipește cheia copiată la pasul anterior și apasă Save.

![][image9]

* **Pasul E:** La parametrul *Model*, selectează text-embedding-3-small. El va genera vectorii la dimensiunea exactă de 1536 cerută de Pinecone.

![][image10]

### **5\. Momentul Adevărului: Executarea și Validarea Ingestiei**

Nu am muncit degeaba\! Acum că țeava este legată corect (pe ramura bifurcată), este timpul să trimitem fișierul tău spre AI și Pinecone.

* Asigură-te că ai un fișier text real în folderul din Google Drive.  
* Mergi pe nodul tău principal, **Pinecone Vector Store**, în n8n.  
* Apasă cu încredere butonul portocaliu **Execute step**. Așteaptă câteva secunde să proceseze; nodul ar trebui să se înverzească ("Succeeded").

![][image11]

* **Validarea vizuală:** Dacă execuția are succes, deschide tab-ul cu platforma Pinecone în browser și dă click pe numele indexului tău n8n-qa-docs.  
* Uită-te în stânga sus, sub numele indexului tău, la metrica **Record count**. Vei vedea că numărul a crescut de la 0 la zeci sau sute de fragmente\! De asemenea, pe centrul ecranului, în tab-ul **BROWSER**, vei vedea ID-urile vectorilor stocați efectiv.

![][image12]

Felicitări\! Ai reușit să scrii primul tău vector într-o memorie externă bazată pe AI\!

🕵️ **Exercițiu de Gândire: "Detectivul de Date"**

Te-ai întrebat la Pasul 3 de ce arhitecții AI folosesc un *Chunk Overlap* (Suprapunere) de 100 de caractere atunci când taie textul? Gândește-te la un document tehnic tăiat fix la jumătatea unei fraze esențiale. Dacă nu ar exista o suprapunere între fragmentul 1 și fragmentul 2, ce ar pierde AI-ul?

### **✅ Soluții și Răspunsuri** {#✅-soluții-și-răspunsuri}

**Soluție Exercițiul "Detectivul de Date":**

Dacă „tăiem” textul fix la 1000 de caractere, riscăm să secționăm un cuvânt sau o frază tehnică în două. *Overlap-ul* de 100 de caractere ia sfârșitul primului fragment și îl lipește la începutul celui de-al doilea. Astfel, fraza tăiată se va regăsi intactă în ambele bucăți, iar sensul (contextul) nu se pierde niciodată\!

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