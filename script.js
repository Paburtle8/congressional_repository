const logBtn = document.getElementById("logBtn");
const logDone = document.querySelector(".logDone");

const logUser = document.querySelector(".logUser");
const logUserTB = document.querySelector("#logUserTB");

const logPassword = document.querySelector(".logPassword");
const logPasswordTB = document.querySelector("#logPasswordTB");

const plus = document.querySelector("#plus");
const minus = document.querySelector("#minus");

const aiText = document.querySelector(".aiText");


const enterBTN = document.getElementById("enterBTN");





enterBTN.addEventListener("click", async () => {
    try {
        const studentInfo = {
            grade: document.getElementById("gradeTB").value,
            classes: Array.from(document.querySelectorAll(".cgDiv input"))
                          .map(input => input.value)
                          .filter(val => val !== ""),
            school: document.getElementById("schoolTB").value,
            passion: document.getElementById("passionTB").value
        };
        
        const searchRes = await fetch("http://localhost:3000/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: studentInfo.school }),
        });
        const searchData = await searchRes.json();
        
        
        const LowData = searchData.organic_results
            ?.slice(0,7)
            .map(result => ({title :result.title, snippet: result.snippet})) || [];
        
        const promptWithSearch= `
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
        aiText.textContent = data.output;
        
    } catch (err) {
        console.error(err);
    }
});




function login() {
    window.location.href = "login.html";
}

if (logBtn) {
    logBtn.addEventListener("click", login);
}

function loginDone() {
    if (logUserTB.value == "" || logPasswordTB.value == "") {
        alert("Please fill out all boxes");
    } else {
        
        fetch("https://sheetdb.io/api/v1/tt8ri7vy2yyfe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                data: [
                    { Usernames: logUserTB.value, Passwords: logPasswordTB.value}
                ]
            })
        });
        
        setTimeout(() => {
            
            window.location.href = "main.html";
        }, 500);
        
        
        
    }
    
    
}


if (logDone) {
    
    logDone.addEventListener("click", loginDone);
    
    
}




function addBox() {
    
    let newInput = document.createElement("input");
    let container = document.querySelector(".cgDiv");
    container.appendChild(newInput);
}


if (plus) {
    plus.addEventListener("click", addBox)
}


function minusBox() {
    
    let container = document.querySelector(".cgDiv");
    let finalInput = container.querySelector("input:last-of-type");
    
    if(finalInput){
        container.removeChild(finalInput);
        
    }
    
}


if (minus) {
    minus.addEventListener("click", minusBox);
}




