
const bets = [];

fetch('http://localhost:8081/auth/showbets')
    .then(response => response.json())
    .then(data => {
        bets.push(...data);
        console.log(" ----> bets :::", bets)
        updateResultsDisplay();
    }, [])
    .catch(error => console.error('Error fetching data:', error));
console.log(bets)

function updateResultsDisplay() {
    const game1MN = document.querySelector('.MN1');
    const game2MN = document.querySelector('.MN2');
    const game3MN = document.querySelector('.MN3');
    const game4MN = document.querySelector('.MN4');
    const game5MN = document.querySelector('.MN5');


    let p = 1;
    bets.forEach(match => {

        console.log(p + ")" + match.home_team + " VS " + match.away_team);
        p++;


        if (game1MN.textContent === "") {
            game1MN.textContent = match.home_team + " VS " + match.away_team;
            let ANSRES = document.querySelector(".ANS-RES1");
            ANSRES.textContent = match.result;

            let deletePoint = document.querySelector(".dp1");
            let del = document.createElement("div");
            del.textContent = "X";
            del.addEventListener("click", async () => {

                try {
                    const response = await fetch(`http://localhost:8081/auth/delete-game/${match.id}`, { method: "DELETE" });
                    if (response.ok) {

                        console.log("game " + match.id + " ) " + match.home_team + " VS " + match.away_team + " , has deleted .")
                        game1MN.textContent = "";
                        deletePoint.textContent = "";
                        ANSRES.textContent = "";
                    } else {
                        console.log("error in deleting , l72 script-homeForm.js >>>")
                    }
                } catch (error) {
                    console.error("error:", error);
                }

            })

            del.classList.add('delete');
            deletePoint.append(del)
            document.getElementById("hiddenMatch1").value = document.getElementById("match1").innerText;
        }

        else if (game2MN.textContent === "") {
            game2MN.textContent = match.home_team + " VS " + match.away_team;
            let ANSRES = document.querySelector(".ANS-RES2");
            ANSRES.textContent = match.result;

            let deletePoint = document.querySelector(".dp2");
            let del = document.createElement("div");
            del.textContent = "X";
            del.addEventListener("click", async () => {

                try {
                    const response = await fetch(`http://localhost:8081/auth/delete-game/${match.id}`, { method: "DELETE" });
                    if (response.ok) {

                        console.log("game " + match.id + " ) " + match.home_team + " VS " + match.away_team + " , has deleted .")
                        game2MN.textContent = "";
                        deletePoint.textContent = "";
                        ANSRES.textContent = "";
                    } else {
                        console.log("error in deleting , l107 script-homeForm.js >>>")
                    }
                } catch (error) {
                    console.error("error:", error);
                }

            })

            del.classList.add('delete');
            deletePoint.append(del)
            document.getElementById("hiddenMatch2").value = document.getElementById("match2").innerText;
        }

        else if (game3MN.textContent === "") {
            game3MN.textContent = match.home_team + " VS " + match.away_team;
            let ANSRES = document.querySelector(".ANS-RES3");
            ANSRES.textContent = match.result;

            let deletePoint = document.querySelector(".dp3");
            let del = document.createElement("div");
            del.textContent = "X";
            del.addEventListener("click", async () => {

                try {
                    const response = await fetch(`http://localhost:8081/auth/delete-game/${match.id}`, { method: "DELETE" });
                    if (response.ok) {

                        console.log("game " + match.id + " ) " + match.home_team + " VS " + match.away_team + " , has deleted .")
                        game3MN.textContent = "";
                        deletePoint.textContent = "";
                        ANSRES.textContent = "";
                    } else {
                        console.log("error in deleting , l139 script-homeForm.js >>>")
                    }
                } catch (error) {
                    console.error("error:", error);
                }

            })

            del.classList.add('delete');
            deletePoint.append(del)
            document.getElementById("hiddenMatch3").value = document.getElementById("match3").innerText;
        }
        else if (game4MN.textContent === "") {
            game4MN.textContent = match.home_team + " VS " + match.away_team;
            let ANSRES = document.querySelector(".ANS-RES4");
            ANSRES.textContent = match.result;

            let deletePoint = document.querySelector(".dp4");
            let del = document.createElement("div");
            del.textContent = "X";
            del.addEventListener("click", async () => {

                try {
                    const response = await fetch(`http://localhost:8081/auth/delete-game/${match.id}`, { method: "DELETE" });
                    if (response.ok) {

                        console.log("game " + match.id + " ) " + match.home_team + " VS " + match.away_team + " , has deleted .")
                        game4MN.textContent = "";
                        deletePoint.textContent = "";
                        ANSRES.textContent = "";
                    } else {
                        console.log("error in deleting , l74 script-homeForm.js >>>")
                    }
                } catch (error) {
                    console.error("error:", error);
                }

            })

            del.classList.add('delete');
            deletePoint.append(del)
            document.getElementById("hiddenMatch4").value = document.getElementById("match4").innerText;
        }
        else if (game5MN.textContent === "") {
            game5MN.textContent = match.home_team + " VS " + match.away_team;
            let ANSRES = document.querySelector(".ANS-RES5");
            ANSRES.textContent = match.result;

            let deletePoint = document.querySelector(".dp5");
            let del = document.createElement("div");
            del.textContent = "X";
            del.addEventListener("click", async () => {

                try {
                    const response = await fetch(`http://localhost:8081/auth/delete-game/${match.id}`, { method: "DELETE" });
                    if (response.ok) {

                        console.log("game " + match.id + " ) " + match.home_team + " VS " + match.away_team + " , has deleted .")
                        game5MN.textContent = "";
                        deletePoint.textContent = "";
                        ANSRES.textContent = "";
                    } else {
                        console.log("error in deleting , l75 script-homeForm.js >>>")
                    }
                } catch (error) {
                    console.error("error:", error);
                }

            })

            del.classList.add('delete');
            deletePoint.append(del)
            document.getElementById("hiddenMatch5").value = document.getElementById("match5").innerText;
        }

    })

}

