import React, { useState, useEffect } from 'react';
import Pagination from './pagination';
import backgroundImage from '../backPhotos/backgroundGameNotChosen.png';
import Swal from 'sweetalert2';

function LeaguePage({ leagueKey, leagueTitle }) {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 6;

  const loggedUserString = localStorage.getItem('logedName');
  const loggedUser = loggedUserString ? JSON.parse(loggedUserString) : null;
  useEffect(() => {
    if (!loggedUser || !loggedUser.logedName) return;
    const player = loggedUser.logedName;
    const checkAndClearBets = () => {
      fetch('/auth/clear-bets', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ player }),
      })
        .then(res => res.json())
        .then(data => console.log(data.message))
        .catch(err => console.error(err));
    };
    const interval = setInterval(checkAndClearBets, 2 * 60 * 1000);

    checkAndClearBets();

    return () => clearInterval(interval);
  }, []);

  const handleBet = async (home_team, away_team, competition, result, odd, time) => {
    const loggedUserString = localStorage.getItem('logedName');
    const loggedUser = loggedUserString ? JSON.parse(loggedUserString) : null;
    const player = loggedUser.logedName;
    const date = new Date(time);

    try {
      const res = await fetch("/auth/homeMatches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ player, home_team, away_team, competition, result, odd, date })
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          timer: 800,
          color: 'white',
          background: 'black',
          showConfirmButton: false,
        })
      } else {
        Swal.fire({
          icon: 'error',
          iconColor: 'red',
          text: `you already have 5 games on your bet.`,
          timer: 3000,
          color: 'white',
          background: 'black',
          showConfirmButton: false,
        })
      }
    } catch (err) {
      console.log("Error line 28 LP: " + err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.the-odds-api.com/v4/sports/${leagueKey}/odds?regions=us&oddsFormat=american&apiKey=7c71038a3296a0a182b96b0e227ae440`);
        const data = await res.json();
        const now = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(now.getDate() + 3);
        const filteredData = data.filter(match => {
          const gameTime = new Date(match.commence_time);
          return gameTime > now && gameTime <= threeDaysFromNow;
        });
        setGames(filteredData);

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [leagueKey, leagueTitle]);
  console.log("games >>", games)
  if (!leagueTitle || !leagueKey) {
    return <div style={{
      color: 'white', textAlign: 'center', fontSize: 'xx-large', backgroundImage: `url(${backgroundImage})`, backgroundImage: `url(${backgroundImage})`,
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      minHeight: '100vh', textShadow: '-3px 2px 5px gold'
    }}>• NO LEAGUE CHOSEN , SEARCH ON TOP • </div>;
  }

  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);

  const formattedGames = currentGames.map(game => {
    const [date, timeWithZ] = game.commence_time.split("T");
    const time = timeWithZ.replace("Z", "");
    return {
      ...game,
      formattedTime: `${date} // ${time}`
    };
  });
  console.log("games >>>>>> ", formattedGames)

  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <>
      <div className="lgp container-fluid ">
        <div className='h2Div'>
          <h2 style={{ textTransform: 'capitalize' }}>{leagueTitle}</h2>
        </div>
        {!games || games.length === 0? (
          <div className="noGames">
           NO GAMES SOON ..
          </div>
        ) : (
          formattedGames.map((item, i) => (
            <div key={i} className="card shadow p-3 mb-5 col-4 m-auto" >
              <div className="card-body text-center" >
                <div className="title p-1 rounded-1 bgTitleTime mb-5">
                  <h5>{item.sport_title}</h5>
                  <h6>{item.formattedTime}</h6>
                </div>

                <div className="games row d-flex justify-content-evenly w-100">
                  <div className="class30">
                    <label htmlFor="home_team"><span>{toTitleCase(item.home_team)}</span></label>
                    <input type="hidden" id='home_team' value={item.home_team} />
                    <button className="btn btn-primary" onClick={() =>
                      handleBet(item.home_team, item.away_team, item.sport_key, "1", item.bookmakers[0].markets[0].outcomes[0].price, item.commence_time)}>
                      Home(1)
                    </button>
                  </div>

                  <div className="class30">
                    <span>VS</span>
                    <button className="btn btn-light" onClick={() =>
                      handleBet(item.home_team, item.away_team, item.sport_key, "X", item.bookmakers[0].markets[0].outcomes[2].price, item.commence_time)}>
                      Draw(X)
                    </button>
                  </div>

                  <div className="class30">
                    <label htmlFor="away_team"><span>{toTitleCase(item.away_team)}</span></label>
                    <input type="hidden" id='away_team' value={item.away_team} />
                    <button className="btn btn-danger" onClick={() =>
                      handleBet(item.home_team, item.away_team, item.sport_key, "2", item.bookmakers[0].markets[0].outcomes[1].price, item.commence_time)}>
                      Away(2)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))

        )}
      </div>
      <Pagination
        totalPosts={games.length}
        postsPerPage={gamesPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </>
  );
}

export default LeaguePage;
