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
    const dot = document.querySelector("#dot");
    const testButton = document.getElementById("testButton");



    let count = 0;

    setInterval(() => {
        if (count < 1) {
            count++;
            dot.textContent = "Loading.".repeat(count); 

        } else {
            dot.textContent = ""; 
            count = 0; 
        }
    }, 500); 


    function refresh() {
        welcomeDiv.textContent = "Get Started Now";
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
        const searchRes = await fetch(`https://sheetdb.io/api/v1/tt8ri7vy2yyfe/search?Usernames=${username}`); 
        const users = await searchRes.json();

        if(users.length){
            if (users[0].Passwords==password){
                alert("Password Correct");
                return users[0].Conversation || "";     }
            else{
                alert("wrong password!");
                    return null;
            }
        } 
    }

    async function signUp(username,password){
            {
            await fetch("https://sheetdb.io/api/v1/tt8ri7vy2yyfe", {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({data: [{Usernames: username, Passwords: password, Conversation: ""}] })
            });
            alert("Account created!");
            return "";
        }
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
                    passion: passionTB.value || ""
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
Grade: ${studentInfo.grade}
School: ${studentInfo.school}
Passion/Interest: ${studentInfo.passion}
Classes and Grades: ${studentInfo.classes.join(", ")}

Search results: ${JSON.stringify(LowData)}

Format only as:

 CounselorAI:
 
Recommendations:
- [Course]: [Reason based on student's prior grades and interests]

Notes:
- [Extra advice, tips, or warnings, keep brief]

Instructions for CounselorAI:
- Be concise and clear; avoid long paragraphs.
- Use bullet points exactly as shown; leave a blank line between bullet points.
- Suggest courses based on the student's grade, prior classes, and school program.
- Prioritize courses that match the student's passions and academic strengths.
- Provide definitive recommendations; do not hedge.
- Make a new add numbers for each subject. (like 1. 2. 3.)

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
                const userInput = `
                    
                    `;

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
