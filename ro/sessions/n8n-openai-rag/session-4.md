# **Sesiunea 4: Construirea Agentului AI Autonom (Arhitectura RAG)**

<a href="/pdfs/sessions/n8n-openai-rag/session-4.pdf" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>Vizualizează versiunea PDF a Sesiunii 4</a>


## **Capitolul 6: Agentul Conversațional și Arhitectura RAG (Chat cu Documentele Tale)**

|  📝 În acest ultim capitol, dăm o voce asistentului nostru. Avem fișierele descărcate și transformate în vectori în Pinecone. Acum vom construi o interfață de Chat în n8n, unde un Agent AI va citi întrebările noastre, va căuta răspunsul în Pinecone și ne va formula un răspuns uman și tehnic. |
| :---- |

### **1\. Izolarea Fluxului: Crearea unui nou Trigger**

Până acum, fluxul nostru pornea de la un eveniment din Google Drive. Dar acum dorim ca acțiunea să pornească atunci când *noi* îi scriem un mesaj asistentului.

Pentru a păstra planșa curată și a nu descărca fișiere de fiecare dată când vorbim cu AI-ul, vom adăuga un punct de pornire complet separat pe același canvas (sau poți crea un Workflow nou, dacă preferi).

* Dă dublu-click oriunde pe un spațiu gol de pe planșa ta de lucru (canvas) pentru a adăuga un nod nou, departe de fluxul vechi.  
* Caută în bara de căutare direct opțiunea **Chat** (prima din listă, cu iconița simplă de mesaj) și dă click pe ea.  
* Se va deschide un sub-meniu. **Ignoră secțiunea Actions**\! Du-te direct la secțiunea **Triggers** (marcată cu un mic fulger portocaliu) și deschide-o. Dă click pe opțiunea de acolo numită **On new Chat event**. Nodul care va apărea pe planșă este conceput pentru a deschide o fereastră de chat interactivă direct în interfața n8n.

![][image1]

### **2\. Adăugarea "Creierului" (Nodul AI Agent)**

Agentul este "managerul" operațiunii. El decide dacă poate să îți răspundă din memorie sau dacă are nevoie să folosească o unealtă (Tool) pentru a căuta în documente.

* Trage un fir din noul tău nod de Chat și caută nodul **AI Agent** (îl găsești în secțiunea *Advanced AI*).

![][image2]

* Odată adăugat, vei vedea că acest nod are mai multe porturi de conectare inferioare, fiecare având un rol specific pentru a construi "omulețul" nostru digital.

### **3\. Echiparea Agentului (Model, Memorie și Unealta RAG)**

Ca un agent să funcționeze corect, are nevoie de o personalitate, o memorie și o modalitate de a căuta în baza noastră de date. Le vom adăuga pe rând folosind porturile lui inferioare:

**A. Modelul (Gura și Personalitatea)**

* Apasă pe portul inferior stâng al nodului *AI Agent*, numit **Model**.  
* Alege **OpenAI Chat Model**.  
* Selectează aceleași credențiale (cheia API) pe care le-ai creat la capitolul anterior.  
* La secțiunea Model, selectează gpt-4o-mini (este extrem de rapid, inteligent și costă fracțiuni de cent).

![][image3]

**B. Memoria (Contextul conversației)**

* Apasă pe portul inferior central al nodului *AI Agent*, numit **Memory**.  
* Alege opțiunea **Simple Memory** (o găsești sub categoria *For beginners*).  
* *De ce facem asta?* Fără memorie, dacă îl întrebi "Ce este o eroare 404?", el îți răspunde, dar dacă la următoarea întrebare spui "Și cum o rezolv?", el va uita complet la ce te-ai referit în prima propoziție\! *Simple Memory* acționează ca un buffer, reținând istoricul discuției curente pe durata sesiunii, direct în RAM-ul n8n.

![][image4]

**C. Unealta de căutare (Pinecone Vector Store)**

Aici se întâmplă magia prin care unim acest chat cu munca noastră din Capitolul 5\. Platforma n8n ne permite să legăm baza noastră de date direct ca pe o "unealtă" pe care AI-ul o folosește singur.

