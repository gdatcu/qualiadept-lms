# **Sesiunea 4: Introducere în Jira & Test Management**

<a href="/pdfs/sessions/masterclass-qa-manual/session-4.pdf" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>Vizualizează versiunea PDF a Sesiunii 4</a>

|  📝 Bine ai venit în Modulul 2\!  Până acum am învățat *cum* să gândim ca un QA și *cum* să scriem un plan sau un caz de test. Dar într-o companie cu sute de angajați, nu poți ține aceste planuri într-un fișier Word pe desktopul tău. Ai nevoie de un sistem centralizat, vizibil pentru toți.  Aici intră în scenă Jira, cel mai popular instrument de management al proiectelor software din lume. |
| :---- |

## **Capitolul 1: Jira și Metodologia Agile (Limbajul Corporațiilor)**

### **1\. Ce este Jira?**

Dezvoltat de compania Atlassian, Jira a fost creat inițial ca un simplu sistem de urmărire a bug-urilor (Bug Tracker). Astăzi, a evoluat într-un ecosistem complet în care echipele își planifică munca, își asignează sarcini, urmăresc progresul și lansează software.

### **2\. De ce folosim Jira? (Contextul Agile)**

În trecut (în modelul Waterfall), software-ul se construia liniar: 6 luni de analiză, 1 an de programare, 3 luni de testare. Astăzi, companiile folosesc metodologia **Agile** (și framework-ul **Scrum**).

* **Sprint-ul:** În Agile, munca este împărțită în „bucăți” mici, numite Sprint-uri (de obicei 2 săptămâni). La finalul a 2 săptămâni, echipa trebuie să livreze o funcționalitate completă și testată.  
* **Rolul Jira:** Jira este tabla (Board-ul) pe care punem toate ideile, cerințele și bug-urile. El ne ajută să răspundem instant la întrebările: *„Ce avem de făcut sprintul acesta?”*, *„La ce lucrează Ionuț acum?”*, *„Câte bug-uri mai avem de reparat până vineri?”*.


## **Capitolul 2: Ierarhia Jira (Epic, Story, Task, Bug)**

Pentru a nu transforma proiectul într-un haos, Jira folosește „Tichete” (Issues) strict ierarhizate. Să învățăm vocabularul zilnic al oricărei echipe IT:

### **1\. Epic-ul (Proiectul Mare)**

* **Definiție:** O bucată masivă de muncă ce nu poate fi finalizată într-un singur Sprint (2 săptămâni). Este o colecție de cerințe mai mici care au un obiectiv comun.  
* **Exemplu (OrangeHRM):** EPIC-01: Modulul de Recrutare (Recruitment).  
* **Cine îl creează?** Product Owner-ul sau Project Managerul.

### **2\. User Story-ul (Cerința de Business)**

* **Definiție:** O cerință software scrisă din perspectiva utilizatorului final. Răspunde la formatul:

“Ca \[**Tip de utilizator / Rol**\],

Vreau să **\[Acțiune / Funcționalitate**\],

Astfel încât să \[**Beneficiu / Valoare adăugată**\].”

* Aceasta este unitatea de bază de care te vei lovi cel mai des ca QA. Un Story trebuie să poată fi terminat într-un singur Sprint.  
* **Exemplu (OrangeHRM):** STORY-05: Ca Manager, vreau să pot încărca CV-ul unui candidat în format PDF.

**Exemple practice:**

* **Ca un** cumpărător frecvent, **vreau să** pot salva produsele într-o listă de favorite, **ca să** le pot cumpăra mai rapid data viitoare.  
* **Ca** administrator de sistem, **vreau să** primesc o alertă prin email când serverul atinge 90% din capacitate, **astfel încât să** pot preveni blocarea aplicației.

**Structura completă a unui User Story**

În tool-urile de project management (cum ar fi **Jira** sau Azure DevOps), un User Story eficient este însoțit întotdeauna de **Criterii de Acceptare** (*Acceptance Criteria*), scrise adesea în formatul BDD (***Given**\-**When**\-**Then***):

* **Titlu:** \[Rol\] \- \[Funcționalitate scurtă\]  
* **Descriere:** Formatul standard menționat mai sus (***Ca**... **Vreau**... **Ca să**...*)  
* **Criterii de acceptare:**  
  * *Dat fiind* (Contextul inițial)  
  * *Când* (Acțiunea utilizatorului)  
  * *Atunci* (Rezultatul așteptat)

