import React, { useState, useEffect } from 'react'
import '../styles/checkWin.css'
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function CheckWinPage() {
  const [formData, setFormData] = useState([]);
  const [id, setId] = useState([]);
  const [homeTeamNames, setHomeTeamNames] = useState([]);
  const [awayTeamNames, setAwayTeamNames] = useState([]);
  const [last5games, setLast5games] = useState([]);
  const [scores, setScores] = useState([]);
  const [won, setWon] = useState('');
  const [pastForms, setpastForms] = useState([]);
  const [msg, setMsg] = useState({ win: null, lose: null });
  const [avg, setAvg] = useState('');
  const [wins, setWins] = useState('');
  const [loses, setLoses] = useState('');
  const [highestPoints, sethighestPoints] = useState('');
  const [highestPointsForWin, sethighestPointsForWin] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalWinningPoints, setTotalWinningPoints] = useState(0);
  const [points, setPoints] = useState(0);
  const [check, setCheck] = useState(false);
  const loggedUserString = localStorage.getItem('logedName');
  const loggedUser = loggedUserString ? JSON.parse(loggedUserString) : null;
  const username = loggedUser?.logedName;
  const navigate = useNavigate();
  useEffect(() => {

    if (!username) return;

    fetch('http://localhost:8081/auth/get-form', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username })
    })
      .then(response => response.json())
      .then(data => {
        if (!data || data.length === 0) {
          console.log("No form found for this user, stopping further processing.");
          setFormData({}); // או להשאיר ריק או לסמן שלא קיים טופס
          return;
        }
        setFormData(data[0]);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    console.log("THE FORM >> ", formData)
    if (!formData) {
      return <div>No form available for this user.</div>;
    }
    console.log("form > ", formData)
    if (formData && formData.active === true) {
      const homeNames = [];
      const awayNames = [];
      console.log("total price>> ", formData.total_price)
      setPoints(formData.total_price);
      Object.keys(formData).forEach((key) => {
        if (key.startsWith('match')) {

          const fullMatch = formData[key];
          if (typeof fullMatch === 'string' && fullMatch.includes(' VS ')) {
            const [firstTeam, secondTeam] = fullMatch.split(' VS ');
            homeNames.push(firstTeam.trim());
            awayNames.push(secondTeam.trim());
          }
        }
      });

      setHomeTeamNames(homeNames);
      setAwayTeamNames(awayNames);
    }


  }, [formData]);
  console.log("points > ", points)
  const teamNameFixes = {
    "Basaksehir": "Istanbul Basaksehir",
    "CD Mirandés": "Mirandes",
    "CD Eldense": "Eldense",
    "Libertad Asuncion": "Club Libertad",
    "Nacional de Montevideo": "Nacional Montevideo",
    "Internacional-RS": "Internacional",
    "Flamengo-RJ": "Flamengo",
    "Palmeiras-SP": "Palmeiras",
    "Atlético Nacional S.A": "Atlético Nacional",
    "Inter Miami CF": "Inter Miami",
    "La Serena": "Deportes La Serena",
    "FC Anyang": "Anyang",
    "Operario PR": "Operário Ferroviário",
    "Clube de Regatas Brasil": "CRB",
    "Atletico Paranaense": "Athletico Paranaense",
    "Oviedo": "Real Oviedo",
    "Deportivo La Coruña": "Deportivo de La Coruña",
    "Czechia": "Czech Republic",
    "Bragantino-SP": "Bragantino",
    "Varbergs BoIS": "Varbergs BoIS FC",
    "Al Ain FC": "Al Ain",
    "Wydad AC": "Wydad Casablanca",
    "Al-Hilal Saudi FC": "Al Hilal",
    "Al Ahly FC": "Al Ahly SC",
    "Ilves Tampere": "Ilves",
    "VPS Vaasa": "VPS",
    "SJK Seinäjoki": "SJK Seinajoki",
    "Örgryte IS": "Oergryte",
    "Colo Colo": "Colo-Colo",
    "RB Salzburg": "Red Bull Salzburg",
    "Paris Saint Germain": "Paris SG",
    "Auckland City FC": "Auckland City",
    "Espérance Sportive de Tunis": "Espérance de Tunis",
    "Mamelodi Sundowns F.C.": "Mamelodi Sundowns",
    "Athletic Club (MG)": "Athletic Club-MG",
    "Hiroshima Sanfrecce FC": "Sanfrecce Hiroshima",
    "Shelbourne Dublin": "Shelbourne",
    "D.C. United": "DC United",
    "Hammarby IF": "Hammarby",
    "IFK Värnamo": "IFK Varnamo",
    "Amazonas FC": "Amazonas",
    "Grêmio Novorizontino": "Novorizontino",
    "KuPS Kuopio": "KuPS",
    "Botafogo": ["Botafogo-SP", "Botafogo"],
  };

  const tryFetchTeamId = async (teamName) => {
  const nameOptions = teamNameFixes[teamName] || [teamName];

  for (const name of nameOptions) {
    const encodedTeam = encodeURIComponent(name);
    try {
      const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodedTeam}`);
      const data = await response.json();

      if (data.teams && data.teams.length > 0) {
        return data.teams[0].idTeam;
      }
    } catch (error) {
      console.error(`Error fetching team: ${name}`, error);
    }
  }

  return null;
};

  useEffect(() => {
    if (homeTeamNames.length === 0) return;
    const fetchIds = async () => {
      const newIds = [];

      for (const team of homeTeamNames) {
        const fixedTeam = teamNameFixes[team] || team;

        const encodedTeam = encodeURIComponent(fixedTeam);
        // console.log("fixed N encoded ", encodedTeam)
        try {
          const fullTeamName = fixedTeam;
          let teamId = await tryFetchTeamId(fullTeamName);

          if (!teamId) {
            // אם לא נמצא לפי השם המלא – ננסה לפי מילה בודדת
            const words = fullTeamName.split(" ");
            if (words.length > 1) {
              const partialTeamName = words[words.length - 1]; // ניקח את המילה האחרונה
              teamId = await tryFetchTeamId(partialTeamName);
            }
          }
          if (teamId) {
            newIds.push(teamId);
          } else {
            console.error(`Team not found: ${fullTeamName}`);
          }

        } catch (error) {
          console.error(`ERORR ON THE TEAM : ${team}`, error);
        }

      }
      console.log(newIds)
      setId(newIds);
    };

    fetchIds();
  }, [homeTeamNames]);

  useEffect(() => {
    if (id.length === 0) return;
    console.log("ID >>> ", id)
    const fetchLastGames = async () => {
      try {
        const gamePromises = id.map(idNum =>
          fetch(`https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${idNum}`)
            .then(res => res.json())
        );

        const allGameResults = await Promise.all(gamePromises);
        setLast5games(allGameResults);

      } catch (error) {
        console.error("ERROR LINE 120 >", error);
      }
    };
    fetchLastGames();
  }, [id]);

  function normalizeName(name) {
    name = String(name); // המרה למחרוזת
    return name
      .replace(/ä/g, "ae")   // החלפה של ä ב־ ae
      .replace(/å/g, "aa")   // החלפה של å ב־ aa
      .normalize("NFD")                    // מפרק תווים עם סימנים
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\./g, "") // מסיר רק נקודות    // מסיר את הסימנים
      .trim()
      .toLowerCase();
  }

  useEffect(() => {
    if (!last5games || last5games.length !== 5) return;
    console.log("last 5 games >>> ", last5games)
    const allScores = [];

    for (let i = 0, x = 0; i < last5games.length; i++, x++) {
      const results = last5games[i].results;
      if (!results || results.length === 0) continue;
      const [firstTeam, secondTeam] = formData[`match${x + 1}`].split(' VS ');
      const fixedTeam = teamNameFixes[secondTeam] || secondTeam;
      console.log(firstTeam, secondTeam)
      for (let j = 0; j < results.length; j++) {
        // חותך פה כדי להשוות אחר כך בין התאריכים מהAPI ומהטופס
        const dateFromForm = formData[`date${i + 1}`].slice(0, -14);
        console.log("Compering 2 dates >>> ", results[j].dateEvent + ">>" + dateFromForm);
        if (
          results[j].strAwayTeam &&
          (
            normalizeName(results[j].strAwayTeam) === normalizeName(fixedTeam) ||
            normalizeName(fixedTeam).includes(normalizeName(results[j].strAwayTeam))
          )
          && results[j].dateEvent === dateFromForm
        ) {
          const awayS = results[j].intAwayScore;
          const homeS = results[j].intHomeScore;
          console.log("RES : " + homeS + " : " + awayS)
          const newScore = {
            firstTeam: firstTeam.trim(),
            score: homeS > awayS ? "1" : homeS === awayS ? "X" : "2",
            result: homeS + " : " + awayS,
          };

          allScores.push(newScore);
          break;
        }
      }
    }

    setScores(allScores);
  }, [last5games]);

  function normalizeTeamName(name) {
    return name
      .toLowerCase()
      .replace(/club|fc|cd|do/g, '')
      .replace(/\s+/g, '')
      .trim();
  }

  useEffect(() => {
    console.log("line : 2*41", scores)
    if (!formData || scores.length !== 5) return;

    const hasIncorrect = Array.from({ length: 5 }, (_, index) => {
      const match = formData[`match${index + 1}`];
      const result = formData[`result${index + 1}`];
      console.log("line : 246")
      if (!match) return false;

      const [firstTeam] = match.split(' VS ');
      const matchedScore = scores.find((score) => {
        const normalizedScore = normalizeTeamName(score.firstTeam);
        const normalizedForm = normalizeTeamName(firstTeam);
        console.log("line : 253 >")
        return (
          normalizedScore.includes(normalizedForm) ||
          normalizedForm.includes(normalizedScore)
        );
      });
      console.log("RES : " + result + " // " + matchedScore.score)
      return !matchedScore || result.trim() !== matchedScore.score.trim();
    }).some(Boolean);

    if (hasIncorrect) {
      setWon('0');
      console.log("line : 265")
    }
    else {
      setWon('1')
      console.log("line : 269")
    }
  }, [formData, scores]);

  /*
  0 נחשב "שקר" (false)

1 נחשב "אמת" (true)
   */
  useEffect(() => {

    if (won === '') return;

    // setHasSent(true);
    console.log("here >>>>>>>>>>>>>>>>>>>>>>>>> ");
    fetch('http://localhost:8081/auth/checkWin', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, won, points })
    })
      .then(response => response.json())
      .then(data => {
        console.log("msg >>>>>>>>>>>>>>>>>>>>>>>>> ", data);
        if (data.noWin) {
          setMsg(prev => ({ ...prev, lose: data.noWin }));
        }
        if (data.win) {
          setMsg(prev => ({ ...prev, win: data.win }));
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [won]);





  ////////////////חלק 2- הטפסים מהעבר ...//////////////////

  useEffect(() => {
    fetch('http://localhost:8081/auth/get-past-forms', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username })
    })
      .then(response => response.json())
      .then(data => {
        setpastForms(data);
      })
  }, []);

  useEffect(() => {
    console.log("data of past forms >> ", pastForms);
    let won = 0;
    let lose = 0;
    let highScore = 0;
    let highScoreForWin = 0;
    let totalP = 0;
    let totalPwin = 0;
    pastForms.forEach((form) => {
      totalP = Number(totalP) + Number(form.total_price);
      if (form.won)
        won++
      else
        lose++;

      if (highScore < form.total_price)
        highScore = form.total_price

      if (form.won == true) {
        totalPwin = Number(totalPwin) + Number(form.total_price);
        if (highScoreForWin < form.total_price)
          highScoreForWin = form.total_price
      }


    })
    setAvg(parseFloat((won / pastForms.length * 100).toFixed(1)));
    setLoses(lose)
    setWins(won);
    sethighestPoints(highScore);
    sethighestPointsForWin(highScoreForWin);
    setTotalPoints(totalP)
    setTotalWinningPoints(totalPwin)
    console.log("total points >> ", totalP)
  }, [pastForms])
  return (

    <div className='blok'>
      {
        !formData ? (
          <h1>Loading...</h1>
        ) : formData.active !== true ? (
          <h1 className='h1-noForm'>You Haven't Created A Betting Yet ,<Link to={'/Game'} className='link'>GO AND PLAY!</Link></h1>
        ) : (
          <div className='table'>
            <h2 className='user-headline'>{<span style={{ color: 'gold' }}>{username}</span>} , YOUR LAST BETTING STATUS:</h2>
            <table className='checkWin-table'>
              <thead>
                <tr>
                  <th>MATCH :</th>
                  <th>YOUR BET :</th>
                  <th className='result'>RESULT :</th>
                </tr>
              </thead>
              <tbody>
                {
                  Array.from({ length: 5 }, (_, index) => {
                    const match = formData[`match${index + 1}`];
                    const result = formData[`result${index + 1}`];
                    // אם אין טופס למשתמש >>

                    const [firstTeam] = match.split(' VS ');
                    const matchedScore = scores.find((score) => {
                      const normalizedScore = normalizeTeamName(score.firstTeam);
                      const normalizedForm = normalizeTeamName(firstTeam);

                      return (
                        normalizedScore.includes(normalizedForm) ||
                        normalizedForm.includes(normalizedScore)
                      );
                    });
                    const isCorrect = result === matchedScore?.score;

                    return (
                      <tr key={index}>
                        <td>{match}</td>
                        {matchedScore ? (
                          <>
                            <td style={{ color: 'black', backgroundColor: isCorrect ? 'gold' : '#585858' }}>{result}</td>
                            <td style={{ color: 'black', backgroundColor: isCorrect ? 'gold' : '#585858' }}>
                              {matchedScore.score} , ({matchedScore.result})
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ backgroundColor: 'gray' }}>{result}</td>
                            <td style={{ backgroundColor: 'gray' }}>Match on</td>
                          </>
                        )}
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
            <div className="result-message">
              <>
                {msg === null ? (
                  <p>Loading...</p>
                ) : msg.win ? (
                  Swal.fire({
                    icon: 'success',
                    iconColor: 'black',
                    background: 'goldenrod',
                    text: 'Congratulations! Your ticket won!',
                    color: "black",
                    confirmButtonColor: 'gold',
                    showCancelButton: true,
                    confirmButtonText: 'Check Table',
                    cancelButtonText: 'Stay',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      navigate('/Table');
                    }
                  }),
                  <>
                    {msg.win} <Link to="/table" className='links'>Table</Link>, Or Check If You Already Won Some
                    <Link to="/awards" className='links'> Awards!🎁</Link>
                  </>
                ) : msg.lose ? (
                  Swal.fire({
                    title: '🫤 You Lost 🫤',
                    text: 'Lets Try Again!',
                    background: 'black',
                    showCancelButton: true,
                    confirmButtonText: 'Play Again!',
                    confirmButtonColor: 'gold',
                    color: 'white',
                    cancelButtonText: 'Next time',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      navigate('/Game');
                    }
                  }),
                  <>
                    {msg.lose} <Link to="/Game" className='links'>play again?</Link>
                  </>
                ) : (
                  <>
                    <p style={{ fontWeight: '100' }}>Wait Until All The Games Finished.</p>
                  </>
                )}

              </>
            </div>
          </div>
        )
      }
      <div className="blok2">
        <div className="headline-history">
          <h2>Latest Submitted Bets ..🔎</h2>
        </div>
        <div className="left-forms size">
          <h4 className="headline-left sizeHeads">Your Bets History🗒️</h4>
          <div className="thePastforms">
            {!formData ? (
              <p>Loading...</p>
            ) : (pastForms.length === 0) ? (
              <div className='no-history'>You have no betting history yet.</div>
            ) : (
              <>
                <label htmlFor='check' className='checkBox-title'>
                  Show Winning Bets Only
                </label>
                <input type='checkbox' className='big-checkbox' id='check' checked={check}
                  onChange={() => setCheck(prev => !prev)} />
                <div className="past-form-blok">
                  {
                    check === false ? (
                      pastForms.length > 0 && pastForms.slice().reverse().map((form, index) => {
                        console.log("len >>>>>>>>>>>> " + pastForms.length);

                        const s = form['created_at'];
                        const [date, timeWithMs] = s.split('T');
                        const time = timeWithMs.split('.')[0];

                        const match1 = form['match1'];
                        const match2 = form['match2'];
                        const match3 = form['match3'];
                        const match4 = form['match4'];
                        const match5 = form['match5'];
                        const result1 = form['result1'];
                        const result2 = form['result2'];
                        const result3 = form['result3'];
                        const result4 = form['result4'];
                        const result5 = form['result5'];
                        const won = form['won'];
                        const wonStr = won.toString().toUpperCase();

                        return (
                          <div key={index} className='past-form-div'>
                            <span className='dateNtime'>🗓️: {date} , {time}</span> <br />
                            <span className='mtc'>⚽️: {match1} </span><br />
                            <span>Your Bet: {result1}</span><br />
                            <span className='mtc'>⚽️: {match2} </span><br />
                            <span>Your Bet: {result2}</span><br />
                            <span className='mtc'>⚽️: {match3} </span><br />
                            <span>Your Bet: {result3}</span><br />
                            <span className='mtc'>⚽️: {match4} </span><br />
                            <span>Your Bet: {result4}</span><br />
                            <span className='mtc'>⚽️: {match5} </span><br />
                            <span>Your Bet: {result5}</span><br /><br />
                            <span className='won' style={{ color: wonStr === 'TRUE' ? 'gold' : 'gray' }}>🏆: {wonStr}</span>
                          </div>
                        );
                      })
                    ) : (
                    pastForms.length > 0  &&pastForms.slice().reverse().map((form, index) => {
                    console.log("len >>>>>>>>>>>> " + pastForms.length);
                    if(!form.won)return ;
                    const s = form['created_at'];
                    const [date, timeWithMs] = s.split('T');
                    const time = timeWithMs.split('.')[0];

                    const match1 = form['match1'];
                    const match2 = form['match2'];
                    const match3 = form['match3'];
                    const match4 = form['match4'];
                    const match5 = form['match5'];
                    const result1 = form['result1'];
                    const result2 = form['result2'];
                    const result3 = form['result3'];
                    const result4 = form['result4'];
                    const result5 = form['result5'];
                    const won = form['won'];
                    const wonStr = won.toString().toUpperCase();

                    return (
                      <div key={index} className='past-form-div'>
                        <span className='dateNtime'>🗓️: {date} , {time}</span> <br />
                        <span className='mtc'>⚽️: {match1} </span><br />
                        <span>Your Bet: {result1}</span><br />
                        <span className='mtc'>⚽️: {match2} </span><br />
                        <span>Your Bet: {result2}</span><br />
                        <span className='mtc'>⚽️: {match3} </span><br />
                        <span>Your Bet: {result3}</span><br />
                        <span className='mtc'>⚽️: {match4} </span><br />
                        <span>Your Bet: {result4}</span><br />
                        <span className='mtc'>⚽️: {match5} </span><br />
                        <span>Your Bet: {result5}</span><br /><br />
                        <span className='won' style={{ color: wonStr === 'TRUE' ? 'gold' : 'gray' }}>🏆: {wonStr}</span>
                      </div>
                    );
                  })
                    )
                  }

                </div>
              </>
            )}
          </div>

        </div>
        <div className="right-data size">
          <h4 className="headline-right sizeHeads">Percents & Numbers📊</h4>
          <div className="thePastPercNum">
            {!formData ? (
              <p>Loading...</p>
            ) : (pastForms.length === 0) ? (
              <div className='no-history'>You have no Percents & Numbers history yet.</div>
            ) : (
              <div className='past-perc-blok'>
                <div className="avg-wins"> {avg}% <div>WIN RATE.</div> </div>
                <div className="total-past-forms">TOTAL BETS : <b>{pastForms.length}</b> </div>
                <div className="total-wins"><p>TOTAL WINS : <b>{wins}</b> </p><p>TOTAL LOSES : <b>{loses}</b></p> </div>
                <div className="perc-blok-divs">HIGHEST POINTS FOR BETTING : <b>{highestPoints}</b> </div>
                <div className="perc-blok-divs">HIGHEST POINTS FOR <b style={{ color: 'gold' }}>WIN</b> : <b>{highestPointsForWin}</b> </div>
                <div className="perc-blok-divs">TOTAL BETTING POINTS : <b>{totalPoints}</b> </div>
                <div className="perc-blok-divs">TOTAL <b style={{ color: 'gold' }}>WINNIG</b> POINTS : <b>{totalWinningPoints}</b> </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckWinPage