import React, { useState, useEffect, useRef } from 'react'
import '../styles/tablePage.css'

function TablePage() {
    const [players, setPlayers] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('http://localhost:8081/auth/getnames')
            .then(response => response.json())
            .then(data => {
                setPlayers(data);

            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);




    const loggedUserString = localStorage.getItem('logedName');
    const loggedUser = loggedUserString ? JSON.parse(loggedUserString) : null;
    console.log("LOGED USER:", loggedUser);


    const scrollRef = useRef(null);
    const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
    console.log(sortedPlayers)
    return (
        <div className="main">
            <div className="searchUser">
                <h1>LOOK FOR YOUR NAME</h1>
                <input type="text" className='custom-input' placeholder='serch username ..' value={search}
                    onChange={(e) => setSearch(e.target.value)} />
                <div className="searchUser-result">
                    {(() => {
                        const foundIndex = sortedPlayers.findIndex(p => p.username === search);
                        const foundPlayer = sortedPlayers.find(p => p.username === search);

                        if (!foundPlayer) return;

                        return (
                            <>
                                <div className="rank">{foundIndex + 1}</div>
                                <div className="name">{foundPlayer.username}</div>
                                <div className="points">{foundPlayer.points}</div>
                            </>
                        );
                    })()}
                </div>
            </div>
            <div className="topUsers">
                <h2>FULL LIST :</h2>
                <div className="table-container">
                    <table className="playersTable">
                        <thead>
                            <tr>
                                <th>RANK</th>
                                <th>NAME</th>
                                <th>POINTS</th>
                            </tr>
                        </thead>
                    </table>
                    <div className="scroll-body">
                        <div className="scroll-container">
                            <div className="scroll-content" ref={scrollRef}>
                                {[...sortedPlayers, ...sortedPlayers].map((player, index) => {
                                    const isLoged = loggedUser && player.username === loggedUser.logedName;

                                    // דילוג על שחקנים חסרי שם
                                    if (!player.username) return null;

                                    const rank = (index % players.length) + 1;
                                    const isTop5 = rank <= 5 && !isLoged;

                                    return (
                                        <div
                                            key={index}
                                            className="player-row"
                                            style={{
                                                backgroundColor: isLoged ? "gold" : "transparent",
                                                color: isLoged ? "black" : isTop5 ? "gold" : "inherit",
                                            }}
                                        >
                                            <span>{rank}</span>
                                            <span>{player.username}</span>
                                            <span>{player.points ?? 0}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );


}

export default TablePage