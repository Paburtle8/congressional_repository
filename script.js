document.addEventListener("DOMContentLoaded", () => {

    const logBtn = document.getElementById("logBtn");
    const logDone = document.querySelector(".logDone");
    const logUserTB = document.querySelector("#logUserTB");
    const logPasswordTB = document.querySelector("#logPasswordTB");
    const plus = document.querySelector("#plus");
    const minus = document.querySelector("#minus");
    const enterBTN = document.getElementById("enterBTN");
    const aiText = document.querySelector(".aiText");

    if (logBtn) { 
        logBtn.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }

    if (logDone) {
        logDone.addEventListener("click", () => {
            if (!logUserTB.value || !logPasswordTB.value) return alert("Please fill out all boxes");

            fetch("https://sheetdb.io/api/v1/tt8ri7vy2yyfe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    data: [{ Usernames: logUserTB.value, Passwords: logPasswordTB.value }]
                })
            });

            setTimeout(() => {
                window.location.href = "main.html";
            }, 500);
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


            } catch (err) {
                console.error(err);
            }
        });
    }

}); 
