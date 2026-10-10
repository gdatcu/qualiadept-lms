# Sesiunea 3: Universul Binar și Porțile Logice

<div style="display: flex; gap: 12px; flex-wrap: wrap; margin: 1.5rem 0 0.5rem 0;">
  <a href="/pdfs/sessions/it-made-easy/session-3.pdf" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>Vizualizează suportul de curs (PDF)</a>
</div>

---

## Capitolul 1: Sistemul Binar și Hexazecimal — Cum numără mașinile 🔢

::: info 🧠 Perspectivă
Am lăsat în urmă siliciul și condensatorii. Știm că la nivel fizic, un computer are doar miliarde de tranzistori care pot fi închiși sau deschiși (Curent / Fără curent). Dar cum se transformă această rețea imensă de întrerupătoare într-un text, o imagine sau un joc video? Răspunsul stă în cel mai simplu, dar puternic limbaj din univers: Sistemul Binar.
:::

### 1.1 De ce folosesc mașinile Sistemul Binar? (Baza 2)

Noi, oamenii, folosim Sistemul Zecimal (Baza 10) cu zece cifre (0-9). De ce? Probabil pentru că am evoluat având 10 degete la mâini.

Un computer, în schimb, are doar „două degete”: tranzistorul PORNIT (trece curentul) sau OPRIT (nu trece curentul).

* **Binar (Baza 2):** Are doar două „cifre” posibile: **0** și **1**.
* Fiecare 0 sau 1 se numește **Bit** (de la *Binary Digit*). Acesta este atomul informației. Nu există o unitate mai mică de date.
* **Byte-ul (Octetul):** Pentru că un singur bit nu poate exprima mare lucru, computerele le grupează mereu câte 8. Un grup de 8 biți se numește Byte (sau Octet).

### 1.2 Cum numărăm în Binar? (Valoarea poziției)

În sistemul nostru cu baza 10, fiecare poziție a unui număr este o putere a lui 10 (Unități, Zeci, Sute, Mii). Exemplu: numărul 105 înseamnă 1 Sută + 0 Zeci + 5 Unități.

În sistemul binar (baza 2), pozițiile se dublează de la dreapta la stânga: 1, 2, 4, 8, 16, 32, 64, 128.

* Dacă pe o poziție avem **1**, adunăm acea valoare.
* Dacă avem **0**, o ignorăm.

![Conversie binar în zecimal](/images/sessions/it-made-easy/session-3/image1.png)
<span class="image-caption">**Fig. 1** — Această diagramă ilustrează modul în care numărul binar **01001001** este convertit în numărul zecimal **73** folosind valorile poziționale pe 8 biți (1 octet):</span>

* **Valorile Poziționale:** Fiecare bit dintr-un octet are o valoare zecimală specifică (de la stânga la dreapta: 128, 64, 32, 16, 8, 4, 2, 1).
* **Starea Bitului:** Biții pot fi activați (**1 — Aprins**, evidențiați cu fundal portocaliu) sau dezactivați (**0 — Stins**).
* **Procesul de Calcul:** Se iau în considerare doar valorile poziționale corespunzătoare biților care au valoarea 1. În acest caz, adunăm valorile pentru pozițiile activate: **64 + 8 + 1 = 73**.
* **Rezultatul Final:** Suma acestor valori oferă echivalentul zecimal, adică **73**.

### 1.3 Hexazecimal (Baza 16) — Prietenul Programatorului

Să scrii numere mari în binar este un coșmar pentru ochiul uman. De exemplu, un banal cod de culoare albastru deschis este `01100100 10010101 11101101`. Este greu de citit și ușor de greșit.

Pentru a simplifica lucrurile, informaticienii au inventat o „scurtătură”: Sistemul **Hexazecimal**.

* **Ce este?** Este un sistem cu baza 16. Folosește cifrele de la **0 la 9**, iar pentru valorile de la 10 la 15 împrumută primele 6 litere din alfabet: **A, B, C, D, E, F** *(A=10, B=11, C=12, D=13, E=14, F=15)*.
* **Superputerea Hexazecimalului:** Exact 4 biți de informație pot fi comprimați într-un singur caracter hexazecimal. Un Byte întreg (8 biți) se scrie mereu folosind doar **două** caractere Hex (ex: `11111111` în binar = `FF` în hexazecimal).

![Conversie binar în hexazecimal](/images/sessions/it-made-easy/session-3/image2.png)
<span class="image-caption">**Fig. 2** — Această diagramă ilustrează procesul de comprimare și conversie a unui număr binar de 8 biți (**11011010**) în sistemul hexazecimal (**DA**):</span>

* **Segmentarea (Nibbles):** Numărul binar este împărțit de la dreapta la stânga în grupuri de câte 4 biți. Astfel, obținem **1101** (Grupul 1) și **1010** (Grupul 2).
* **Conversia Zecimală:** Fiecare grup este convertit individual în valoarea sa zecimală: 8 + 4 + 0 + 1 = 13 pentru primul grup și 8 + 0 + 2 + 0 = 10 pentru al doilea.
* **Transpunerea în Hexazecimal:** În sistemul hexazecimal, numerele de la 10 la 15 sunt reprezentate prin litere de la A la F. Prin urmare, zecimalul **13** devine **D**, iar zecimalul **10** devine **A**.
* **Rezultatul Final:** Prin alăturarea celor două caractere obținem codul hexazecimal final: **DA**.

