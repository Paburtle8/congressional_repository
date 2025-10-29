document.addEventListener("DOMContentLoaded", () => {


   const logBtn = document.getElementById("logBtn");
   const logDone = document.querySelector(".logDone");
   const logUserTB = document.querySelector("#logUserTB");
   const logPasswordTB = document.querySelector("#logPasswordTB");
   const plus = document.querySelector("#plus");
   const minus = document.querySelector("#minus");
   const enterBTN = document.getElementById("enterBTN");
   const aiText = document.querySelector(".aiText");
   const anchorSignUp = document.querySelector("#anchorSignUp");
   const welcomeDiv = document.querySelector(".welcomeDiv");

   const testButton = document.getElementById("testButton");





  


async function hashPassword(password){   


   const encoder = new TextEncoder();
   const data = encoder.encode(password);
   const hash = await crypto.subtle.digest('SHA-256',data);
   const hashArray= Array.from(new Uint8Array(hash));
   return hashArray.map(b=>b.toString(16).padStart(2,'0')).join('');




}






   function refresh() {
       welcomeDiv.textContent = "Get Started Now!";
       logDone.textContent="Sign up";
       anchorSignUp.textContent="Already have an account? Log in";
   }


   function goBack() {
       welcomeDiv.textContent = "Welcome Back!";
       logDone.textContent="Log in";
       anchorSignUp.textContent="Don't have an account? Sign up!";
   }
  
   if (anchorSignUp) {
       anchorSignUp.addEventListener("click", () => {
           if (anchorSignUp.textContent.includes("Already have an account? Log in")) {
               goBack();
           } else {
               refresh();
           }
       });
   }


   const savedConversation = localStorage.getItem("conversation") || "";
   if (aiText && savedConversation) {
       aiText.textContent = savedConversation;
       aiText.classList.add("show");
   }


   if (logBtn) {
       logBtn.addEventListener("click", () => {
           window.location.href = "login.html";
       });
   }


   async function logIn(username,password){
       const hashedPassword = await hashPassword(password);
       const searchRes = await fetch(`https://sheetdb.io/api/v1/tt8ri7vy2yyfe/search?Usernames=${username}`);
       const users = await searchRes.json();


       if(users.length){
           if (users[0].Passwords==hashedPassword){
               alert("Password Correct");
               return users[0].Conversation || "";    
           } else {
               alert("wrong password!");
               return null;
           }
       }
   }


   async function signUp(username,password){
       const hashed = await hashPassword(password);
       await fetch("https://sheetdb.io/api/v1/tt8ri7vy2yyfe", {
           method: "POST",
           headers: {"Content-type": "application/json"},
           body: JSON.stringify({data: [{Usernames: username, Passwords: hashed, Conversation: ""}] })
       });
       alert("Account created!");
       return "";
   }


   async function saveConversation(username, updatedConversation) {
       await fetch(`https://sheetdb.io/api/v1/tt8ri7vy2yyfe/Usernames/${username}`, {
           method: "PATCH",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ data: [{ Conversation: updatedConversation }] })
       });
   }
  
   if (logDone) {
       logDone.addEventListener("click", async () => {
           if (!logUserTB.value || !logPasswordTB.value) return alert("Please fill out all boxes");
  
           const searchRes = await fetch(`https://sheetdb.io/api/v1/tt8ri7vy2yyfe/search?Usernames=${logUserTB.value}`);
           const users = await searchRes.json();
  
           let conversation;
  
           if (users.length) {
               conversation = await logIn(logUserTB.value, logPasswordTB.value);
           } else {
               conversation = await signUp(logUserTB.value, logPasswordTB.value);
           }
  
           if (conversation !== null) {
               localStorage.setItem("conversation", conversation);
               localStorage.setItem("username", logUserTB.value);
  
               if (aiText) {
                   aiText.textContent = conversation;
                   aiText.classList.add("show");
               }
  
               window.location.href = "main.html";
           }
       });
   }


   if (plus) {
       plus.addEventListener("click", () => {
           const container = document.querySelector(".cgDiv");
           if (container) container.appendChild(document.createElement("input"));
       });
   }


   if (minus) {
       minus.addEventListener("click", () => {
           const container = document.querySelector(".cgDiv");
           if (container) {
               const lastInput = container.querySelector("input:last-of-type");
               if (lastInput) container.removeChild(lastInput);
           }
       });
   }


   if (enterBTN) {
       enterBTN.addEventListener("click", async () => {
           try {


               testButton.style.display = "block";

               const extraTB = document.getElementById("extraTB");

               const gradeTB = document.getElementById("gradeTB");
               const schoolTB = document.getElementById("schoolTB");
               const passionTB = document.getElementById("passionTB");
               const cgDiv = document.querySelector(".cgDiv");


               const studentInfo = {
                   grade: gradeTB.value || "",
                   classes: Array.from(cgDiv.querySelectorAll("input") || [])
                                 .map(input => input.value)
                                 .filter(val => val !== ""),
                   school: schoolTB.value || "",
                   passion: passionTB.value || "",
                   extra: extraTB.value || ""

               };


               const searchRes = await fetch("http://localhost:3000/search", {
                   method: "POST",
                   headers: { "Content-Type": "application/json" },
                   body: JSON.stringify({ query: studentInfo.school }),
               });
               const searchData = await searchRes.json();


               const LowData = searchData.organic_results
                   .slice(0, 7)
                   .map(result => ({ title: result.title, snippet: result.snippet })) || [];


                   const promptWithSearch = `
                   Student Profile:
- Grade: ${studentInfo.grade}
- School: ${studentInfo.school}
- Passion/Interest: ${studentInfo.passion}
- Classes and Grades: ${studentInfo.classes.join(", ")}
- Additional information: ${studentInfo.extra}

Recent Search Results: ${JSON.stringify(LowData)}

Task for CounselorAI:

1. Recommend courses based on the student's grade, prior classes, interests, and any additional information provided.  
   - Include both core subjects (Math, English, History, Science) and electives or specialized programs relevant to the student’s profile.  
   - Use verified course names from the school's most recent program of studies.  
   - Format as:
     1. [Course]: [Reason]
     2. [Course]: [Reason]
     3. ...
   - Keep each explanation/reason concise (1-2 sentences per course).  
   - Take into account the student's additional information (e.g., extracurriculars, learning preferences, special circumstances) to fine-tune recommendations.

2. Provide extra advice or tips (1-2 short bullet points).  
   - Use the student's extra information where relevant to provide personalized, actionable guidance.  

3. Recommend three colleges: two “likely” fits and one “reach” school based on the student's interests, prior classes, grades, and additional information.  
   - Use verified or recent data from web search results when available.  
   - Format as:
     - Likely College 1: [Reason]
     - Likely College 2: [Reason]
     - Reach College: [Reason]
   - Keep each reason concise (1-2 sentences).  
   - Factor in any extra info that may affect fit (e.g., desired programs, extracurricular strengths, or special circumstances). 
   
   - Be concise, structured, and confident. Avoid long paragraphs.
- Use numbered or bulleted lists exactly as shown.
- Base all academic and institutional info in **real, current data** from web searches using the serp api (school program of studies, course lists, college info).  
- Be **decisive**: for each class, give one clear best recommendation.  
- Only provide alternate options if a single clear recommendation is impossible — this should be rare and clearly justified.  
- Avoid uncertain or filler language (e.g., “might,” “could,” “possibly”).  
- Insert a blank line between each course for readability.  
   `;

   

               const res = await fetch("http://localhost:3000/ai", {
                   method: "POST",
                   headers: { "Content-Type": "application/json" },
                   body: JSON.stringify({ prompt: promptWithSearch }),
               });


               const data = await res.json();
               if (aiText)
                   aiText.textContent = data.output;
                   aiText.classList.add("show");


               const existingConv = localStorage.getItem("conversation") || "";
               const userInput = ``;


               const updatedConv = `${existingConv}\n${userInput}\nAI: ${data.output}`;
               localStorage.setItem("conversation", updatedConv);
               const username = localStorage.getItem("username");
               if (username) await saveConversation(username, updatedConv);
              
           } catch (err) {
               console.error(err);
           }
       });
   }


});



