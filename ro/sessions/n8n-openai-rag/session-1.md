# **Sesiunea 1: Setup-ul Mediului și Primul Flux Automat**

<a href="/pdfs/sessions/n8n-openai-rag/session-1.pdf" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>Vizualizează versiunea PDF a Sesiunii 1</a>


# **Capitolul 1: Ce este n8n și de ce schimbă regulile jocului în QA & DevOps?**

| 📝 În acest capitol, demontăm mitul că automatizarea avansată necesită neapărat mii de linii de cod. Explorăm arhitectura platformei n8n, înțelegem diferența dintre un cod "hardcodat" și un flux vizual (Node-Based) și aflăm de ce o soluție self-hosted este "Sfântul Graal" pentru securitatea datelor în companii. |
| :---- |

## **1\. Evoluția Automatizării: De la Scripturi la Noduri**

Pentru inginerii QA și DevOps, automatizarea a însemnat tradițional scrierea de scripturi complexe în Bash, Python sau Java. Deși extrem de puternică, această abordare vine cu limitări majore în echipele mari:

* **Mentenanță greoaie:** Un script scris de un coleg care a plecat din firmă devine rapid un "black box" pe care nimeni nu vrea să îl atingă.  
* **Timp de dezvoltare (Time-to-Market):** Integrarea a 3 sisteme diferite (ex: Jira, Slack și un server AWS) necesită citirea a zeci de pagini de documentație API și gestionarea manuală a autentificărilor complexe.  
* **Lipsa vizibilității:** Când un script de deployment sau de testare pică, trebuie să "sapi" prin fișiere de log-uri kilometrice pentru a găsi eroarea.

Aici intervine **n8n** (pronunțat *n-eight-n*). Este o platformă de automatizare a fluxurilor de lucru (workflow automation) care transformă logica de programare în componente vizuale.

## **2\. Elementele de bază ale ecosistemului n8n**

În loc să scriem cod secvențial, linie cu linie, în n8n "desenăm" logica arhitecturii.

* **Nodul (The Node):** Reprezintă o singură acțiune sau un conector către un API extern. Gândește-te la noduri ca la piese de Lego inteligente. Există un nod pentru Google Drive, unul pentru Discord, unul pentru rularea comenzilor de Terminal pe OS, etc.  
* **Conexiunea (The Wire/Connection):** Firul vizual care leagă două noduri pe canvas. Această conexiune dictează ordinea de execuție, dar și *curgerea datelor* (Data Flow) de la stânga la dreapta.  
* **JSON (JavaScript Object Notation):** Este "limba maternă" a platformei. Toate datele care circulă prin conexiuni, de la un nod la altul, sunt formatate ca obiecte JSON (o listă structurată de chei și valori), fiind extrem de ușor de citit de către om și de manipulat de către sistem.

## **3\. De ce n8n și nu alternativele comerciale?**

Ca ingineri tehnici, te poți întreba: de ce nu am folosi Zapier sau Make.com, care sunt deja celebre?

* **Securitatea și Controlul (Self-Hosted):** Zapier este strict un SaaS (Software as a Service). Dacă automatizezi log-uri cu date sensibile, baze de date cu clienți sau cod sursă, datele tale trec prin serverele lor publice. n8n, în schimb, poate fi instalat *local* (pe laptopul tău) sau pe serverul securizat al companiei tale. Datele nu părăsesc niciodată rețeaua internă\!  
* **Modelul Fair-Code:** Poți rula platforma gratuit la capacitate maximă pentru uz intern sau de învățare.  
* **Flexibilitate absolută:** Spre deosebire de tool-urile rigide, dacă în n8n nu există un nod predefinit pentru aplicația ta, poți scrie direct cod JavaScript nativ în nodul "Code" sau poți apela orice API din lume folosind nodul universal "HTTP Request". Ești limitat doar de propria imaginație.

### **Știați că...?**