### **3\. Task-ul (Sarcina Tehnică)**

* **Definiție:** O sarcină de muncă ce trebuie făcută, dar care nu aduce o valoare directă sau vizibilă utilizatorului final.  
* **Exemplu:** TASK-12: Actualizarea bazei de date de la versiunea 1.4 la 1.5 sau TASK-13: Crearea documentației pentru API.

### **4\. Bug-ul (Defectul)**

* **Definiție:** Raportul creat de Tester (QA) atunci când software-ul nu se comportă conform User Story-ului (rezultatul real nu se potrivește cu rezultatul așteptat).  
* **Exemplu:** BUG-22: Eroare 500 la apăsarea butonului de încărcare CV (PDF).

### **5\. Sub-task-ul (Sub-sarcina)**

* **Definiție:** Este „copilul” unui Story, Task sau Bug. Reprezintă pașii mărunți necesari pentru a închide tichetul părinte.  
* **Exemplu:** Pentru STORY-05, putem avea:  
  * Sub-task 1: (Pentru Dev) Scrierea codului pentru butonul de Upload.  
  * Sub-task 2: (Pentru QA) Crearea cazurilor de test pentru încărcarea CV-ului.

### **💡 Analogia QualiAdept: „Construirea unui Cartier Rezidențial”**

| 💡 Imaginează-ți Jira ca pe panoul de comandă al unei firme de construcții: Epic-ul este *Construirea Blocului A*. Va dura un an. User Story-ul este *Apartamentul 12 de la etajul 3*. Îl construim ca utilizatorul să se poată muta în el. Are living, baie și bucătărie. Task-ul este *Săparea fundației* sau *Aducerea macaralei*. Locatarul nu vede aceste lucruri, dar fără ele nu poate exista apartamentul. Sub-task-ul este *Montarea faianței în baia apartamentului 12*. (O activitate măruntă pentru a termina Story-ul). Bug-ul este momentul în care Inspectorul de Calitate (QA) deschide robinetul din Apartamentul 12 și constată că *țeava curge sub chiuvetă*. Trebuie reparat înainte ca locatarul să primească cheile\! |
| :---- |

### **🕵️ Exercițiu de Gândire: „Încadrează Tichetul”**

Citește următoarele tichete și decide dacă sunt Epic, Story, Task sau Bug:

* Modulul complet de Procesare a Plăților (card, transfer, crypto). (**\_\_\_\_\_\_\_\_\_**)  
* Butonul „Log in” este vizibil, dar când îl apăs nu se întâmplă nimic. (**\_\_\_\_\_\_\_\_\_**)  
* Ca utilizator neînregistrat, vreau să pot vedea catalogul de produse pentru a mă decide ce să cumpăr. (**\_\_\_\_\_\_\_\_\_**)  
* Setarea noului server de testare pentru echipa de QA. (**\_\_\_\_\_\_\_\_\_**)

## **Capitolul 3: Ghid Practic \- Construiește-ți propriul laborator Jira**

|  🎯Acum că știm ce sunt tichetele și metodologia Agile, este momentul să ne murdărim pe mâini. În corporații, vei primi un cont gata făcut. Însă, pentru a exersa acasă, te vom învăța cum să îți creezi propria instanță de Jira, complet gratuită, folosind noul flux de configurare Atlassian. Urmează acești pași exact cum sunt scriși. Nu ai nevoie de card bancar, doar de o adresă de email. |
| :---- |

### **Pasul 1: Înregistrarea contului gratuit**

Jira oferă un plan gratuit pentru echipe mici (până la 10 utilizatori), perfect pentru portofoliul tău.

