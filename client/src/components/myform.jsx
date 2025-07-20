import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import "../styles/myform.css";

function Myform() {
    const bets = [];
    const loggedUserString = localStorage.getItem('logedName');
    const loggedUser = loggedUserString ? JSON.parse(loggedUserString) : null;
    const player = loggedUser.logedName;
    const newFormData = {};
    fetch('http://localhost:8081/auth/showbets', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ player })
    })
        .then(response => response.json())
        .then(data => {
            bets.push(...data);
            
            for (let i = 1; i <= 5; i++) {
                const match = document.querySelector(`#hiddenMatch${i}`)?.value || "";
                const result = document.querySelector(`#result${i}`)?.textContent || "";
                const price = parseInt(document.querySelector(`#odd${i}`)?.textContent || "0", 10);
                newFormData[`match${i}`] = match;
                newFormData[`result${i}`] = result;
                newFormData[`price${i}`] = price;
                newFormData[`date${i}`] = bets[i-1]?.date || "";
            }

            updateResultsDisplay();
        }, [])
        .catch(error =>
            console.error('Error fetching data:', error)
        );

    console.log("All the bets >>>>> ", newFormData)
    const [totalPrice, setTotalPrice] = useState(0);
    function updateResultsDisplay() {
        const gameElements = [
            {
                gameMN: document.querySelector('.MN1'),
                res: document.querySelector('.ANS-RES1'),
                odd: document.querySelector('.ANS-ODD1'),
                dp: document.querySelector('.dp1'),
                hiddenInput: document.getElementById("hiddenMatch1"),
                matchText: document.getElementById("match1"),
            },
            {
                gameMN: document.querySelector('.MN2'),
                res: document.querySelector('.ANS-RES2'),
                odd: document.querySelector('.ANS-ODD2'),
                dp: document.querySelector('.dp2'),
                hiddenInput: document.getElementById("hiddenMatch2"),
                matchText: document.getElementById("match2"),
            },
            {
                gameMN: document.querySelector('.MN3'),
                res: document.querySelector('.ANS-RES3'),
                odd: document.querySelector('.ANS-ODD3'),
                dp: document.querySelector('.dp3'),
                hiddenInput: document.getElementById("hiddenMatch3"),
                matchText: document.getElementById("match3"),
            },
            {
                gameMN: document.querySelector('.MN4'),
                res: document.querySelector('.ANS-RES4'),
                odd: document.querySelector('.ANS-ODD4'),
                dp: document.querySelector('.dp4'),
                hiddenInput: document.getElementById("hiddenMatch4"),
                matchText: document.getElementById("match4"),
            },
            {
                gameMN: document.querySelector('.MN5'),
                res: document.querySelector('.ANS-RES5'),
                odd: document.querySelector('.ANS-ODD5'),
                dp: document.querySelector('.dp5'),
                hiddenInput: document.getElementById("hiddenMatch5"),
                matchText: document.getElementById("match5"),
            },
        ];

        let total = 0;

        bets.forEach((match, index) => {
            if (index >= gameElements.length) return;

            const el = gameElements[index];

            el.gameMN.textContent = `${match.home_team} VS ${match.away_team}`;
            el.res.textContent = match.result;
            el.odd.textContent = (match.odd > 500 ? 500 : match.odd);
            total += (match.odd > 500 ? 500 : match.odd) || 0;
            el.hiddenInput.value = el.matchText.innerText;

            el.dp.textContent = "";

            const del = document.createElement("div");
            del.textContent = "X";
            del.classList.add("delete");

            del.addEventListener("click", async () => {
                try {
                    const response = await fetch(`http://localhost:8081/auth/delete-game/${match.id}`, {
                        method: "DELETE"
                    });
                    if (response.ok) {
                        console.log(`game ${match.id}) ${match.home_team} VS ${match.away_team} , has deleted.`);
                         setTotalPrice(total-el.odd.textContent);
                        el.gameMN.textContent = "";
                        el.res.textContent = "";
                        el.odd.textContent = "";
                        el.dp.textContent = "";
                        window.location.reload();
                    } else {
                        console.log("error deleting match");
                    }
                } catch (error) {
                    console.error("error:", error);
                }
            });

            el.dp.append(del);
        });


        setTotalPrice(total);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const loggedUserString = localStorage.getItem('logedName');
        const loggedUser = loggedUserString ? JSON.parse(loggedUserString) : null;

        try {
            newFormData['username'] = loggedUser.logedName;
            console.log(" THE FORM THAT SENDING ::: ", newFormData);
            const response = await fetch("/auth/homeForm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newFormData),
            });

            const data = await response.json();

            if (data.msg) {
                 Swal.fire({
                          icon: 'warning',
                          iconColor:'goldenrod',
                          text: data.msg,
                          timer: 2500,
                          showConfirmButton: false,
                          background:'black',
                          color:'white'
                        })
            }
            if (data.ok) {
                Swal.fire({
                          icon: 'success',
                          iconColor:'goldenrod',
                          text: data.ok,
                          timer: 2500,
                          showConfirmButton: false,
                          background:'black',
                          color:'lightgreen'
                        })

                for (let i = 1; i <= 5; i++) {
                    document.querySelector(`.MN${i}`).textContent = "";
                    document.querySelector(`.dp${i}`).textContent = "";
                    document.querySelector(`.ANS-RES${i}`).textContent = "";
                    document.querySelector(`.ANS-ODD${i}`).textContent = "";
                }

                await Promise.all(
                    bets.map(async (match) => {
                        try {
                            const res = await fetch(
                                `http://localhost:8081/auth/delete-game/${match.id}`,
                                { method: "DELETE" }
                            );
                            if (res.ok) {
                                console.log("Deleted match:", match.home_team, "VS", match.away_team);
                            } else {
                                console.log("Error deleting match", match.id);
                            }
                        } catch (err) {
                            console.error("error:", err);
                        }
                    })
                );

            }
        } catch (err) {
            console.error("Error:", err);
            alert("Error adding match");
        }
    };

    return (
        <div className="form">
            <div className="form-box">
                <h2>My Bet :</h2>
                <form onSubmit={handleSubmit}>
                    <div className="games">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div className={`game game${i}`} key={i}>
                                <span> </span>
                                <span id={`match${i}`} name={`match${i}`} className={`matchName MN${i}`}></span>
                                <input
                                    type="hidden"
                                    id={`hiddenMatch${i}`}
                                    name={`match${i}`}
                                />
                                <div className="resAndScore result">
                                    <span className="headtitle">RESULT</span>
                                    <span id={`result${i}`} name={`result${i}`} className={`answer ANS-RES${i}`}></span>
                                </div>
                                <div className="resAndScore score">
                                    <span className="headtitle">ODDS</span>
                                    <span id={`odd${i}`} name={`odd${i}`} className={`answer ANS-ODD${i}`}></span>
                                </div>
                                <span className={`deletePoint dp${i}`}></span>
                            </div>
                        ))}
                    </div>
                    <div className="totals">
                        <span className="totalS">Total Score : {totalPrice}</span>
                    </div>
                    <button type="submit" className="sendButton">SEND</button>
                </form>
            </div>
        </div>
    );
}

export default Myform