::: tip 💡 Analogia QualiAdept: Tabloul cu 8 întrerupătoare (Byte-ul)
Imaginează-ți că în fața ta ai un tablou cu 8 întrerupătoare (becuri). Fiecare bec are un număr scris deasupra lui: 1, 2, 4, 8, 16, 32, 64, 128. Regula jocului este simplă: poți crea absolut orice număr de la 0 la 255 aprinzând combinația corectă de becuri și adunând numerele lor.

Vrei să reprezinți numărul 0? Toate becurile sunt stinse (`00000000`). Vrei numărul 3? Aprinzi becul „2” și becul „1” (`00000011`). Vrei numărul maxim, 255? Aprinzi toate becurile (`11111111`). Aceasta este limita absolută a unui singur Byte!
:::

::: warning 🕵️ Ochiul de Tester: Boundary Value Analysis și „Numerele Magice”
Pentru un Software Tester, înțelegerea limitelor binare este esențială. Bug-urile se ascund adesea la granițele memoriei.

* **„Numerele Magice” din IT:** Ca tester, vei vedea des anumite numere care cauzează erori în aplicații: **255** (limita unui byte), **65.535** (limita a doi bytes), **2.147.483.647** (limita a patru bytes / 32-bit integer).
* **Aplicație practică (BVA):** Dacă testezi un câmp dintr-un formular unde utilizatorul trebuie să introducă vârsta, un tester educat nu va testa doar valorile 18 și 99. Va testa neapărat **255** și **256**. De ce? Pentru că dacă programatorul a alocat un singur Byte în baza de date pentru vârstă, introducerea numărului 256 va provoca o eroare de tip *Integer Overflow* (aplicația se va reseta la 0, făcând utilizatorul un „nou-născut”).
:::

::: info 🧪 Exercițiu de reflexie
Uită-te la routerul tău de internet sau la setările telefonului tău. Vei vedea ceva numit **Adresa MAC** (ex: `00:1A:2B:3C:4D:5E`).

De asemenea, dacă folosești un program de grafică (Paint, Photoshop), vei vedea că albul perfect are codul de culoare `#FFFFFF`.

*Ce sistem de numerație folosesc ambele exemple de mai sus? De ce crezi că industria a ales acest format în locul zecimalului obișnuit sau al binarului uriaș?*
:::

---

## Capitolul 2: Reprezentarea Textului — De la ASCII la Unicode și Emoji-uri 📝

::: info 🧠 Perspectivă
Știm că la nivel fundamental, un procesor înțelege doar zerouri și de unari. El nu știe ce este o literă, un cuvânt sau o propoziție. Prin urmare, pentru a procesa text, primii informaticieni au trebuit să inventeze un sistem universal de traducere: un dicționar uriaș în care fiecare literă din alfabet este asociată cu un număr unic.
:::

### 2.1 ASCII — Standardul American (Alfabetul pe 7 biți)

În anii '60, computerele aveau nevoie de un limbaj comun pentru a face schimb de texte. Așa a apărut **ASCII** (*American Standard Code for Information Interchange*).

* **Cum funcționează:** Folosește exact **7 biți** pentru fiecare caracter. Deoarece 2<sup>7</sup> = 128, tabelul ASCII conține exact 128 de poziții unice (de la 0 la 127).
* **Ce conține?** Alfabetul englezesc (litere mari și mici), cifrele de la 0 la 9, semnele de punctuație de bază (virgulă, punct, spațiu) și câteva comenzi invizibile de control (cum ar fi „Enter” / New Line).
* **Exemplu:** Când apeși litera **„A”** pe tastatură, computerul nu vede o literă. El caută în tabelul ASCII, vede că litera „A” corespunde numărului **65**, și o salvează în memorie sub forma octetului binar `01000001`.

![Traducerea unei taste în cod ASCII și memorie](/images/sessions/it-made-easy/session-3/image3.png)
<span class="image-caption">**Fig. 3** — Această diagramă explică modul în care calculatorul traduce o acțiune fizică (apăsarea unei taste) în date codificate pe care procesorul și memoria RAM le pot înțelege, folosind standardul **ASCII**:</span>

* **Evenimentul de Intrare:** Utilizatorul apasă tasta **A** (majusculă) pe tastatură. Controlerul tastaturii trimite un semnal către sistem.
* **Căutarea în Tabelul ASCII:** Sistemul de operare traduce acest semnal folosind tabelul standard ASCII, unde fiecărui caracter îi corespunde un număr unic. Pentru caracterul A, valoarea zecimală asociată este **65**.
* **Stocarea în Memorie:** Deoarece circuitele electronice funcționează doar cu stări de tip „pornit/oprit”, numărul zecimal 65 este convertit instantaneu în cod binar pe 8 biți (1 octet): **`01000001`**, formă sub care este salvat în memoria RAM.

### 2.2 Problema Globalizării și „Turnul Babel”

ASCII a fost perfect pentru limba engleză. Dar ce facem cu francezii care aveau nevoie de `é`, cu românii care aveau nevoie de `ș` și `ț`, sau cu rușii care foloseau alfabetul chirilic? Aceștia nu încăpeau în cele 128 de spații ASCII.

* **Code Pages (Paginile de Cod):** Pentru a rezolva problema, s-a folosit și al 8-lea bit din Byte (crescând spațiile la 256). Primele 128 au rămas ASCII standard, dar următoarele 128 au fost personalizate în funcție de țară.
* **Haosul:** Un document rusesc deschis pe un computer francez arăta ca niște hieroglife indescifrabile, pentru că poziția 150 însemna o literă chirilică în Rusia, dar o literă cu accent în Franța. Internetul era plin de texte stricate.