| 💡 Deși n8n este o platformă vizuală prietenoasă ("Low-Code"), în spate ea este construită în întregime pe Node.js și TypeScript? Aceasta înseamnă că beneficiază de toată viteza și arhitectura asincronă a motorului V8 (același motor care rulează Google Chrome), permițându-i să proceseze volume masive de date și mii de evenimente pe secundă fără să se blocheze\! |
| :---- |

### **Poveste Aplicată: "Banda de Asamblare"**

| 📈 Imaginează-ți n8n ca pe o bandă de asamblare dintr-o fabrică auto de ultimă generație.  🔴 Trigger-ul (Nodul de start): Este senzorul optic de la intrarea în fabrică. El stă închis și se activează doar când o mașină nouă (un eveniment/fișier) intră pe bandă.  🟢 Nodurile de acțiune: Sunt brațele robotice. Primul braț scanează mașina (citește datele), al doilea verifică dacă e vopsită corect (un nod logic de tip IF/ELSE), iar al treilea îi lipește eticheta de preț (un nod care trimite un mesaj pe Discord).  📄 JSON-ul: Este "Fișa de parcurs" electronică atașată de mașina respectivă. Fiecare braț robotic citește fișa pentru a ști ce are de făcut și adaugă informații noi pe ea înainte să o trimită la următorul braț. |
| :---- |

### **🕵️ Exercițiu de Gândire: "Ochiul de Arhitect"**

Analizează următorul proces manual plictisitor pe care un coleg QA îl face zilnic:

*"În fiecare dimineață la ora 09:00 fix, testerul deschide Jira, caută toate bug-urile cu prioritate 'Blocker' create în ultimele 24 de ore, le copiază titlurile și dă un mesaj cu ele pe canalul de Slack al echipei de Developeri pentru a fi rezolvate urgent."*

**Sarcina ta:** Cum ai transpune acest proces în piese de Lego (Noduri) în interfața n8n?

* Care ar fi Nodul 1 (Trigger-ul) și cum l-ai configura sumar?  
* Care ar fi Nodul 2 (Sursa de date/Sistemul interogat)?  
* Care ar fi Nodul 3 (Acțiunea finală)?

*(Răspunsurile corecte sunt 1\. Schedule Trigger / Cron job la 09:00. 2\. Jira Software Node \- Get Issues. 3\. Slack Node \- Send Message. Le vom discuta/verifica la finalul sesiunii).*

# **Capitolul 2: Instalarea motorului \- Node.js și n8n local (Zero Costuri)** {#capitolul-2:-instalarea-motorului---node.js-și-n8n-local-(zero-costuri)}

| 📝 În acest capitol, trecem la acțiune. Lăsăm teoria deoparte și deschidem linia de comandă. Vom pregăti infrastructura pe laptopul tău, explicând tehnic fiecare comandă, astfel încât să înțelegi exact ce rulezi, nu doar să dai Copy-Paste. |
| :---- |

Pentru a rula n8n pe propriul laptop (la costuri zero) și a avea control total asupra datelor tale, avem nevoie de motorul pe care acesta a fost scris: **Node.js**.

### **1\. Verificarea și Instalarea Node.js**

Deschide terminalul (Command Prompt / PowerShell pe Windows, sau Terminal pe Mac/Linux) și tastează:

| node \-v |
| :---- |

* **Dacă primești o versiune** (ex: v20.11.0 sau mai nouă), ești pregătit\!  
* **Dacă primești o eroare**, înseamnă că trebuie să descarci și să instalezi Node.js de pe site-ul oficial (nodejs.org). *Atenție pentru Windows:* asigură-te că la instalare lași bifată opțiunea *"Add to PATH"*.

### **2\. Instalarea ecosistemului n8n**

Odată ce avem Node.js, vom folosi managerul său de pachete pentru a descărca n8n. Rulează următoarea comandă în terminal:

| npm install \-g n8n |
| :---- |

**Să disecăm această comandă, linie cu linie:**

