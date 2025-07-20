/*
// let home = document.querySelector(".homeTeam").innerText;
// let away = document.querySelector(".awayTeam").innerText;
// function saveResult(home, away, value) {
//     localStorage.setItem('homeName', home);
//     localStorage.setItem('awayName', away);
//     localStorage.setItem('lastButtonPressed', value);
// }

// document.getElementById('btn1').addEventListener('click', () => saveResult(home, away, '1'));
// document.getElementById('btnX').addEventListener('click', () => saveResult(home, away, 'X'));
// document.getElementById('btn2').addEventListener('click', () => saveResult(home, away, '2'));

// localStorage.clear()
// פונקציה לשמירת לחיצת כפתור עבור משחק ספציפי
document.querySelectorAll('.result').forEach(button => {
    button.addEventListener('click', function () {
        // // מקבל את שם המשחק והתוצאה שנלחצה
        
        // const gameDiv = button.closest('.bets');
        // const gameName = gameDiv.getAttribute('data-game-name');
        // const result = button.getAttribute('data-result');

        // // מייצר אובייקט לשמירה
        // const gameResult = {
        //     game: gameName,
        //     result: result
        // };

        // // טוען את התוצאות הקיימות מ-localStorage
        let results = JSON.parse(localStorage.getItem('gameResults')) || [];
        
        if(results.length>4)
        console.log("thats it you have 5 games already .")
        else{
        const existingGameIndex = results.findIndex(game => game.game === gameName);

        if (existingGameIndex !== -1) {
            // אם המשחק כבר קיים, מעדכן את התוצאה
            results[existingGameIndex].result = result;
        } else {
            // אם המשחק לא קיים, מוסיף אותו
            results.push({ game: gameName, result: result });
        }

        // שומר את המערך המעודכן ב-localStorage
        localStorage.setItem('gameResults', JSON.stringify(results));

        console.log(`Saved result: ${gameName} - ${result}`);
        }
    });
    
});*/

document.querySelectorAll(".result").forEach(button => {
    console.log("started l-55 >>>>>>>>>>");
    //בדרך הזאת , התוצאה נשלחת בלי להדפיס את הJSON בכל המסך
    button.addEventListener("click", async function (e) {
        e.preventDefault();
        const form = this.closest("form");
        const home_team = form.querySelector('input[name="home_team"]').value;
        const away_team = form.querySelector('input[name="away_team"]').value;
        const result = this.value; // הערך של הכפתור שנלחץ


        const response = await fetch("/auth//homeMatches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                home_team, away_team, result
            })
        });
        const data = await response.json();
        if (data.msg)
            console.log(data.msg);
        else if (data.limit)
            alert(data.limit)
        else
            alert("error")
    });
});