### 2.3 Unicode și UTF-8 — Soluția Supremă

Pentru a opri acest război digital, la sfârșitul anilor '80 s-a creat consorțiul **Unicode**.

* **Misiunea Unicode:** Un singur tabel universal care să ofere un cod unic pentru fiecare caracter scris vreodată de omenire (alfabete latine, chirilice, chinezești, hieroglife egiptene, simboluri matematice și chiar **Emoji-uri**). Unicode are peste 1.1 milioane de poziții!
* **UTF-8 (Formatul de Aur):** Este modul inteligent prin care salvăm caracterele Unicode pe disc:
  * Dacă scrii un caracter din engleză (ASCII), UTF-8 folosește doar **1 Byte**.
  * Dacă scrii o literă cu diacritice românești (ex: `ș`), folosește **2 Bytes**.
  * Dacă scrii un caracter chinezesc, folosește **3 Bytes**.
  * Dacă pui un Emoji (ex: 🚀 sau 🔥), folosește **4 Bytes**.

![Comparație ASCII vs UTF-8](/images/sessions/it-made-easy/session-3/image4.png)
<span class="image-caption">**Fig. 4** — Diferența arhitecturală dintre spațiul limitat al standardului ASCII pe 7 biți și universul extensibil UTF-8, capabil să encodeze diacritice, alfabete globale și emoji-uri pe 1 până la 4 octeți.</span>

::: tip 💡 Analogia QualiAdept: „Meniul Restaurantului Global”
Imaginează-ți ASCII ca pe un meniu cu doar 128 de feluri de mâncare americane (burger, cartofi, cola). Când au venit clienți din Italia, România sau Japonia, patronul a încercat să lipească abțibilduri peste pagini (Code Pages), dar chelnerii încurcau comenzile (un român cerea sarmale și primea sushi).

Unicode a venit și a creat un catalog uriaș de 1 milion de pagini, unde fiecare fel de mâncare din fiecare cultură a primit codul lui garantat. Iar **UTF-8** este chelnerul inteligent: dacă ceri apă, folosește un bilet mic de 1 byte; dacă ceri un fel tradițional exotic sau un emoji, folosește un bilet mai mare de 3-4 bytes.
:::

::: warning 🕵️ Ochiul de Tester: Mojibake și Limitele de Caractere
Codarea textului este o mină de aur pentru bug-uri și terenul de joacă preferat al unui Software Tester:

* **Dezastrul „Mojibake”:** Când vezi pe un site cuvinte precum `MĂ¢ncare` în loc de `Mâncare` sau semne de întrebare ``, ai prins un bug clasic de codare: baza de date trimite date în UTF-8, dar browserul încearcă să le citească folosind un charset vechi precum ISO-8859-1 (sau invers).
* **Testul cu Emoji-uri:** Un tester de top testează mereu formularele de înregistrare introducând emoji-uri (ex: 🚀, 💻, 🦄) sau diacritice rare în câmpul de nume. De ce? Un caracter normal are 1 octet, dar un emoji are 4 octeți! Dacă baza de date nu este configurată pe `utf8mb4` în loc de `utf8` simplu, aplicația va arunca o eroare 500 sau va tăia textul utilizatorului.
* **Limita de caractere:** Dacă un câmp acceptă „10 caractere”, asigură-te că testezi dacă dezvoltatorul a numărat caractere sau bytes! 10 litere englezești au 10 bytes, dar 10 emoji-uri au 40 de bytes.
:::

::: info 🧪 Exercițiu de reflexie
Copiază acest caracter special: `ș` și acest emoji: `🔥`. Câți bytes ocupă fiecare dintre ele dacă le salvăm într-un fișier text cu codificare UTF-8? De ce nu ocupă ambele doar 1 byte ca litera „a”?
:::

---

## Capitolul 3: Reprezentarea Imaginilor și Sunetului (Pixeli, Culori, Eșantionare) 🎨🎵

::: info 🧠 Perspectivă
Textul este format din simboluri discrete, dar lumea reală este continuă și analogică: un apus de soare conține o infinitate de nuanțe, iar o chitară generează o undă sonoră lină. Cum reușește o mașină care știe doar 0 și 1 să redea un film 4K sau o piesă pe Spotify? Printr-un proces numit digitalizare.
:::

### 3.1 Reprezentarea Imaginilor — Lumea redusă la puncte (Pixeli)

Dacă mărești foarte mult o fotografie pe ecran, vei observa că imaginea începe să se „rupă” în mici pătrățele colorate. Acestea se numesc **Pixeli** (*Picture Elements*).

* **Ce este un Bitmap (Raster)?** Este o hartă de biți. Imaginea este împărțită într-o grilă rectangulară (linii și coloane).
* **Cea mai simplă imagine (Alb-Negru pur):** Fiecare pixel are nevoie de un singur bit:
  * **0** = Negru (Stins)
  * **1** = Alb (Aprins)
* Dacă avem o imagine mică de 8 × 8 pixeli, ea poate fi stocată în exact 64 de biți (8 Bytes de memorie).

![Grila de pixeli și reprezentarea imaginilor](/images/sessions/it-made-easy/session-3/image5.png)
<span class="image-caption">**Fig. 5** — Structura unei imagini digitale de tip Bitmap (hartă de biți): divizarea imaginii într-o matrice rectangulară de pixeli, unde fiecare punct primește o valoare binară corespunzătoare stării sau culorii sale.</span>

