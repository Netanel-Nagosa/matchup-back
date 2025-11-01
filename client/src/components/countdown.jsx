import React, { useEffect, useState } from 'react';
import '../styles/countdown.css'
import Swal from 'sweetalert2';

function Countdown() {
    const [endOfMonth, setEndOfMonth] = useState(getNextMonthDate());
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [players, setPlayers] = useState([]);
    const [winners, setWinners] = useState([]);
    const [iswinners, setIsWinners] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [winner, setWinner] = useState(false);
    const [isMonthEnded, setIsMonthEnded] = useState(false);
    const [active, setActive] = useState([]);
    const loggedUserString = localStorage.getItem('logedName');
    const loggedUser = loggedUserString ? JSON.parse(loggedUserString) : null;
    const username = loggedUser?.logedName;
    let counterMail = 1;
    let counterActive = 0;

    const rewards = [
        { name: 'Champions League Final X2 Tickets ' },
        { name: 'Iphone 16' },
        { name: 'TV Screen 50 Inch' },
        { name: 'Mystery Box' },
        { name: 'Mystery Box' }
    ];


    function getNextMonthDate() {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        return date;
    }

    useEffect(() => {
        // fetch('http://localhost:8081/auth/resetFromPastMonth', {
        //     method: 'PUT'
        // })
        //     .then((response) => response.json())
        //     .then((data) => {
        //         if (data.good) {
        //             console.log("CHECKING DATE >> : ", data.good)
        //             setIsMonthEnded(true);
        //         }
        //     })
        //     .catch(error => console.error('Error fetching data:', error));

        fetch('http://localhost:8081/auth/checkDate', {
            method: 'PUT'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.resetGO) {
                    console.log("CHECKING DATE >> : ", data.resetGO)
                    setIsMonthEnded(true);
                }
                else {
                    setIsMonthEnded(false);
                    console.log("P R O B L E M :", data)

                    fetch('http://localhost:8081/auth/notCollectedYet', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ username })
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.prize) {
                                console.log("SENDING PRIZE ... ", data)
                                setIsMonthEnded(true);
                            }
                            else {
                                console.log(data.msg)
                            }

                        })
                        .catch(error => console.error('Error fetching data:', error));
                }

            })
            .catch(error => console.error('Error fetching data:', error));

        const interval = setInterval(() => {
            const currentTime = new Date();
            const diff = endOfMonth - currentTime; //בזמן עבודה לשנות ל0 , ברגיל לעשות endOfMonth - currentTime

            if (diff <= 0) {
                clearInterval(interval);

                const nextMonth = getNextMonthDate();
                setEndOfMonth(nextMonth); // ⬅️ הפעל מחדש עם חודש הבא
                setTimeout(() => {
                    const nextMonth = getNextMonthDate();
                    setEndOfMonth(nextMonth);
                    setIsMonthEnded(false);

                    fetch('http://localhost:8081/auth/zeroPoints', {
                        method: 'PUT'
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.good)
                                console.log(">>> ", data.good)
                            else
                                console.log("P R O B L E M : on updating to 0 points >>", data)
                        })
                        .catch(error => console.error('Error fetching data:', error));
                }, 2000);
            } else {
                setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
                setHours(Math.floor((diff / (1000 * 60 * 60)) % 24));
                setMinutes(Math.floor((diff / (1000 * 60)) % 60));
                setSeconds(Math.floor((diff / 1000) % 60));
            }
        }, 1000);
        return;
        // return () => clearInterval(interval);
    }, [endOfMonth]);


    //  מביא את המשתמשים כשנגמר החודש
    useEffect(() => {
        if (isMonthEnded) {
            fetch('http://localhost:8081/auth/getnames')
                .then((response) => response.json())
                .then((data) => {
                    const filteredPlayers = data
                        .filter(player => player.id && player.username && player.points !== undefined)
                        .sort((a, b) => b.points - a.points)
                        .slice(0, 5)
                        .map(player => player.username);

                    setPlayers(filteredPlayers);
                    console.log("הגענו לסוף החודש!");
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    }, [isMonthEnded]);

    // שולח את הזןכים לשרת
    useEffect(() => {
        if (players.length > 0) {
            players.forEach((player, index) => {
                const id = 1 + index;
                fetch('http://localhost:8081/auth/update-prizes-winners', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ player, id })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.good) {
                            console.log("all good from Backend", data, "player:", player);
                            console.log("Player " + player + " won the : " + rewards[index].name);
                            setIsWinners(true);
                        } else {
                            console.log("There are problems in the Backend", data);
                        }
                    })
                    .catch(error => console.error('Error updating data:', error));
            });
        }
    }, [players]);

    useEffect(() => {
        if (!iswinners) return;
        fetch('http://localhost:8081/auth/prizes-winners', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(response => response.json())
            .then(data => {
                const names = data.map(item => item.winner);
                const actives = data.map(item => item.active);
                setWinners(names);
                setActive(actives);
                console.log("winners Data >>> ", data, actives);

                for (const item of data) {
                    if (item.winner !== username) {
                        console.log("counterActive >>> ", counterActive + " , " + username + " / " + item.winner);
                        counterActive++;
                    } else {
                        console.log("עצירה כי יש התאמה");
                        break;
                    }
                }
                console.log(">>> >", data[counterActive], counterActive)
                if (data[counterActive].active === true) {
                    console.log(">>> SETTING TO TRUE <<<", data[counterActive])
                    setIsActive(true);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [iswinners]);

    useEffect(() => {
        console.log("username:", `"${username}"`);
        console.log("all winners:", winners.map(w => `"${w}"`));

        const isWinner = winners.some(winner => {
            const match = winner?.toLowerCase().trim() === username.toLowerCase().trim();
            if (!match) counterMail++;
            return match;
        });

        console.log("the winner !! >> ", isWinner);
        setWinner(isWinner);
    }, [winners])

    /**UPDATE prizes
    SET winner = NULL,
    isWinner = 0,
    active=1
    where id>0 */
    return (
        <div className='clock' >
            <h3 className='until'>Until the next prize giveaway!🎁 </h3>
            <span>{days} : {hours.toString().padStart(2, '0')} : {minutes.toString().padStart(2, '0')} : {seconds.toString().padStart(2, '0')}</span>
            {
                useEffect(() => {
                    if (winner && isActive) {
                        Swal.fire({
                            html: '<span style="font-size: 58px;">🏆</span>',
                            title: '🎉 Congratulations! 🎉<br>You are one of the lucky winners!',
                            confirmButtonText: 'Awesome , Lets Collect !',
                            background: 'url("/swalPhotos/backgroundSwalWon.png") no-repeat center center',
                            color: 'gold',
                            confirmButtonColor: '#5fd630',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            allowEnterKey: true
                        }).then(() => {

                            fetch('http://localhost:8081/auth/collect-prize', {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ username })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    console.log("EL FINALE >> ", data);
                                })
                                .catch(error => console.error('Error fetching data of FINALE:', error));

                        });


                    }
                }, [winner])
            }
        </div>
    );
}

export default Countdown;