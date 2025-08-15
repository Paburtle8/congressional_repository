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
        const res = await fetch("http://localhost:3000/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: "write a haiku about ai" }),
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