### 3.2 Cum dăm culoare unui Pixel? (Modelul RGB)

Pentru a trece de la alb-negru la o imagine color realistă, folosim **Modelul RGB** (*Red, Green, Blue*).

Orice culoare pe care o vezi pe monitorul tău este creată prin combinarea luminii roșii, verzi și albastre la intensități diferite.

* **Adâncimea de culoare (Color Depth — 24 biți / TrueColor):**
  * Fiecare pixel conține 3 sub-pixeli minusculi (unul roșu, unul verde, unul albastru).
  * Fiecărei culori i se alocă exact **1 Byte (8 biți)** de informație.
  * Deoarece 8 biți pot reprezenta valori de la 0 la 255, avem 256 de niveluri de intensitate pentru Roșu, 256 pentru Verde și 256 pentru Albastru.
* **Matematica Culorilor:** Dacă înmulțim intensitățile (256 × 256 × 256 = 16.777.216 culori), descoperim că modelul standard RGB poate genera **peste 16,7 milioane de culori diferite**!
* **Exemple în Hexazecimal:**
  * `#000000` = Toate luminile stinse = **Negru pur**
  * `#FFFFFF` = Toate luminile la maxim (255, 255, 255) = **Alb pur**
  * `#FF0000` = Roșu maxim, fără verde, fără albastru = **Roșu pur**

![Amestecul culorilor în modelul RGB](/images/sessions/it-made-easy/session-3/image6.png)
<span class="image-caption">**Fig. 6** — Modelul aditiv de culoare RGB (Red, Green, Blue): intensitatea fiecărui canal este controlată pe un interval de la 0 la 255 (1 octet), generând prin combinare peste 16.7 milioane de culori distincte.</span>

### 3.3 Reprezentarea Sunetului — „Felierea” timpului (Eșantionarea)

Sunetul din natură este o undă de presiune continuă (analogică) care călătorește prin aer. Un computer nu poate stoca o curbă infinită și continuă, așa că trebuie să o „măsoare” la intervale regulate de timp. Acest proces se numește **Eșantionare** (*Sampling*), realizat de un cip numit **ADC** (*Analog-to-Digital Converter*).

1. **Rata de Eșantionare (Sample Rate):** Cât de des măsurăm sunetul pe secundă.
   * *Standardul CD Audio:* **44.100 Hz** (adică sunetul este măsurat de 44.100 de ori în fiecare secundă!).
2. **Adâncimea de Biți (Bit Depth):** Cu câtă precizie măsurăm înălțimea undei la fiecare moment.
   * *Standardul CD:* **16 biți** (adică 65.536 (2<sup>16</sup>) de niveluri posibile de volum pentru fiecare eșantion).

![Eșantionarea sunetului analogic în digital](/images/sessions/it-made-easy/session-3/image7.png)
<span class="image-caption">**Fig. 7** — Conversia unei unde sonore analogice continue în semnal digital prin eșantionare temporală (Sample Rate, ex: 44.1 kHz) și cuantizare a amplitudinii (Bit Depth, ex: 16 biți).</span>

::: tip 💡 Analogia QualiAdept: „Peisajul prin plasa de țânțari”
Imaginează-ți că privești un peisaj de munte printr-o plasă de țânțari de la fereastră. Fiecare mic pătrățel din plasă este un pixel. Dacă plasa are ochiuri foarte mari și rare, vei vedea doar niște blocuri mari de culoare și nu vei distinge detaliile (rezoluție mică).

Dacă plasa are milioane de ochiuri microscopice, creierul tău nu va mai distinge grila și va percepe o imagine continuă, perfect clară (ecranele moderne Retina sau 4K).
:::

::: warning 🕵️ Ochiul de Tester: Artefactele Digitale (Compresia)
Pentru un QA, fișierele media necomprimate reprezintă o provocare masivă de performanță și stocare:

* **Volumul brut de date:** O imagine needitată 4K are 3840 × 2160 pixeli × 3 bytes per pixel = aproximativ **25 MB per poză**! O secundă de video 4K la 60 cadre/secundă ar ocupa 1.5 GB!
* **Compresia Lossless vs. Lossy:** De aceea folosim formate comprimate. În testare, trebuie să validezi comportamentul aplicației la upload:
  * Formate fără pierderi (*Lossless* — PNG, FLAC): imaginea se decomprimă exact bit cu bit.
  * Formate cu pierderi (*Lossy* — JPEG, MP3): algoritmul elimină detaliile imperceptibile ochiului uman pentru a reduce dimensiunea de 10-20 de ori.
* **Bug-uri frecvente de upload:** Testerul trebuie să verifice dacă backend-ul re-comprimă excesiv pozele de profil (generând blur și artefacte urâte de blocuri de pixeli) sau dacă uploadul unui fișier necomprimat de mari dimensiuni blochează serverul (*Out of Memory*).
:::

::: info 🧪 Exercițiu de reflexie
De ce crezi că la un apel video pe WhatsApp sau Zoom, dacă conexiunea ta la internet slăbește brusc, fața interlocutorului se transformă instantaneu în pătrățele mari (pixelare)? Ce sacrifică algoritmul pentru a menține apelul în viață?
:::

---

## Capitolul 4: Porțile Logice de Bază (AND, OR, NOT, NAND, NOR, XOR) 🧠⚡

::: info 🧠 Perspectivă
Până acum am văzut cum numerele, literele, pozele și sunetele sunt codificate în biți (0 și 1). Dar computerele nu sunt simple sertare pasive de stocare; ele procesează, calculează și iau decizii. Cum ia o mașină o decizie logică? Răspunsul este: prin circuite electronice numite Porți Logice.
:::

