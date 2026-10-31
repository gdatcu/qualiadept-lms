# **Linux pentru Testare: De la Linia de Comandă la CI/CD & Docker**

- 🐧 **Format:** Sesiuni Teoretice & Terminal Interactiv Live în Browser
- 🎯 **Nivel:** Începător / Intermediar (QA Manual, QA Automation, DevOps Starter)
- ⏱️ **Durată:** 6 Sesiuni Complete
- 💻 **Focus:** Practică pe scenarii reale de QA (analiză log-uri, procesare fișiere de test, Bash scripting)

---

## **🎯 Obiectivele Programului**

În ingineria calității software modernă, **peste 90% dintre serverele de backend, mediile de staging, containerele Docker și runnerii de CI/CD rulează pe Linux**. Un inginer QA care depinde exclusiv de o interfață grafică este grav limitat atunci când un microserviciu refuză să pornească sau când un test automată eșuează în pipeline.

Acest curs transformă linia de comandă Linux din „ecran negru intimidant” în **cel mai rapid instrument de diagnosticare, testare și automatizare**.

Fiecare sesiune integrează **terminalul virtual Linux direct în pagina de curs**, permițându-ți să execuți comenzi, să navighezi în sistemul de fișiere și să rezolvi provocări practice fără a fi nevoie să instalezi mașini virtuale sau subsisteme complexe.

---

## **📅 Structura Curriculei (Syllabus)**

### **Modulul 1: Fundamente Linux & Navigarea în Sistemul de Fișiere**

*2 Sesiuni | Orientare, Comenzi de Bază & Inspectarea Fișierelor*

> * **[Sesiunea 1: Primii Pași în Terminal & Navigarea în Sistemul de Fișiere](/ro/sessions/linux-for-testing/session-1.html)** <SessionBadge :challenges="['linux-s1-c1', 'linux-s1-c2']" lang="ro" />  
>   * De ce Linux în QA: arhitectura serverelor, mediile headless și containerele cloud.  
>   * Anatomia comenzilor Bash: comenzi, opțiuni/flag-uri (`-a`, `-l`, `-h`) și argumente.  
>   * Harta sistemului de fișiere Linux: de ce nu avem `C:\` și unde trăiesc datele (`/var/log`, `/etc`, `/home`, `/tmp`, `/app`).  
>   * Navigare și orientare: `pwd`, `cd`, căi absolute vs. căi relative, `~` și `..`.  
>   * Manipularea fișierelor și directoarelor: `ls`, `mkdir -p`, `touch`, `cp -r`, `mv`, `rm -rf`.  
>   * *Provocări în terminal:* Reorganizarea unui director de artifacte de test și crearea structurii de rapoarte.
>
> * **[Sesiunea 2: Inspectarea și Filtrarea Log-urilor de Server](/ro/sessions/linux-for-testing/session-2.html)** <SessionBadge :challenges="['linux-s2-c1', 'linux-s2-c2']" lang="ro" />  
>   * Log-urile — prima linie de apărare a testerului când un API sau UI dă eroare.  
>   * Vizualizarea conținutului: `cat`, `less`, `head` și `tail`.  
>   * Monitorizarea în timp real a log-urilor în timpul execuției testelor (`tail -f`).  
>   * Căutare rapidă de erori și excepții cu `grep` (opțiuni esențiale: `-i`, `-n`, `-c`, `-v`, `-E`).  
>   * *Provocări în terminal:* Extragerea tuturor erorilor HTTP 500 dintr-un log Nginx și numărarea incidentelor critice.

---

### **Modulul 2: Procesarea Datelor & Automatizare Text în QA**

*2 Sesiuni | Pipeline-uri, Redirecționări & Permisiuni*

> * **Sesiunea 3: Pipeline-uri (`|`), Redirecționări (`>`, `>>`) & Filtrare Avansată**  
>   * Filosofia Unix: programe mici care fac un singur lucru bine și comunică prin text.  
>   * Fluxurile standard: STDIN (0), STDOUT (1), STDERR (2).  
>   * Redirecționarea ieșirii (`>`, `>>`, `2>&1`) pentru salvarea rapoartelor de testare.  
>   * Înlănțuirea comenzilor prin conducte (Pipes `|`): combinarea `grep`, `sort`, `uniq -c` și `wc -l`.  
>   * Introducere în extragerea de coloane cu `cut` și `awk` pentru fișiere CSV/log-uri.  
>   * *Provocări în terminal:* Generarea automată a unui sumar cu utilizatorii unici afectați de erori dintr-un fișier de log.
>
> * **Sesiunea 4: Permisiuni, Utilizatori și Securitate (`chmod`, `chown`)**  
>   * Modelul de permisiuni Linux: User, Group, Others (`rwx`).  
>   * Notarea simbolică (`u+x`) vs. notarea octală (`755`, `644`, `600` pentru chei SSH).  
>   * De ce scriptul tău de test dă `Permission denied` și cum îl faci executabil (`chmod +x`).  
>   * Utilizatorul `root`, comanda `sudo` și bune practici de securitate în containere.  
>   * *Provocări în terminal:* Securizarea cheilor de acces și acordarea drepturilor de execuție pentru un script de testare.

---

### **Modulul 3: Procese, Rețea & Scripting Bash pentru CI/CD**

*2 Sesiuni | Diagnosticare de Sistem & Automatizare E2E*

> * **Sesiunea 5: Gestiunea Proceselor, Diagnosticare de Sistem & Rețea**  
>   * Identificarea serviciilor blocate: `ps aux`, `top` și filtrarea după nume cu `pgrep`.  
>   * Oprirea proceselor agățate: semnalele `kill -15` (graceful) vs. `kill -9` (force).  
>   * Verificarea porturilor ocupate și conexiunilor active (`netstat`, `ss`, `lsof -i :8080`).  
>   * Testarea endpoint-urilor direct din consolă cu `curl` (headers, coduri de status, payload JSON).  
>   * *Provocări în terminal:* Diagnosticarea unui backend care refuză conexiunile și eliberarea portului blocat.
>
> * **Sesiunea 6: Bash Scripting pentru QA & Integrare în CI/CD**  
>   * Structura unui script Bash: shebang (`#!/usr/bin/env bash`), variabile și parametri (`$1`, `$@`).  
>   * Coduri de ieșire (`exit 0` vs. `exit 1`): cum știe pipeline-ul de CI/CD dacă testele au trecut sau au picat.  
>   * Instrucțiuni condiționale (`if [ $? -eq 0 ]`) și bucle pentru rulări de teste repetitive.  
>   * Construirea unui script complet de pre-flight check care verifică dependințele și pornește suita de testare.  
>   * *Provocări în terminal:* Crearea unui script de verificare a stării serverului care trimite alertă dacă serviciul e picat.

