import React, { useEffect, useState, useRef } from 'react';
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

    // useRef לשמירת ספירות בין רינדורים
    const counterMail = useRef(1);
    const counterActive = useRef(0);

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
        fetch('http://localhost:8081/auth/checkDate', { method: 'PUT' })
            .then((response) => response.json())
            .then((data) => {
                if (data.resetGO) {
                    setIsMonthEnded(true);
                } else {
                    setIsMonthEnded(false);
                    fetch('http://localhost:8081/auth/notCollectedYet', {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username })
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.prize) setIsMonthEnded(true);
                        })
                        .catch(console.error);
                }
            })
            .catch(console.error);
    }, [username]);

    // Countdown Interval עם Cleanup
    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = new Date();
            const diff = endOfMonth - currentTime;

            if (diff <= 0) {
                clearInterval(interval);
                const nextMonth = getNextMonthDate();
                setEndOfMonth(nextMonth);
                setTimeout(() => {
                    setEndOfMonth(getNextMonthDate());
                    setIsMonthEnded(false);
                    fetch('http://localhost:8081/auth/zeroPoints', { method: 'PUT' })
                        .then((res) => res.json())
                        .then(console.log)
                        .catch(console.error);
                }, 2000);
            } else {
                setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
                setHours(Math.floor((diff / (1000 * 60 * 60)) % 24));
                setMinutes(Math.floor((diff / (1000 * 60)) % 60));
                setSeconds(Math.floor((diff / 1000) % 60));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [endOfMonth]);

    // מביא את המשתמשים כשנגמר החודש
    useEffect(() => {
        if (isMonthEnded) {
            fetch('http://localhost:8081/auth/getnames')
                .then((res) => res.json())
                .then((data) => {
                    const filteredPlayers = data
                        .filter(player => player.id && player.username && player.points !== undefined)
                        .sort((a, b) => b.points - a.points)
                        .slice(0, 5)
                        .map(player => player.username);
                    setPlayers(filteredPlayers);
                })
                .catch(console.error);
        }
    }, [isMonthEnded]);

    // שולח את הזוכים לשרת
    useEffect(() => {
        if (players.length > 0) {
            players.forEach((player, index) => {
                fetch('http://localhost:8081/auth/update-prizes-winners', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ player, id: 1 + index })
                })
                    .then(res => res.json())
                    .then(data => { if (data.good) setIsWinners(true); })
                    .catch(console.error);
            });
        }
    }, [players]);

    useEffect(() => {
        if (!iswinners) return;
        fetch('http://localhost:8081/auth/prizes-winners', { method: "GET", headers: { "Content-Type": "application/json" } })
            .then(res => res.json())
            .then(data => {
                const names = data.map(item => item.winner);
                const actives = data.map(item => item.active);
                setWinners(names);
                setActive(actives);

                counterActive.current = 0;
                for (const item of data) {
                    if (item.winner !== username) counterActive.current++;
                    else break;
                }
                if (data[counterActive.current]?.active) setIsActive(true);
            })
            .catch(console.error);
    }, [iswinners, username]);

    // בודק אם המשתמש הוא זוכה
    useEffect(() => {
        if (!username) return;
        const isWinner = winners.some(w => w?.toLowerCase().trim() === username.toLowerCase().trim());
        setWinner(isWinner);
    }, [winners, username]);

    // Swal effect מחוץ ל- return
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
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username })
                })
                    .then(res => res.json())
                    .then(console.log)
                    .catch(console.error);
            });
        }
    }, [winner, isActive, username]);

    return (
        <div className='clock'>
            <h3 className='until'>Until the next prize giveaway!🎁 </h3>
            <span>{days} : {hours.toString().padStart(2, '0')} : {minutes.toString().padStart(2, '0')} : {seconds.toString().padStart(2, '0')}</span>
        </div>
    );
}

export default Countdown;