### 4.1 Tranzistorul ca întrerupător digital

Orice poartă logică este construită fizic din tranzistori conectați inteligent:

![Tranzistorul ca întrerupător digital](/images/sessions/it-made-easy/session-3/image8.png)
<span class="image-caption">**Fig. 8** — Arhitectura fizică a tranzistorului ca întrerupător digital: tensiunea aplicată pe poartă (Gate) controlează fluxul de curent între sursă (Source) și drenă (Drain), definind stările logice 0 și 1.</span>

### 4.2 Ce este un Tabel de Adevăr (Truth Table)?

Un **Tabel de Adevăr** este o schemă matematică simplă care arată cum va reacționa o poartă logică la toate combinațiile posibile de semnale de intrare (Input) pentru a produce un semnal de ieșire (Output).

Dacă avem 2 intrări (**A** și **B**), există doar 4 combinații posibile: `(0,0)`, `(0,1)`, `(1,0)` și `(1,1)`.

### 4.3 Porțile Fundamentale (NOT, AND, OR)

1. **Poarta NOT (Invertorul — „Gică Contra”):**
   * Are o singură intrare și o singură ieșire.
   * Regula: Inversează semnalul. Dacă bagi 1, scoate 0. Dacă bagi 0, scoate 1.
2. **Poarta AND (ȘI — „Pretențiosul”):**
   * Are două sau mai multe intrări și o ieșire.
   * Regula: Scoate **1** DOAR DACĂ toate intrările sunt **1**. Dacă măcar o intrare este 0, ieșirea devine 0.
3. **Poarta OR (SAU — „Generosul”):**
   * Are două sau mai multe intrări și o ieșire.
   * Regula: Scoate **1** dacă măcar una dintre intrări este **1**. Scoate 0 doar când toate intrările sunt 0.

### 4.4 Porțile Derivate și „Universale” (NAND, NOR)

Dacă pui un invertor NOT la ieșirea unei porți AND sau OR, obții versiunile lor negate:

1. **Poarta NAND (NOT-AND):** Funcționează exact invers față de AND. Scoate 0 DOAR când ambele intrări sunt 1. În rest, scoate mereu 1.
2. **Poarta NOR (NOT-OR):** Funcționează exact invers față de OR. Scoate 1 DOAR când ambele intrări sunt 0.

> 💡 **Fapt uluitor din inginerie:** Poarta NAND este considerată o „poartă universală”. Folosind exclusiv porți NAND legate în diverse combinații, poți construi absolut orice altă poartă logică, orice sumator și, în final, un întreg procesor modern! Memoria flash din telefonul tău se numește **NAND Flash** exact din acest motiv!

### 4.5 Poarta XOR (Exclusive OR) — Decizia Strictă

Aceasta este una dintre cele mai importante porți din informatică:

* **Regula:** Scoate **1** dacă intrările sunt **DIFERITE** între ele (adică una este 1 și cealaltă este 0). Dacă intrările sunt identice (`0,0` sau `1,1`), scoate **0**.

![Porțile logice fundamentale și tabelele de adevăr](/images/sessions/it-made-easy/session-3/image9.png)
<span class="image-caption">**Fig. 9** — Simbolurile standard IEEE și tabelele de adevăr complete pentru porțile logice: NOT (Invertor), AND (ȘI), OR (SAU), NAND, NOR, XOR (SAU Exclusiv) și XNOR.</span>

::: tip 💡 Analogia QualiAdept: „Sistemul de Securitate al Băncii”
Gândește-te la o cameră de tezaur a unei bănci:
* **Poarta AND:** Ușa se deschide DOAR DACĂ Directorul introduce cheia A **ȘI** Gardianul introduce cheia B. Dacă doar unul are cheia, tezaurul rămâne blocat.
* **Poarta OR:** Alarma sună DACĂ senzorul de mișcare detectează un intrus **SAU** dacă geamul a fost spart. E de ajuns ca o singură condiție să fie adevărată pentru ca alarma să sune.
* **Poarta NOT:** Lumina de veghe: dacă este ziuă (1), stinge lumina (0). Dacă se face noapte (0), aprinde lumina (1).
* **Poarta XOR:** Întrerupătoarele de scară: poți aprinde becul de jos sau de sus, dar dacă le schimbi pe ambele în aceeași poziție, becul se stinge.
:::

::: warning 🕵️ Ochiul de Tester: Tehnica Decision Table Testing (Tabelul de Decizie)
Fiecare poartă logică din hardware are un echivalent direct în logica software-ului (instrucțiunile `if`, `else`, `&&`, `||`, `!`).

În metodologia internațională de testare **ISTQB**, una dintre cele mai puternice tehnici de test design este **Decision Table Testing**:
* Când o funcționalitate depinde de mai multe condiții combinate (ex: un utilizator primește reducere DACĂ are peste 60 de ani ȘI este membru VIP SAU are un cod promoțional valid), testerul construiește un Tabel de Adevăr complet cu toate combinațiile posibile de True/False pentru intrări.
* Această tehnică garantează o acoperire de testare de 100%, eliminând riscul de a omite scenarii ascunse sau neclare din specificații.
:::

::: info 🧪 Exercițiu de reflexie
Un magazin online permite plata cu cardul dacă: (1) Cumpărătorul are fonduri suficiente pe card ȘI (2) Cardul nu este expirat ȘI (3) Codul 3D Secure este introdus corect. Ce poartă logică combinată guvernează această decizie? Ce se întâmplă dacă o singură condiție din cele trei este Falsă (0)?
:::