document.querySelector("form").addEventListener("submit", async function (event) {
    event.preventDefault(); // מונע שליחה רגילה של הטופס
    //לדאוג שיקבל גם את הusername מהבקאנד
    const match1 = document.querySelector("#hiddenMatch1").value;
    const match2 = document.querySelector("#hiddenMatch2").value;
    const match3 = document.querySelector("#hiddenMatch3").value;
    const match4 = document.querySelector("#hiddenMatch4").value;
    const match5 = document.querySelector("#hiddenMatch5").value;

    const result1 = document.querySelector("#result1").textContent;
    const result2 = document.querySelector("#result2").textContent;
    const result3 = document.querySelector("#result3").textContent;
    const result4 = document.querySelector("#result4").textContent;
    const result5 = document.querySelector("#result5").textContent;

    //גם בשורה פה כשיגע היחסים מהAPI אז לשנות מ VALUE ל textContent
    const price1 = document.querySelector("#price1").value;
    const price2 = document.querySelector("#price2").value;
    const price3 = document.querySelector("#price3").value;
    const price4 = document.querySelector("#price4").value;
    const price5 = document.querySelector("#price5").value;

    try {
        const response = await fetch("/auth/homeForm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                match1, result1, price1,
                match2, result2, price2,
                match3, result3, price3,
                match4, result4, price4,
                match5, result5, price5,
            })
        });

        const data = await response.json();
        if (data.msg) {
            alert(data.msg); // מציג הודעה על הצלחה
            //לבדוק אם אני צריך את הawait promise.all באמת
            await Promise.all(
                bets.map(async (match) => {
                    try {
                        const response = fetch(`http://localhost:8081/auth/delete-game/${match.id}`, { method: "DELETE" });
                        if (response.ok) {
                            console.log("good luck !!")
                            game5MN.textContent = "";
                            deletePoint.textContent = "";
                            ANSRES.textContent = "";
                        } else {
                            console.log("error in deleting , l239 script-homeForm.js >>>")
                        }
                    } catch (error) {
                        console.error("error:", error);
                    }

                })
            )
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
        else
            alert(data.err); // מציג הודעה על שגיאה

    } catch (error) {
        console.error("Error:", error);
        alert("Error adding match");
    }

    //לדאוג שהטופס בפרונט ימחק אחרי השליחה של הטופס
});
