# **Sesiunea 1: Introducere în n8n și Automatizarea Proceselor**

## **Capitolul 1: Ce este n8n și de ce revoluționează integrarea AI?**

| 📝 În acest capitol învățăm bazele automatizării vizuale low-code. n8n nu este doar un instrument de conectare a două aplicații, ci un mediu de execuție puternic care ne permite să orchestrăm fluxuri de date complexe și să integrăm inteligența artificială direct în procesele zilnice ale unei companii. |
| :---- |

### **1. Nevoia de Automatizare în Era AI**

În orice organizație modernă, angajații petrec ore întregi mutând date dintr-o aplicație în alta: copierea detaliilor dintr-un email într-un CRM, descărcarea facturilor și încărcarea lor în Google Drive sau trimiterea de notificări pe Slack. 

Când adăugăm inteligența artificială (LLM-uri precum GPT-4) în ecuație, automatizarea devine autonomă. AI are nevoie de "mâini și picioare" pentru a interacționa cu lumea reală (să citească documente, să caute pe web, să trimită mesaje). Aici intervine n8n.

### **2. Ce este n8n?**

**n8n** este un instrument de automatizare a fluxurilor de lucru extensibil și bazat pe noduri (node-based). Spre deosebire de alte platforme proprietare, n8n oferă un model de tip *fair-code*, permițând auto-găzduirea (self-hosting) gratuită și oferind flexibilitate maximă în manipularea datelor.

* **Noduri (Nodes):** Blocurile de bază din n8n. Fiecare nod efectuează o acțiune specifică (ex: trimitere email, interogare bază de date, apelare API OpenAI).
* **Conexiuni (Connections):** Liniile care unesc nodurile și definesc direcția în care curg datele (Data Flow).
* **Triggers:** Noduri speciale care pornesc execuția unui workflow (ex: primirea unui email nou, un webhook apelat, sau un interval de timp programat).
* **Execuții (Executions):** Istoricul rulărilor, unde putem inspecta datele de intrare și ieșire pentru fiecare nod în parte.

---

## **Capitolul 2: n8n vs. Zapier vs. Make**

Când alegem un instrument pentru proiectele noastre, trebuie să înțelegem avantajele și limitele fiecăruia:

| Caracteristică | **n8n** | **Zapier** | **Make (Integromat)** |
| :--- | :--- | :--- | :--- |
| **Găzduire** | Self-hosted (Gratuit) sau Cloud | Exclusiv Cloud | Exclusiv Cloud |
| **Securitatea Datelor** | Excelentă (datele rămân pe serverul tău) | Medie (tranzitează servere terțe) | Medie (tranzitează servere terțe) |
| **Manipulare Date** | Suport nativ JavaScript & JSON complet | Limitat sau necesită noduri plătite de cod | Funcții proprii, uneori greoaie |
| **Integrare AI** | Noduri native avansate (LangChain încorporat) | De bază (doar apeluri simple) | Medie (necesită construirea manuală a logicii) |
| **Cost** | Extrem de mic (sau gratuit self-hosted) | Ridicat pe măsură ce crește volumul | Moderat spre ridicat |

---

## **Capitolul 3: Practică - Primul tău Workflow în n8n**

### **Obiectivul Exercițiului**
Construirea unui flux care monitorizează primirea unui nou lead (printr-un formular Webhook) și trimite automat o notificare structurată pe email și pe Slack.

1. **Adăugarea nodului Webhook:** Acesta va fi punctul de pornire (Trigger).
2. **Adăugarea unui nod Code (JavaScript):** Pentru a curăța numele utilizatorului (ex. transformarea în Title Case).
3. **Adăugarea nodului Email / Slack:** Pentru a trimite alerta finală.

```javascript
// Exemplu cod de transformare nume în nodul Code
for (const item of $input.all()) {
  if (item.json.name) {
    item.json.formattedName = item.json.name.trim()
      .replace(/\b\w/g, c => c.toUpperCase());
  }
}
return $input.all();
```

---

## **Provocarea Sesiunii 1**
Instalează n8n local (folosind npm sau Docker) și configurează un workflow care trimite cursul valutar al zilei (preluat dintr-un API public) pe emailul tău personal în fiecare dimineață la ora 9:00.