---

## Capitolul 5: Sumatoare și Circuite Logice — Cum se adună fizic 1 + 1 🧮

::: info 🧠 Perspectivă
Porțile logice singure sunt doar comutatoare inteligente. Dar miracolul calculatoarelor apare când le conectăm împreună: ieșirea unei porți devine intrarea alteia. Prin această asamblare, circuitele pot executa adunări, scăderi și pot memora stări. Iată cum se naște matematica într-o mașină!
:::

### 5.1 Cum adunăm în Binar? (Regulile de bază)

Să ne amintim cum adunăm două cifre binare:
* 0 + 0 = 0
* 0 + 1 = 1
* 1 + 0 = 1
* 1 + 1 = 10<sub>2</sub> (adică Suma este **0**, și avem un **Carry / Depășire de 1** pentru coloana următoare!).

Dacă privești atent aceste reguli:
* Rezultatul **Sumei** este exact comportamentul unei porți **XOR** (este 1 doar când cifrele sunt diferite)!
* Rezultatul **Carry-ului** (depășirii) este exact comportamentul unei porți **AND** (este 1 doar când ambele cifre sunt 1)!

### 5.2 Semi-Sumatorul (The Half-Adder)

Legând o poartă XOR și o poartă AND la aceleași două intrări (**A** și **B**), obținem cel mai simplu circuit capabil să facă matematică: **Half-Adder**.

* **Limitarea lui:** Poate aduna doar doi biți simpli. Nu are o intrare pentru a primi un „Carry” venit dintr-o adunare anterioară.

![Circuitul sumator binar (Half Adder și Full Adder)](/images/sessions/it-made-easy/session-3/image10.png)
<span class="image-caption">**Fig. 10** — Schema circuitului Half Adder (stânga: realizat cu o poartă XOR pentru calculul Sumei și o poartă AND pentru calculul Carry-ului de transfer) și a circuitului Full Adder (dreapta: capabil să adune doi biți de intrare A și B plus Carry-ul venit de la poziția anterioară).</span>

### 5.3 Sumatorul Complet (The Full-Adder) și Unitatea Aritmetico-Logică (ALU)

Pentru a aduna numere mari (pe 8, 16, 32 sau 64 de biți), inginerii au creat **Full-Adder**:

* Folosește două circuite Half-Adder și o poartă OR.
* Are **3 intrări**: Bitul **A**, Bitul **B** și **Carry In** (C<sub>in</sub> — depășirea venită de la coloana din dreapta).
* Legând 8 astfel de sumatoare cap la cap în lanț, obținem un **Sumator pe 8 biți**, inima unei Unități Aritmetico-Logice (**ALU**).

![Schema bloc a Unității Aritmetico-Logice (ALU)](/images/sessions/it-made-easy/session-3/image11.png)
<span class="image-caption">**Fig. 11** — Arhitectura unei Unități Aritmetico-Logice (ALU): primirea operanzilor (A, B), selectarea operației prin cod de control (Opcode) și generarea rezultatului cu flag-uri de stare (Zero, Carry, Overflow).</span>

::: tip 💡 Analogia QualiAdept: „Linia de Asamblare a Găleților”
Imaginează-ți o linie de pompieri care sting un incendiu transportând găleți cu apă:
* Fiecare pompier (Full Adder) primește o găleată de la stânga (Carry In), adaugă apa lui (intrările A și B), toarnă rezultatul în foc (Sum), iar dacă apa dă pe dinafară, pasează surplusul mai departe la următorul pompier (Carry Out).
* Fiecare sumator depinde de colegul dinaintea lui. Până când primul pompier nu a calculat carry-ul, următorul nu poate finaliza calculul!
:::

::: warning 🕵️ Ochiul de Tester: Întârzierea Propagării (Propagation Delay)
În fizică și electronică, semnalul electric nu se deplasează instantaneu (viteza luminii în siliciu este finită, iar porțile au nevoie de fracțiuni de nanosecundă pentru a comuta starea).

* **Efectul de Ripple:** Într-un sumator simplu pe 64 de biți (*Ripple-Carry Adder*), semnalul de depășire trebuie să parcurgă consecutiv toate cele 64 de etaje! Dacă ceasul procesorului (frecvența) ticăie mai repede decât timpul necesar semnalului să parcurgă lanțul, procesorul va citi o valoare incompletă, producând un calcul greșit.
* **Testarea de Timing:** De aceea, inginerii de validare hardware (Silicon QA) testează intens circuitele la frecvențe limită și temperaturi extreme, pentru a garanta că semnalele s-au stabilizat înainte de citirea rezultatului.
:::

::: info 🧪 Exercițiu de reflexie
Dacă un procesor are o arhitectură pe 32 de biți, câte circuite Full Adder sunt legate în lanț pentru a aduna două numere întregi obișnuite? Ce se întâmplă dacă ultimul sumator (cel mai din stânga) generează un Carry Out = 1?
:::

---

## Capitolul 6: Algebra Booleană — Matematica din spatele deciziilor digitale 🧮

::: info 🧠 Perspectivă
Înainte ca primul computer să fie construit, un matematician englez pe nume George Boole a inventat în secolul al XIX-lea o algebră revoluționară în care variabilele nu reprezentau numere infinite, ci doar două valori: Adevărat (1) și Fals (0). Un secol mai târziu, această algebră a devenit fundamentul teoretic pentru proiectarea oricărui procesor din lume.
:::