* **Accesează site-ul:** Intră pe [https://www.atlassian.com/software/jira](https://www.atlassian.com/software/jira) și apasă pe butonul albastru **„Get it free”** (sus în meniu).

![][image1]

* **Autentificarea:** În fereastra „Get started with Jira”, introdu adresa ta de email și apasă **Sign up** (sau alege „Continue with Google” pentru rapiditate).

![][image2]

* **Numește-ți site-ul (Create a site):** Jira îți va cere să alegi un nume pentru spațiul tău web (ex: portofoliu-numeletau.atlassian.net). Alege un nume profesional, asigură-te că apare bifa verde și apasă **Continue**.

![][image3]

### **Pasul 2: Asistentul de Configurare (Crearea primului tău Board/Space)**

Atlassian a simplificat crearea proiectelor printr-un asistent care te întreabă cum vrei să lucrezi. Răspunde astfel pentru a obține un board Agile/Scrum perfect pentru QA:

* **What kind of work do you do?** (Ce tip de muncă faci?)  
  * Alege **Software development**.  
* **How does your team plan to use Jira?** (Cum plănuiește echipa să folosească Jira?)  
  * Bifează opțiunea **Work in scrum** (și opțional *Track bugs*). Apasă **Continue**.  
* **Name your space** (Numește-ți spațiul/proiectul):  
  * Aici creezi efectiv panoul de testare. Scrie la Name your space: **OrangeHRM QA** (sau QA Testing). Apasă **Get started**.  
* **What types of work do you need?** (De ce tipuri de tichete ai nevoie?)  
  * Asigură-te că sunt bifate cel puțin: **Task**, **Story** și **Bug**. Acestea sunt „cărămizile” de care ai nevoie pentru a raporta defecte și cerințe. Apasă **Next**.

![][image4]

Gata\! Sistemul te va arunca direct în meniul de **Backlog** al noului tău spațiu de lucru.

### **Pasul 3: Crearea primului tău Tichet (User Story)**

Dacă te uiți la ecranul tău, ai un meniu principal pe stânga și o zonă mare de lucru pe centru (Backlog-ul). Hai să adăugăm o cerință de business.

* Uită-te în bara de sus a ecranului. Lângă bara de căutare (Search), apasă pe butonul albastru **Create** (Creare).  
* Se va deschide o fereastră nouă (Issue Create).  
* **Project/Space:** Asigură-te că este selectat spațiul tău („OrangeHRM QA” sau „QA Testing”).  
* **Issue type (Tipul tichetului):** Alege **Story** (Cerință).  
* **Summary (Titlu):** Scrie: *„Ca Utilizator, vreau să mă pot loga cu credențiale valide pentru a accesa dashboard-ul”*.  
* **Description (Descriere):** Scrie criteriile de acceptanță. (Ex: *1\. Sistemul trebuie să accepte username-ul 'Admin'. 2\. Parola trebuie să fie mascată.*)  
* Apasă butonul **Create** din colțul dreapta-jos.

Dacă te uiți în zona centrală a ecranului, la secțiunea **Backlog**, vei vedea primul tău tichet creat și pregătit pentru sprint\!

![][image5]

### **Pasul 4: „Magia” QA \- Instalarea Plugin-ului de Testare (Zephyr Scale)**

Jira standard este perfect pentru a muta tichete, dar nu are butoane de *„Scrie Test Case”*. Pentru asta, trebuie să instalăm o extensie dedicată testerilor. Vom folosi **Zephyr Scale**, cel mai modern tool gratuit.

* Uită-te în **meniul vertical din stânga** (cel cu fundal închis la culoare).  
* Sub secțiunile *Recent*, *Starred* etc., apasă pe secțiunea **Apps** (Aplicații).  
* Din meniul derulant, alege **Explore more apps** (Explorează mai multe aplicații).  
* În bara de căutare a magazinului, scrie **Zephyr Scale**.  
* Apasă pe aplicația *Zephyr Scale \- Test Management for Jira*.

![][image6]

* Apasă pe butonul **Try it free** (sau Get app). Este 100% gratuit pentru contul tău.  
* Așteaptă instalarea și întoarce-te în spațiul tău (OrangeHRM QA).

**Testul de succes:** În meniul spațiului tău de lucru ar trebui să apară acum opțiunea **Zephyr Scale**. Dacă este acolo, laboratorul tău de QA este complet configurat și gata de acțiune\!

![][image7]

## **Capitolul 4: Scrierea și Execuția Primului Test Case (Zephyr Scale)**

|  🧠 Dacă Jira este panoul de comandă al proiectului, Zephyr Scale este agenda ta personală de tester. În acest capitol, vom lua cerința creată la pasul anterior (User Story-ul cu Logarea) și o vom „acoperi” cu un caz de test profesionist.  |
| :---- |

### **Pasul 1: Crearea Test Case-ului în Zephyr**

* În meniul din stânga al proiectului tău „OrangeHRM QA”, apasă pe **Zephyr Scale**.  
* Din meniul de sus al plugin-ului, selectează secțiunea **Tests** (Teste).  
* Apasă butonul albastru **New Test Case** (Caz de test nou) din dreapta-sus.  
* Se va deschide un formular detaliat. Hai să-l completăm:  
  * **Name (Nume):** *Verificarea autentificării cu credențiale valide de Admin.*

*![][image8]*

* **Objective (Obiectiv \- opțional):** *Să ne asigurăm că un utilizator cu drepturi de administrator poate accesa sistemul.*

*![][image9]*

* **Precondition (Precondiție):** *Utilizatorul trebuie să aibă un cont activ de Admin și să fie pe pagina de Login (URL: hrm.orange.com/login).*

### **Pasul 2: Scrierea Pașilor (Test Script)**

Aici intervine munca de execuție. Apasă pe tab-ul **Test Script** (aflat imediat sub numele testului).

Vei vedea un tabel cu acțiuni (Test Step) și rezultate așteptate (Expected Result). Hai să adăugăm pașii:

* **Pasul 1:**  
  * *Test Step:* Introdu în câmpul Username textul Admin.  
  * *Expected Result:* Textul este introdus cu succes.  
  * Apasă *Add Step* (sau Enter).  
* **Pasul 2:**  
  * *Test Step:* Introdu parola corectă în câmpul Password.  
  * *Expected Result:* Parola este mascată (apar steluțe/puncte).  
* **Pasul 3:**  
  * *Test Step:* Apasă pe butonul "Login".  
  * *Expected Result:* Sistemul acceptă datele și utilizatorul este redirecționat către pagina principală (Dashboard).

![][image10]

### **Pasul 3: „Sfântul Graal” al QA-ului \- Trasabilitatea (Traceability)**

Acesta este cel mai important pas pe care un QA Manual îl face în Jira. Trebuie să demonstrăm managerului de ce am scris acest test. Trebuie să îl *legăm* de cerința inițială.

* Apasă pe tab-ul **Traceability** (Lângă Test Script).  
* La secțiunea *Issues*, apasă pe **Link Issues** (sau căsuța de search).  
* Caută User Story-ul pe care l-ai creat în Capitolul 3 (*„Ca Utilizator, vreau să mă pot loga...”*).  
* Selectează-l și apasă **Link**.  
* În cele din urmă, apasă butonul **Save** din dreapta-sus pentru a salva tot cazul de test.

![][image11]

**Felicitări\!** Acum, dacă cineva deschide User Story-ul, va vedea atașat Test Case-ul tău. Știe că acea cerință este „acoperită” (Test Coverage).

### **Pasul 4: Execuția Testului (Test Cycle)**

Să zicem că dezvoltatorul (Developerul) îți spune: *"Am terminat de programat logarea, poți să o testezi\!"*. Tu nu doar deschizi site-ul și testezi haotic, ci pornești o „Execuție”.

* În Zephyr, mergi la tab-ul **Test Cycles** (Cicluri de testare). Un ciclu este practic o "mapă" în care adunăm testele pe care vrem să le rulăm azi.  
* Apasă **New Test Cycle**. Pune-i numele: *Execuție Sprint 1*. Apasă Save.

![][image12]

* Intră în acest Test Cycle, mergi la tab-ul **Test Cases** și apasă **Add Test Cases**. Selectează testul tău de logare și adaugă-l.

![][image13]

* Acum, în dreptul testului, vei vedea statusul „Not Executed” (Neexecutat). Apasă pe butonul **Play (Start Execution)**.  
* Se va deschide fereastra de execuție a pașilor\!

Aici, ca QA, începi să faci pașii pe aplicația reală (sau pe mediu de test). Pentru fiecare pas din scriptul tău, ai butoane de status:

* ✅ **Pass:** A mers perfect.  
* ❌ **Fail:** Aplicația a făcut altceva (eroare).  
* 🚧 **Blocked:** Nu poți testa pasul (ex: a căzut serverul sau nu ai net).

![][image14]

### **Pasul 5: Scenariul de Eșec (Raportarea unui BUG)**

Ce facem dacă la Pasul 3 (apasă Login), aplicația ne dă eroarea „Eroare de Server 500”?

* La Pasul 3 în Zephyr, schimbi statusul din *Not Executed* în **Fail ❌**.  
* Zephyr este inteligent: îți va afișa imediat un buton **Create Issue (Creare Bug)**.  
* Apasă-l și scrie detaliile Bug-ului:  
  * *Summary:* Eroare 500 la apăsarea butonului Login cu date valide.  
  * *Description:* Documentezi pașii de reproducere, rezultatul așteptat (trebuia să intru în Dashboard) și rezultatul real (am primit eroare 500). Pui un Screenshot (Print Screen).  
* Apasă Create.

![][image15]

**Magia Jira:** Acest Bug se leagă automat de Test Case-ul tău, care este legat de User Story. Astfel, Product Owner-ul poate vedea direct din Story: *Avem un bug deschis, deci nu putem lansa funcționalitatea la clienți\!*

### **💡 Analogia QualiAdept: „Polițistul Rutier”**

* **User Story-ul** este legea care spune: *"Mașinile trebuie să oprească la roșu"*.  
* **Test Case-ul (Scriptul)** este radarul pe care tu îl instalezi: *"Măsor dacă mașina X oprește la semafor"*.  
* **Traceability (Trasabilitatea)** este legătura din dosar: *"Am instalat acest radar PENTRU A verifica legea opririi la roșu"*.  
* **Execuția** este momentul în care te uiți efectiv la semafor.  
* **Bug-ul** este amenda pe care o scrii dacă mașina (aplicația) trece pe roșu\!

### **🚀 Ce urmează?**

Cu aceste cunoștințe, poți deja să fii funcțional într-o companie de IT încă din prima zi\! Ai învățat să citești cerințe, să scrii pași clari, să-i execuți și să dovedești cu bug-uri problemele găsite. Acesta este ciclul vieții unui tester manual\!

## **Capitolul 5: Recapitulare, Concluzii și Modul Bonus (JQL & Dashboards)**

| 🎯 Am ajuns la finalul uneia dintre cele mai practice și importante sesiuni din acest curs. Ai învățat nu doar teoria Agile, ci și cum să îți configurezi propriul spațiu de lucru în Jira, instrumentul suprem folosit de corporațiile IT din întreaga lume. |
| :---- |

### **1\. Recapitulare Exhaustivă: Ce am învățat în Sesiunea 4?**

* **Limbajul Agile:** Am învățat că nu mai lucrăm cu documente de sute de pagini, ci cu tichete (Issues) clar ierarhizate: **Epic** (obiectiv mare) ➡️ **User Story** (cerința clientului) ➡️ **Task / Sub-task** (munca tehnică) ➡️ **Bug** (defectul).  
* **Configurarea Mediului:** Am trecut prin interfața modernă Jira (2026), setând un proiect/space de tip **Scrum**, optimizat pentru testare (QA Testing).  
* **Managementul Testelor:** Am instalat și folosit extensia **Zephyr Scale**. Acum știm că un Test Case scris în Excel este o relicvă a trecutului.  
* **Trasabilitate (Traceability):** Am învățat regula de aur a testării moderne: *Niciun test nu trebuie să existe "în aer"*. Am conectat (mapat) Test Case-ul nostru direct la User Story-ul din Jira, pentru a dovedi acoperirea cerințelor.  
* **Execuția (Test Cycle):** Am grupat testele într-un ciclu de execuție, le-am rulat și am marcat pașii cu „Pass” sau „Fail”.


## **🎁 Bonus: „Secretele unui QA Senior în Jira”**

Un tester începător dă click prin meniuri pentru a găsi ceea ce caută. Un tester QualiAdept folosește uneltele avansate ale platformei pentru a fi de 10 ori mai rapid. În acest modul bonus explorăm funcționalități esențiale în peisajul IT actual.

### **A. JQL (Jira Query Language) \- Căutarea ca un Hacker**

JQL este limbajul prin care poți interoga baza de date Jira pentru a găsi exact tichetele de care ai nevoie. Se folosește în bara de căutare superioară (secțiunea *Filters* \-\> *Advanced issue search*).

* **Exemplul 1 (Ce am de testat azi?):**  
  Vrei să vezi toate User Story-urile care sunt pe statusul „IN QA” și sunt alocate ție.

| status \= "IN QA" AND assignee \= currentUser() |
| :---- |

* **Exemplul 2 (Vânătoarea de Bug-uri):**  
  Vrei să vezi toate Bug-urile create de tine săptămâna aceasta, care încă nu au fost rezolvate de developeri.

| issuetype \= Bug AND reporter \= currentUser() AND status \!= Done AND created \>= startOfWeek() |
| :---- |

**💡 Sfat QualiAdept:** Odată ce ai scris un JQL bun, îl poți salva ca un **Filter** (Filtru). Astfel, data viitoare ai nevoie doar de un singur click pentru a rula aceeași căutare\!

### **B. Dashboards (Tablouri de Bord) și Raportare Vizuală**

Ca QA, va trebui adesea să prezinți starea calității către management. Managerii nu au timp să citească 100 de Test Case-uri; ei vor grafice.

* **Crearea unui Dashboard:** Din meniul principal Jira ➡️ *Dashboards* ➡️ *Create dashboard*.  
* **Adăugarea de Gadget-uri (Widget-uri):**  
  * **Pie Chart (Grafic circular):** Poți crea un grafic care să îți arate din cele 50 de bug-uri raportate, câte sunt Critice, Majore sau Minore.  
  * **Zephyr Scale Metrics:** Fiindcă ai instalat Zephyr, ai gadget-uri speciale (ex: *Test Execution Results*). Cu un singur grafic arăți câte teste au fost trecute (Pass), picate (Fail) sau neexecutate (Unexecuted) în sprintul curent.

### **C. Inteligența Artificială în Jira (Atlassian Intelligence / Rovo)**

În ecosistemul Atlassian al anului 2026, AI-ul este integrat nativ (ex: *Rovo AI* sau *Atlassian Intelligence*). Un QA modern folosește aceste unelte pentru a câștiga timp:

* **Generare de rezumate:** Un Epic are zeci de comentarii tehnice? Apasă butonul de *Summarize* al AI-ului, iar acesta îți va oferi în 3 paragrafe contextul necesar pentru a ști ce ai de testat.  
* **Asistență la redactare:** Când scrii un Bug Report, îi poți cere asistentului să-ți reformuleze pașii pentru a fi mai clari, mai politicoși și mai profesioniști.  
* *Atenție:* AI-ul nu testează în locul tău. Gândirea critică și vânătoarea de scenarii "edge-case" rămân responsabilitatea ta exclusivă.

### **🕵️ Activitate Practică de Final: „Configurarea Centrului de Comandă”**

Pentru a consolida noțiunile din această sesiune, accesează spațiul (Space-ul) Jira proaspăt creat și execută următoarele sarcini:

* **Vânătorul de Tichete:**  
  Navighează la *Filters* ➡️ *Advanced issue search*, comută pe modul JQL și scrie o interogare care să îți returneze **doar** tichetele de tip Story. Salvează filtrul cu numele „Toate Story-urile”.  
* **Managerul de Calitate:**  
  Creează un *Dashboard* cu numele „QA Metrics”. Adaugă în el un gadget de tip **Pie Chart** și configurează-l să folosească filtrul salvat la pasul anterior, grupând rezultatele după *Status*.  
* **Explorator în Zephyr:**  
  Mergi în modulul Zephyr Scale și generează o **Traceability Matrix** (Matrice de Trasabilitate). Analizează raportul: care sunt tichetele care nu au niciun caz de test asociat? Acolo este riscul tău cel mai mare\!

|  💡 Mesaj de la echipa QualiAdept: Cunoașterea platformei Jira te transformă dintr-un simplu executant într-un strateg. Acum nu doar că știi să testezi, dar știi cum să îți dovedești munca și să gestionezi întregul flux tehnologic\! |
| :---- |

## Resurse
[Descarcă varianta PDF a sesiunii 4](/pdfs/sessions/masterclass-qa-manual/session-4.pdf)

[image1]: /images/sessions/masterclass-qa-manual/session-4/image1.png

[image2]: /images/sessions/masterclass-qa-manual/session-4/image2.png

[image3]: /images/sessions/masterclass-qa-manual/session-4/image3.png

[image4]: /images/sessions/masterclass-qa-manual/session-4/image4.png

[image5]: /images/sessions/masterclass-qa-manual/session-4/image5.png

[image6]: /images/sessions/masterclass-qa-manual/session-4/image6.png

[image7]: /images/sessions/masterclass-qa-manual/session-4/image7.png

[image8]: /images/sessions/masterclass-qa-manual/session-4/image8.png

[image9]: /images/sessions/masterclass-qa-manual/session-4/image9.png

[image10]: /images/sessions/masterclass-qa-manual/session-4/image10.png

[image11]: /images/sessions/masterclass-qa-manual/session-4/image11.png

[image12]: /images/sessions/masterclass-qa-manual/session-4/image12.png

[image13]: /images/sessions/masterclass-qa-manual/session-4/image13.png

[image14]: /images/sessions/masterclass-qa-manual/session-4/image14.png

[image15]: /images/sessions/masterclass-qa-manual/session-4/image15.png