* **npm (Node Package Manager):** Este unealta din Node.js care se ocupă cu găsirea, descărcarea și instalarea de software de pe internet (este ca un App Store pentru programatori).  
* **install:** Comanda clară pe care i-o dăm lui npm de a instala un pachet.  
* **\-g (Global):** Acest "steag" (flag) îi spune sistemului de operare să instaleze n8n pe *tot* calculatorul. Fără el, n8n s-ar instala doar în folderul curent. Datorită lui \-g, vei putea porni n8n de oriunde.  
* **n8n:** Numele exact al pachetului pe care vrem să-l descărcăm de pe serverele publice.

![][image1]

### **3\. Bypass-ul de Securitate (SSL) \- Setarea de Mediu**

Deoarece vom rula platforma local (adresa ta va fi http://localhost), browser-ul și n8n ne pot bloca anumite funcționalități avansate (cum ar fi conectarea contului la Google Drive prin OAuth2) deoarece nu folosim un protocol securizat https.

Ca ingineri, știm că pe mediul nostru local suntem în siguranță, așa că trebuie să îi transmitem platformei să ignore temporar această regulă. În același terminal, rulează comanda specifică sistemului tău de operare:

* **Pe Mac / Linux:** 

| export N8N\_SECURE\_COOKIE=false |
| :---- |

* **Pe Windows (CMD):**

| set N8N\_SECURE\_COOKIE=false |
| :---- |

* **Pe Windows (PowerShell):** 

| $env:N8N\_SECURE\_COOKIE="false" |
| :---- |

**Ce face această comandă?**

Creează o *Variabilă de Mediu* (Environment Variable). Aceasta este o "etichetă" invizibilă atașată sesiunii tale de terminal. Când n8n va porni imediat după, va citi sistemul de operare, va vedea această etichetă și va ști să dezactiveze restricțiile stricte privind securitatea cookie-urilor web.

### **4\. Pornirea Motorului\!**

Acum totul este pregătit. Rulează simplu în terminal:

| n8n |
| :---- |

Terminalul va afișa logo-ul n8n ASCII și îți va spune că serverul rulează. Lasă terminalul deschis (el este "creierul" acum) și deschide browser-ul tău preferat. Accesează adresa:

[**http://localhost:5678**](http://localhost:5678)

**![][image2]**

**![][image3]**

**Felicitări**\! Ești în interfața vizuală a automatizării. Primul lucru pe care ți-l va cere este să setezi un cont local de admin.

💡 **Știați că...?**

|  💡 n8n folosește intern o bază de date SQLite pentru a-ți salva toate automatizările, credențialele și istoricul de execuții. De aceea este atât de ușor să îl rulezi pe laptop: nu trebuie să instalezi, să configurezi și să menții baze de date greoaie precum MySQL sau PostgreSQL. Totul stă compact într-un simplu fișier ascuns pe hard disk-ul tău\! |
| :---- |

🧱 **Poveste Aplicată: "Fundația și Casa Inteligentă"**

| 🧠 Imaginează-ți că vrei să construiești o casă complet automatizată. Node.js: Este fundația de ciment. Fără această fundație solidă turnată direct în pământ (sistemul de operare), casa nu poate fi construită. n8n: Este casa inteligentă propriu-zisă pe care o "construiești" (instalezi) deasupra fundației. npm (Managerul de pachete): Este magazinul de materiale de construcții (gen Dedeman/Brico Depot) care îți livrează gratuit "pachetul n8n" de la producător direct pe șantierul tău (laptopul). |
| :---- |

🕵️ **Exercițiu de Gândire: "Detectivul din Terminal"**

Analizează următoarea situație de zi cu zi dintr-o echipă de testare:

*Un coleg QA încearcă să instaleze n8n. Deschide Command Prompt pe Windows și tastează npm install \-g n8n. Imediat, terminalul îi returnează această eroare cu text roșu:*

'npm' is not recognized as an internal or external command, operable program or batch file.

**Sarcina ta:** Făcând pe detectivul (Troubleshooting), ce pas a ratat colegul tău înainte să ruleze comanda și cum îl ajuți să rezolve problema?

### **✅ Soluții și Răspunsuri** {#✅-soluții-și-răspunsuri}

**Soluție Exercițiul "Detectivul din Terminal":**

Colegul a ratat **Pasul 1**. Sistemul de operare îi spune clar că nu cunoaște cuvântul npm. Asta înseamnă că:

1. Fie nu are Node.js instalat deloc pe calculator.  
2. Fie (cel mai frecvent scenariu pe Windows) a instalat Node.js, dar la pașii de instalare **a uitat să bifeze căsuța "Add to PATH"**. Fără această setare, Windows-ul nu știe unde se află executabilul npm pe hard disk.  
   *Rezolvare:* Trebuie să descarce din nou installer-ul Node.js, să ruleze procesul de instalare și să se asigure că opțiunea "Add to PATH" (sau "Add to environment variables") este activată. Apoi, trebuie să restarteze terminalul.

# **Capitolul 3: Sursa de date și Primul Trigger \- Conectarea la Google Drive** {#capitolul-3:-sursa-de-date-și-primul-trigger---conectarea-la-google-drive}

| 📝 În acest capitol, dăm viață automatizării noastre. Un flux de lucru are nevoie de un punct de pornire (un eveniment). Vom învăța cum să facem n8n să comunice în siguranță cu ecosistemul Google și vom înțelege diferența arhitecturală dintre a "întreba" și a "asculta" în lumea API-urilor. |
| :---- |

Pentru a extrage documentația tehnică sau planurile de testare, vom folosi **Google Drive**. Totuși, Google nu lasă pe oricine să îți citească fișierele. Avem nevoie de un "buletin de identitate" digital pentru n8n, numit OAuth2.

### **1\. Cum comunică sistemele? Polling vs. Webhook**

Înainte de a adăuga primul nod, ca ingineri trebuie să alegem *mecanismul* prin care n8n află că a apărut un fișier nou în cloud. Există două metode fundamentale în arhitectura sistemelor:

| Caracteristică | Polling (Întrebare repetată) | Webhook (Notificare "Push") |
| :---- | :---- | :---- |
| **Cine inițiază discuția?** | Clientul (n8n) | Serverul Extern (ex: Google / Slack) |
| **Cum funcționează?** | n8n întreabă din minut în minut: *"Ai un fișier nou? Dar acum?"* | n8n stă degeaba. Google îi trimite un semnal: *"Hei, a apărut un fișier\!"* |
| **Timp de reacție** | Depinde de interval (ex: reacționează după max. 1 minut) | Instantaneu (Real-Time) |
| **Consum de resurse** | Ridicat (generează trafic și interogări inutile) | Foarte scăzut (se activează doar la eveniment) |

Pentru Google Drive, n8n folosește nativ mecanismul de **Polling**, verificând folderul la intervale regulate pe care le vom defini noi (ex: la fiecare minut).

### **2\. Activitate Practică: Conectarea la Google Drive** {#2.-activitate-practică:-conectarea-la-google-drive}

Pentru această activitate, trebuie să creăm o punte sigură (OAuth2) între mașina noastră locală (unde rulează n8n) și serverele Google. Din cauza măsurilor stricte de securitate Google, vom parcurge pașii într-o ordine specifică.

**Pasul 0: Prima interacțiune cu n8n**

* Deschide browser-ul și accesează [http://localhost:5678](http://localhost:5678).  
* Creează-ți **contul local** de administrator (aceste date rămân doar pe calculatorul tău).  
* În fața ta se va deschide „Canvas-ul” – planșa ta de lucru vizuală.

**Pasul 1: Pregătirea terenului în n8n**

Înainte de a merge la Google, trebuie să aflăm adresa la care **Google** ne va **trimite** răspunsul.

* Pe canvas, dă click pe butonul **Add first step** (Adaugă primul pas).  
* Caută și selectează **Google Drive**.  
* Ca acțiune (Trigger), alege: **On specific changes to a file or folder** (La modificări specifice ale unui fișier/folder).

![][image4]

* La secțiunea de credențiale, selectează **Create New Credential** și alege tipul **OAuth2 (recommended)**.  
* În fereastra care se deschide, copiază link-ul de la secțiunea **OAuth Redirect URL** (de obicei este: [http://localhost:5678/rest/oauth2-credential/callback](http://localhost:5678/rest/oauth2-credential/callback)). Păstrează acest link în clipboard.

![][image5]

**Pasul 2: Configurarea Google Cloud Console**

Acum că știm adresa de întoarcere a n8n-ului, mergem să îi spunem lui Google să aibă încredere în ea.

* Accesează [Google Cloud Console](https://console.cloud.google.com/) și loghează-te cu contul tău de Google.  
* Apasă pe **Select a project** (în bara de sus) \-\> **New Project**, numește-l „n8n-QA-Automation” și dă Create.

![][image6]

![][image7]

* Caută în bara de sus **Google Drive API** și apasă butonul **Enable** (Activează).

![][image8]

**Pasul 3: Evitarea erorii "Access Denied" (Vital\!)**

**Google** a actualizat recent interfața de securitate. Dacă sărim acest pas, nu ne vom putea conecta\!

* Din meniul principal (stânga), mergi la **APIs & Services** \-\> **OAuth consent screen** (sau *Google Auth Platform* dacă ai interfața nouă).  
* Mergi la secțiunea **Audience** (Audiență) situată în meniul din stânga.  
* Deoarece aplicația ta este în stadiul de **„Testing**”, Google va bloca din oficiu accesul. Derulează până găsești secțiunea **Test users**.  
* Apasă pe **\+ ADD USERS** și introdu exact adresa ta de email cu care te loghezi în Google. Apasă **Save**.

![][image9]

**Pasul 4: Generarea Cheilor Secrete**

Acum creăm legătura propriu-zisă.

* Din meniul din stânga, mergi la **Clients** (sau Credentials) \-\> **Create Credentials** \-\> **OAuth client ID**.  
* La Application type alege **Web application**. Numește-o "n8n local".

![][image10]

* La secțiunea **Authorized redirect URIs**, apasă *Add URI* și **lipește link-ul copiat de la Pasul 1 din n8n**.  
* Apasă **Create**. Google îți va oferi un **Client ID** și un **Client Secret**.

![][image11]

**Pasul 5: Conectarea Finală**

* Întoarce-te în fereastra n8n (acolo unde te-ai oprit la Pasul 1).  
* Introdu **Client ID-ul** și **Client Secret-ul** în căsuțele corespunzătoare.  
* Apasă butonul verde **Sign in with Google**.  
  ![][image12]  
* Autorizează accesul din fereastra Google care va apărea (aprobând permisiunile pentru a accesa Google Drive). Ignoră avertismentul "Google hasn't verified this app" apăsând pe *Advanced* și apoi *Go to n8n-QA-Automation (unsafe)*, deoarece este aplicația ta creată local.  
* Mesajul **„Connection successful”** va apărea pe ecran\! Ai reușit prima ta integrare API complexă fără să scrii nicio linie de cod.

![][image13]

![][image14]

**Pasul 6: Prima interogare (Fetch Test Event)**

Acum că avem conexiunea securizată, trebuie să testăm dacă Trigger-ul detectează fișiere reale.

* Închide fereastra de credențiale cu succes și întoarce-te la setările nodului de Google Drive din n8n.  
* La câmpul *Trigger On* (Declanșare la), alege In a Specific Folder (Într-un folder specific).  
* La câmpul *Folder*, folosește butonul de selecție pentru a alege un folder din Drive-ul tău (sau creează unul nou, ex: "Date\_Teste\_n8n"). La câmpul *Watch For*, asigură-te că este selectat File Created (Fișier creat).

![][image15]

* Acțiune manuală: Mergi într-un alt tab din browser direct în Google Drive-ul tău și încarcă un fișier de test (ex: un fișier PDF sau TXT) în acel folder. Așteaptă 5-10 secunde pentru ca Google să indexeze fișierul.

![][image16]

* Întoarce-te în n8n și apasă butonul Fetch Test Event (sau *Test Step*).  
* Magie\! În panoul din dreapta (Output) vei vedea datele fișierului tău original sub formă de JSON (numele fișierului, ID-ul lui unic, data creării). Trigger-ul tău este acum "viu" și ascultă\!

![][image17]💡 **Știați că...?**

| 💡 Majoritatea integrărilor Enterprise eșuează nu din cauza codului, ci din cauza gestionării slabe a credențialelor. n8n nu salvează Client Secret-ul tău ca text simplu (plain text) pe disk, ci îl criptează folosind o cheie unică generată automat la prima instalare. De aceea este o soluție preferată în departamentele DevOps orientate spre securitate (SecOps). |
| :---- |

🧱 **Poveste Aplicată: "Poștașul și Cutia Poștală"**

Pentru a reține mai ușor diferența de la punctul 1:

* **Polling-ul:** Ești tu (n8n) coborând scările blocului din 5 în 5 minute să verifici cutia poștală (Google Drive) ca să vezi dacă a venit revista preferată. Irosești energie, iar de cele mai multe ori cutia e goală.  
* **Webhook-ul:** Este ca și cum Poștașul (Sistemul Extern) ar avea numărul tău de telefon. Tu stai relaxat pe canapea, fără să consumi energie. Când revista ajunge în cutie, Poștașul îți dă un SMS (HTTP POST Request). Tu cobori exact la momentul potrivit\!

🕵️ **Exercițiu de Gândire: "Reacția la Urgențe"**

Echipa ta de infrastructură (DevOps) folosește o aplicație internă de monitorizare a serverelor. Ți se cere să faci o automatizare în n8n care să restarteze un server de test **IMEDIAT** cum aplicația detectează o eroare critică (Crash).

**Sarcina ta:** Ca arhitect QA/DevOps, ce mecanism vei alege pentru nodul Trigger al acestei automatizări: Polling la 1 minut sau Webhook? Justifică tehnic decizia.

### **✅ Soluții și Răspunsuri** {#✅-soluții-și-răspunsuri-1}

**Soluție Exercițiul "Reacția la Urgențe":**

Singurul răspuns tehnic acceptat este **Webhook**.

*Justificarea:* Cerința specifică nevoia unei reacții **IMEDIATE** (în timp real). Dacă am folosi Polling la 1 minut, ar exista riscul ca serverul să crape la secunda 1, iar automatizarea să afle despre asta abia la secunda 59 (când face următoarea interogare programată). Într-o situație de criză pe infrastructură, 59 de secunde de "downtime" pot afecta mii de utilizatori. Webhook-ul, fiind un sistem de notificare "Push", va declanșa fluxul n8n fix în milisecunda în care aplicația de monitorizare trimite semnalul de eroare.

[image1]: /images/sessions/n8n-openai-rag/session-1/image1.png

[image2]: /images/sessions/n8n-openai-rag/session-1/image2.png

[image3]: /images/sessions/n8n-openai-rag/session-1/image3.png

[image4]: /images/sessions/n8n-openai-rag/session-1/image4.png

[image5]: /images/sessions/n8n-openai-rag/session-1/image5.png

[image6]: /images/sessions/n8n-openai-rag/session-1/image6.png

[image7]: /images/sessions/n8n-openai-rag/session-1/image7.png

[image8]: /images/sessions/n8n-openai-rag/session-1/image8.png

[image9]: /images/sessions/n8n-openai-rag/session-1/image9.png

[image10]: /images/sessions/n8n-openai-rag/session-1/image10.png

[image11]: /images/sessions/n8n-openai-rag/session-1/image11.png

[image12]: /images/sessions/n8n-openai-rag/session-1/image12.png

[image13]: /images/sessions/n8n-openai-rag/session-1/image13.png

[image14]: /images/sessions/n8n-openai-rag/session-1/image14.png

[image15]: /images/sessions/n8n-openai-rag/session-1/image15.png

[image16]: /images/sessions/n8n-openai-rag/session-1/image16.png

[image17]: /images/sessions/n8n-openai-rag/session-1/image17.png