### 6.1 Ce este Algebra Booleană?

Dacă în algebra normală (cea pe care o învățăm la școală) lucrăm cu numere de la **-∞** la **+∞** și cu operații precum adunarea și înmulțirea, în **Algebra Booleană** regulile sunt mult mai simple:

* Variabilele pot avea doar două valori: **0 (Fals)** sau **1 (Adevărat)**.
* **Operația AND (ȘI):** Este scrisă ca o înmulțire: `A · B` (sau pur și simplu `AB`).
* **Operația OR (SAU):** Este scrisă ca o adunare: `A + B`.
* **Operația NOT (NEGARE):** Este scrisă cu o bară deasupra: <span style="text-decoration: overline; font-weight: bold;">A</span> (sau cu un apostrof: `A'`).

Deci, dacă un inginer vrea să spună „Alarma sună (Y) DACĂ senzorul de fum (A) este activ SAU dacă termostatul (B) este activ ȘI butonul de panică nu este oprit (<span style="text-decoration: overline;">C</span>)”, el scrie pur și simplu:

<div style="background: var(--vp-c-bg-soft); border-left: 4px solid var(--vp-c-brand-1); padding: 12px 16px; margin: 12px 0; border-radius: 6px; font-family: var(--vp-font-family-mono); font-size: 1.1rem; font-weight: 600;">
  Y = A + (B · <span style="text-decoration: overline;">C</span>) &nbsp;&nbsp;<span style="color: var(--vp-c-text-2); font-weight: 400; font-size: 0.95rem;">[sau: Y = A + (B · C')]</span>
</div>

### 6.2 Optimizarea și Simplificarea — Cum facem procesoare mai ieftine

De ce trebuie ca un inginer sau programator să știe această matematică? Pentru că circuitele costă bani și consumă energie. Dacă poți obține același rezultat logic folosind 2 tranzistori în loc de 10, ai creat un procesor mai mic, mai rece și mai ieftin!

Algebra booleană are o serie de reguli de aur care permit simplificarea:

* `A · 0 = 0` (Ceva AND Fals este mereu Fals — putem elimina poarta).
* `A + 1 = 1` (Ceva OR Adevărat este mereu Adevărat).
* `A + A = A` (Dacă avem două semnale identice pe un OR, putem păstra doar unul).
* `A · 1 = A` (Element neutru la AND).
* `A · A = A` (Idempotență).

![Circuit logic și simplificare booleană](/images/sessions/it-made-easy/session-3/image12.png)
<span class="image-caption">**Fig. 12** — Exemplu de schemă logică combinatorie și aplicarea teoremelor algebrei booleene pentru a reduce numărul de porți de la un circuit complex și scump la o formă minimizată, identică ca funcționalitate.</span>

### 6.3 Legile lui De Morgan — Magia Inversării

Augustus De Morgan a descoperit două reguli fundamentale care permit transformarea porților AND în porți OR și invers:

* **Legea 1:** <span style="text-decoration: overline; font-weight: bold;">A · B</span> = <span style="text-decoration: overline; font-weight: bold;">A</span> + <span style="text-decoration: overline; font-weight: bold;">B</span> &nbsp;*(sau: `(A · B)' = A' + B'`)* — Negația lui A ȘI B este egală cu negația lui A SAU negația lui B.
* **Legea 2:** <span style="text-decoration: overline; font-weight: bold;">A + B</span> = <span style="text-decoration: overline; font-weight: bold;">A</span> · <span style="text-decoration: overline; font-weight: bold;">B</span> &nbsp;*(sau: `(A + B)' = A' · B'`)* — Negația lui A SAU B este egală cu negația lui A ȘI negația lui B.

::: tip 💡 Analogia QualiAdept: „Regulamentul Clubului”
La ușa unui club exclusivist, managerul îi dă paznicului următoarele instrucțiuni:
*„Lași clientul să intre dacă (Are Invitație SAU Este pe Listă) ȘI NU Este În Stare de Ebrietate.”*

În notație booleană, formula de decizie este:

<div style="background: var(--vp-c-bg-soft); border-left: 4px solid var(--vp-c-brand-1); padding: 10px 14px; margin: 10px 0; border-radius: 6px; font-family: var(--vp-font-family-mono); font-weight: 600;">
  Y = (Invitație + PeListă) · <span style="text-decoration: overline;">Băut</span> &nbsp;&nbsp;<span style="color: var(--vp-c-text-2); font-weight: 400; font-size: 0.9rem;">[sau: Y = (Invitație + PeListă) · Băut']</span>
</div>

Dacă aplici legile booleene, poți reconfigura logica paznicului fără să schimbi rezultatul deciziei, optimizând timpul de verificare la intrare.
:::

::: warning 🕵️ Ochiul de Tester: Optimizarea Condițiilor de Cod
Un QA Engineer care stăpânește algebra booleană are o „superputere” atunci când face Code Review sau scrie teste White-Box:
* **Refactorizarea condițiilor complexe:** Adesea, dezvoltatorii scriu blocuri `if` kilometrice:
  ```js
  if (!isLoggedIn || !hasPermission) { ... }
  ```
  Aplicând De Morgan, poți rescrie echivalent și mult mai lizibil:
  ```js
  if (!(isLoggedIn && hasPermission)) { ... }
  ```
* **Short-circuit Evaluation:** În majoritatea limbajelor moderne (JavaScript, Python, C#), dacă într-o expresie `A && B`, condiția `A` este Falsă, motorul nici măcar nu mai evaluează `B` (pentru că rezultatul final este garantat Fals). Un tester inteligent folosește acest comportament pentru a preveni bug-uri de tip `NullPointerException` (ex: verificând `if (user != null && user.isActive)`).
:::

::: info 🧪 Exercițiu de reflexie
Simplifică următoarea expresie logică folosind regulile învățate:

<div style="background: var(--vp-c-bg-soft); border-left: 4px solid var(--vp-c-brand-1); padding: 10px 14px; margin: 10px 0; border-radius: 6px; font-family: var(--vp-font-family-mono); font-weight: 600;">
  Z = A · B + A · <span style="text-decoration: overline;">B</span> &nbsp;&nbsp;<span style="color: var(--vp-c-text-2); font-weight: 400; font-size: 0.9rem;">[sau: Z = A · B + A · B']</span>
</div>

Ce rezultat obții? De câte porți logice fizice ai nevoie pentru a implementa forma inițială față de forma finală simplificată?
:::

---

## Capitolul Bonus: Când matematica binară distruge lumea — Cele mai faimoase bug-uri din istorie 🐛

### 1. Explozia de 500 de milioane de dolari (Racheta Ariane 5 — 1996)

Pe 4 iunie 1996, racheta europeană Ariane 5 a fost lansată de la baza din Kourou. La doar 37 de secunde după decolare, racheta s-a dezintegrat într-o minge uriașă de foc, distrugând sateliți științifici de sute de milioane de dolari.

* **Cauza:** Un bug de tip **Integer Overflow** pe 16 biți! Sistemul de navigație încerca să convertească un număr cu virgulă mobilă pe 64 de biți (reprezentând viteza orizontală) într-un număr întreg cu semn pe 16 biți. Valoarea maximă a unui întreg pe 16 biți este **32.767**. Când viteza rachetei a depășit acest număr, procesorul a generat o excepție, computerul de bord s-a blocat, iar motoarele au fost ghidate eronat la un unghi extrem.

### 2. Sfârșitul universului Pac-Man (Nivelul 256 — 1980)

În jocul clasic arcade Pac-Man, programatorii au folosit un singur octet (8 biți) pentru a contoriza nivelul curent.

* **Cauza:** Un octet poate număra doar până la 2<sup>8</sup> - 1 = 255. Când un jucător de elită finaliza nivelul 255 și trecea la nivelul 256, contorul s-a dat peste cap (Overflow) și s-a resetat la 0!
* **Efectul:** Rutina de desenare a încercat să deseneze fructele folosind valoarea 0, corupând memoria video. Jumătatea dreaptă a ecranului s-a transformat într-un haos de simboluri indescifrabile (*Kill Screen*), făcând jocul imposibil de terminat.

### 3. Cum a stricat Gangnam Style YouTube-ul (2014)

În decembrie 2014, videoclipul muzical „Gangnam Style” al lui Psy a atins un număr record de vizualizări. Dintr-o dată, contorul de pe YouTube a început să afișeze numere negative ciudate!

* **Cauza:** Inginerii Google configuratoriseră contorul de vizualizări pe un număr întreg cu semn pe 32 de biți (*signed 32-bit integer*). Valoarea maximă posibilă era **2.147.483.647**. Niciun inginer nu și-a imaginat în 2005 că un clip va depăși vreodată 2 miliarde de vizualizări!
* **Remedierea:** Când contorul a atins limita, Google a trebuit să rescrie în regim de urgență baza de date pentru a trece contorul pe un întreg de 64 de biți (9 × 10<sup>18</sup> vizualizări), o valoare suficientă pentru următoarele milenii.

::: tip 💡 Analogia QualiAdept: „Odometrul mașinii”
Imaginează-ți odometrul mecanic al unei mașini vechi care are doar 5 cifre. După ce parcurgi 99.999 km, următoarea bornă kilometrică nu va arăta 100.000 (pentru că nu există spațiu fizic pentru a 6-a rotiță), ci se va da peste cap și va arăta `00.000` km! Mașina devine brusc nouă pe bord, deși e gata de casat. Acesta este principiul Integer Overflow în format mecanic.
:::

::: warning 🕵️ Ochiul de Tester: BVA (Boundary Value Analysis)
Toate aceste dezastre istorice puteau fi prevenite printr-un singur lucru: aplicarea riguroasă a tehnicii **Boundary Value Analysis (BVA)**.

* Când testezi un câmp numeric, cele mai valoroase teste nu sunt la mijlocul intervalului (ex: 50, 100), ci la limitele extreme:
  * 8 biți: `255`, `256`
  * 16 biți: `32.767`, `32.768`, `65.535`, `65.536`
  * 32 biți: `2.147.483.647`, `2.147.483.648`
* Fii mereu cel care introduce aceste „numere magice” în formulare, API-uri și baze de date înainte ca un utilizator real sau un atacator să o facă!
:::

::: info 🧪 Exercițiu de reflexie: Următorul Sfârșit al Lumii Digitale
Ai auzit de **Bug-ul Anului 2038** (Y2038)? Multe servere Linux măsoară timpul ca număr de secunde trecute de la 1 Ianuarie 1970 într-un întreg cu semn pe 32 de biți. Pe data de **19 Ianuarie 2038 la ora 03:14:07 UTC**, acest contor va atinge valoarea maximă `2.147.483.647`. Ce se va întâmpla în secunda următoare dacă sistemele nu sunt migrate la 64 de biți?
:::
