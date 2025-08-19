document.addEventListener("DOMContentLoaded", () => {

    const logBtn = document.getElementById("logBtn");
    const logDone = document.querySelector(".logDone");
    const logUserTB = document.querySelector("#logUserTB");
    const logPasswordTB = document.querySelector("#logPasswordTB");
    const plus = document.querySelector("#plus");
    const minus = document.querySelector("#minus");
    const enterBTN = document.getElementById("enterBTN");
    const aiText = document.querySelector(".aiText");

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

    async function handleAuth(username,password){
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
        } else {
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

            const conversation = await handleAuth(logUserTB.value, logPasswordTB.value);

            if (conversation !== null) {
                localStorage.setItem("conversation", conversation);
                localStorage.setItem("username", logUserTB.value);

                if (aiText) aiText.textContent = conversation;

                window.location.href = "main.html";
            }

        });
    }

    if (plus) { 
        plus.addEventListener("click", () => {
            const container = document.querySelector(".cgDiv");
            if (container) container.appendChild(document.createElement("input")); // Added check
        });
    }

    if (minus) { 
        minus.addEventListener("click", () => {
            const container = document.querySelector(".cgDiv");
            if (container) { // Added check
                const lastInput = container.querySelector("input:last-of-type");
                if (lastInput) container.removeChild(lastInput);
            }
        });
    }

    if (enterBTN) { 
        enterBTN.addEventListener("click", async () => {
            try {
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
### Recommendations
- [Course]: [Reason]

### Notes
- [Extra advice]

Always use bullet points, no long paragraphs.
You are CounselorAI. Based on the school's Program of studies/course catalog, suggest next-year classes.
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

                    // Save conversation using the clean input
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
