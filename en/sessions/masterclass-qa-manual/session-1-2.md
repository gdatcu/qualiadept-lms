# **Session 1.2: The 7 Principles of Testing (Individual Study)**

<a href="/pdfs/sessions/masterclass-qa-manual/session-1-2-en.pdf" class="download-btn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm0-10h4V4h6v6h4l-7 7-7-7z"/></svg>View the PDF version of Session 1.2</a>

|  🧠 This individual study module is essential both for developing the correct QA mindset and as a fundamental theoretical basis for certification. ISTQB Foundation Level Here we explore the golden rules of testing, clearly delineate roles in the industry, and understand why objectivity is the most valuable quality of a tester. |
| :---- |

## **Part 1: The 7 Principles of Testing (ISTQB Standard)**

These principles are not just theory; they are “warnings” written in blood (and over-budgeted) by previous generations of software engineers. They temper our expectations and guide our strategy.

### **1\. Testing demonstrates the presence of defects, not their absence**

* **Concept:** Testing can clearly prove that a software *has* bugs (when one crashes). But no matter how much you test, you can't mathematically prove that the software *it doesn't have any bugs*.  
* **Meaning:** Testing reduces the likelihood that defects will remain hidden, but even after months of testing, a system cannot be declared "100% bug-free."

### **2\. Exhaustive testing is impossible**

* **Concept:** Testing absolutely all combinations of input data, preconditions, and routes through the application is impossible (except for some trivial cases).  
* **The QualiAdept solution:** Instead of attempting the impossible, we use **risk analysis and prioritization.** We test more where the impact of a failure is greater.

### **3\. Early testing saves time and money (Early Testing)**

* **Concept:** Testing activities should start as early as possible in the software development life cycle (as early as the requirements phase \- *Static Testing*).  
* **Reason:** A logical defect found on paper costs 1 Euro to fix. The same defect, found after the code has been written, tested and released into production, can cost 10,000 Euros and image damage. This practice is also known as **„Shift Left”**.

### **4\. Defect Clustering**

* **Concept:** A small number of modules usually contain the majority of defects discovered in a system.  
* **Pareto's Law (80/20 Rule):** About 80% of bugs are found in 20% of the code. If you find a bug in a particular section of the application, pay close attention there, because you're likely to find others (bugs like to "stay in packs" because usually a problematic area was written by an inexperienced programmer or has very complicated logic).

### **5\. The Pesticide Paradox**

* **Concept:** If you run the exact same tests over and over again, at some point they won't find any new flaws. The system becomes "immune" to them.  
* **The solution:** Test cases need to be reviewed and updated periodically. We need to write new tests to cover new parts of the software, just as farmers need to change pesticides because insects are becoming resistant.

### **6\. Testing depends on the context**

* **Concept:** There is no "universal recipe" for testing.  
* **Example:** A banking application (where financial security is critical) is tested completely differently, with different rigors and regulations, compared to a mobile game or a website showcasing a flower shop.

### **7\. Error / Illusion of the absence of errors**

* **Concept:** It's no use finding and fixing 10,000 defects if the system we built is unusable, doesn't meet the client's business needs, or is inferior to the competition.  
* **Conclusion:** Quality does not just mean the absence of technical bugs, but also meeting the real need of the user.

## **Partea 2: QA (Quality Assurance) vs. QC (Quality Control)**

Very often, the terms are used interchangeably in the job market (e.g. you hire yourself as a "QA Tester"), but technically, they represent distinct things.

### **Quality Assurance (QA)**

* **Orientation:** On **Process**.  
* **Objective:** Preventing the introduction of defects.  
* **Activities:** Establishing processes, coding standards, choosing tools (e.g. Jira, TestRail), defining the methodology (Agile, Scrum). QA ensures that the way we work is correct.  
* *It is a proactive activity.*

### **Quality Control (QC)**

* **Orientation:** On **Product**.  
* **Objective:** Finding defects in the already built product before it reaches the customer.  
* **Activities:** Effective execution of tests, bug reporting, functionality validation.  
* *It is a reactive activity.*

| 💡 QualiAdept Analogy: “Cookie Factory” QA (Quality Assurance) is developing the perfect recipe, ensuring that the chefs wear gloves, that the best ingredients are used, and that the oven temperature is set correctly. We make sure that *the process* will produce a good cake. QC (Quality Control) It means that after the cake comes out of the oven, you taste it and check if it's burnt, if it's sweet enough, and if it looks good before you give it to the customer. This is where the actual testing takes place. |
| :---- |

## **Part 3: Levels of Independence in Testing**

Why is it not good for a programmer to test his own code? The answer lies in psychology: **Confirmation Bias** (confirmation bias). People are programmed to look for evidence to support their beliefs. A developer will run the code on “Happy Path” to demonstrate that *WORKING*, while an independent tester will try unusual routes to demonstrate that *it can break*.

According to ISTQB, independence is structured on several levels (from weakest to strongest):

* **Level 0 (No independence):** The code author (Developer) tests his own code.*Very low efficiency in finding logical errors.*  
* **Level 1:** Another developer from the same team tests the code (Peer Review). *Average efficiency, but both have the same technical mindset.*  
* **Level 2:** An independent testing (QA) team, but part of the same company and the same project.*This is the industry standard (the role you will be occupying).*  
* **Level 3 (Maximum Independence):** Testers from an external organization (consulting firms, auditors). They are not influenced by internal managerial pressures or affinities with colleagues.

### **Advantages and Disadvantages of Independence**

* **Advantages:** Independent testers notice flaws and defects in documentation that creators ignore out of habit or emotional involvement.  
* **Disadvantages (of extreme independence):** External or overly isolated testers may have a lack of knowledge about the specific business of the application, and communication with the development team may become difficult (the "us vs. them" phenomenon).

*Material designed for individual study **QualiAdept** Make sure you master the 7 principles, as they represent a significant percentage of the ISTQB certification exam questions.*

## Resources
[Download the PDF version of Session 1.2](/pdfs/sessions/masterclass-qa-manual/session-1-2-en.pdf)