* Apasă pe portul inferior drept al nodului *AI Agent*, numit **Tool** (sau pe semnul \+ de sub el).  
* În meniul care apare, ignoră categoriile de sus și caută nodul **Pinecone Vector Store**.  
* Imediat ce l-ai atașat pe planșă, dă click pe el pentru a-i deschide setările. La parametrul **Operation Mode**, asigură-te că este selectat **Retrieve Documents (As Tool for AI Agent)**. Asta îi spune nodului că rolul lui nu e să scrie date (ca în Cap. 5), ci să le citească.  
* La câmpul **Description** (care are un triunghi roșu de avertizare), scrie clar o descriere pentru ca AI-ul să știe când să o apeleze: Folosește această unealtă pentru a căuta informații tehnice, log-uri sau planuri de testare în documentele echipei QA.  
* Selectează credențialele tale Pinecone și, la câmpul **Pinecone Index**, alege baza noastră comună: n8n-qa-docs.

![][image5]

### **4\. Traducătorul Agentului (Embeddings)**

Ca Agentul să caute în Pinecone, el trebuie să îți "traducă" întrebarea din limba română în aceleași numere (Vectori) pe care le-am folosit în Capitolul 5\.

* Uită-te sub noul tău nod *Pinecone Vector Store* proaspăt atașat la Agent. Vei vedea că are și el un port inferior numit **Embeddings** (marcat cu o steluță roșie).  
* Apasă pe el, caută în listă și alege **Embeddings OpenAI** (n8n le-a grupat recent punând cuvântul "Embeddings" la început).  
* Selectează credențialele tale OpenAI și alege absolut același model pe care l-ai folosit la ingestia de date: text-embedding-3-small.

![][image6]

💡 **Ochi de Arhitect (Cum funcționează RAG-ul?):**

Arhitectura *Retrieval-Augmented Generation* pe care tocmai ai construit-o funcționează astfel:

* Tu întrebi: *"Care sunt pașii de testare din document?"*  
* Agentul vede că nu știe din memorie, așa că apelează unealta *Pinecone*.  
* Întrebarea ta este transformată în numere de nodul de Embeddings.  
* Pinecone caută rapid în fragmentele salvate în Cap. 5 și returnează doar paragraful relevant.  
* Agentul primește paragraful, îl citește fulgerător și îți formulează răspunsul perfect\!

### **5\. Momentul Adevărului: Conversația cu Datele Tale\!** {#5.-momentul-adevărului:-conversația-cu-datele-tale!}

Acum e timpul să te bucuri de munca ta. Ai creat propriul tău asistent privat, bazat pe datele tale locale\!

* În partea de jos a ecranului tău, vei vedea un buton numit **Open chat** (lângă butonul portocaliu de Execute). Apasă-l\!

![][image7]

* Se va deschide o interfață similară cu ChatGPT, direct peste planșa ta.  
* Scrie-i asistentului o întrebare specifică legată de conținutul fișierului de test pe care l-ai descărcat anterior. (Ex: *"Extrage te rog toate erorile găsite în log-ul meu"*).

![][image8]

🕵️ **Exercițiu de Gândire: "Personalitatea DevOps"**

Deschide fereastra principală a nodului **AI Agent**. Vei vedea un câmp numit **System Message** (sau Prompt). Implicit este gol, iar asistentul tău este politicos, dar generic.

Cum ai formula un *System Message* pentru a-l transforma pe acest asistent într-un inginer DevOps morocănos, obosit de viață, care dă răspunsuri extrem de tehnice, dar corecte, folosind sarcasm? (Încearcă să scrii promptul tău direct în acel câmp și deschide Chat-ul din nou\!).

# 

[image1]: /images/sessions/n8n-openai-rag/session-4/image1.png

[image2]: /images/sessions/n8n-openai-rag/session-4/image2.png

[image3]: /images/sessions/n8n-openai-rag/session-4/image3.png

[image4]: /images/sessions/n8n-openai-rag/session-4/image4.png

[image5]: /images/sessions/n8n-openai-rag/session-4/image5.png

[image6]: /images/sessions/n8n-openai-rag/session-4/image6.png

[image7]: /images/sessions/n8n-openai-rag/session-4/image7.png

[image8]: /images/sessions/n8n-openai-rag/session-4/image8.png