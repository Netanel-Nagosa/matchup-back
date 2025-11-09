import React, { useState, useEffect } from 'react';
import '../styles/checkWin.css';
import { Link, useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';

function CheckWinPage() {
  const [formData, setFormData] = useState(null);
  const [id, setId] = useState([]);
  const [homeTeamNames, setHomeTeamNames] = useState([]);
  // const [awayTeamNames, setAwayTeamNames] = useState([]);
  const [last5games, setLast5games] = useState([]);
  const [scores, setScores] = useState([]);
  const [won, setWon] = useState('');
  const [pastForms, setPastForms] = useState([]);
  // const [msg, setMsg] = useState({ win: null, lose: null });
  // const [avg, setAvg] = useState('');
  // const [wins, setWins] = useState('');
  // const [loses, setLoses] = useState('');
  // const [highestPoints, setHighestPoints] = useState('');
  // const [highestPointsForWin, setHighestPointsForWin] = useState('');
  // const [totalPoints, setTotalPoints] = useState(0);
  // const [totalWinningPoints, setTotalWinningPoints] = useState(0);
  const [points, setPoints] = useState(0);
  // const [check, setCheck] = useState(false);

  const loggedUserString = localStorage.getItem('logedName');
  const loggedUser = loggedUserString ? JSON.parse(loggedUserString) : null;
  const username = loggedUser?.logedName;

  const navigate = useNavigate();

  // Fetch current form
  useEffect(() => {
    if (!username) return;

    fetch('http://localhost:8081/auth/get-form', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    })
      .then(res => res.json())
      .then(data => setFormData(data && data.length > 0 ? data[0] : null))
      .catch(err => console.error('Error fetching form:', err));
  }, [username]);

  // Extract home/away team names from form
  useEffect(() => {
    if (!formData || !formData.active) return;

    const homeNames = [];
    const awayNames = [];
    setPoints(formData.total_price || 0);

    Object.keys(formData).forEach(key => {
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
    // setAwayTeamNames(awayNames);
  }, [formData]);

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
    "Newells Old Boys": "Newell's Old Boys",
    "Talleres": "Talleres de Córdoba",
    "Belgrano de Cordoba": "Belgrano",
    "Ħamrun Spartans FC": "Ħamrun Spartans",
    "Pafos FC": "Pafos",
    "SV Zulte-Waregem": "Zulte Waregem",
    "Atlanta United FC": "Atlanta United",
    "Leuven": "Oud-Heverlee Leuven",
    "Minnesota United FC": "Minnesota United",
  };

  const tryFetchTeamId = async (teamName) => {
    const names = Array.isArray(teamNameFixes[teamName]) ? teamNameFixes[teamName] : [teamNameFixes[teamName] || teamName];
    for (const name of names) {
      try {
        const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(name)}`);
        const data = await res.json();
        if (data.teams && data.teams.length > 0) return data.teams[0].idTeam;
      } catch (err) {
        console.error(`Error fetching team ${name}:`, err);
      }
    }
    return null;
  };

  // Fetch team IDs for home teams
  useEffect(() => {
    if (homeTeamNames.length === 0) return;

    const fetchIds = async () => {
      const newIds = [];
      for (const team of homeTeamNames) {
        let teamId = await tryFetchTeamId(team);
        if (!teamId) {
          const words = team.split(' ');
          if (words.length > 1) teamId = await tryFetchTeamId(words[words.length - 1]);
        }
        if (teamId) newIds.push(teamId);
      }
      setId(newIds);
    };

    fetchIds();
  }, [homeTeamNames]);

  // Fetch last 5 games per team
  useEffect(() => {
    if (id.length === 0) return;

    const fetchGames = async () => {
      try {
        const gameResults = await Promise.all(id.map(idNum =>
          fetch(`https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${idNum}`).then(res => res.json())
        ));
        setLast5games(gameResults);
      } catch (err) {
        console.error("Error fetching last games:", err);
      }
    };

    fetchGames();
  }, [id]);

  const normalizeName = (name) => {
    return String(name)
      .replace(/ä/g, "ae")
      .replace(/å/g, "aa")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\./g, "")
      .trim()
      .toLowerCase();
  };

  // Compare scores
  useEffect(() => {
    if (!last5games || last5games.length === 0 || !formData) return;

    const allScores = [];

    last5games.forEach((teamGames, i) => {
      const results = teamGames.results;
      if (!results || results.length === 0) return;
      const [firstTeam, secondTeam] = formData[`match${i + 1}`].split(' VS ');
      const fixedTeam = teamNameFixes[secondTeam] || secondTeam;

      for (const game of results) {
        const dateFromForm = formData[`date${i + 1}`]?.slice(0, -14);
        if (!game.strAwayTeam || game.dateEvent !== dateFromForm) continue;

        if (
          normalizeName(game.strAwayTeam) === normalizeName(fixedTeam) ||
          normalizeName(fixedTeam).includes(normalizeName(game.strAwayTeam))
        ) {
          allScores.push({
            firstTeam: firstTeam.trim(),
            score: game.intHomeScore > game.intAwayScore ? "1" : game.intHomeScore === game.intAwayScore ? "X" : "2",
            result: `${game.intHomeScore} : ${game.intAwayScore}`
          });
          break;
        }
      }
    });

    setScores(allScores);
  }, [last5games, formData]);

  const normalizeTeamName = (name) => name.toLowerCase().replace(/club|fc|cd|do/g, '').replace(/\s+/g, '').trim();

  // Determine if user won
  useEffect(() => {
    if (!formData || scores.length !== 5) return;

    const hasIncorrect = Array.from({ length: 5 }).some((_, i) => {
      const match = formData[`match${i + 1}`];
      const result = formData[`result${i + 1}`];
      if (!match) return false;

      const [firstTeam] = match.split(' VS ');
      const matchedScore = scores.find(score => normalizeTeamName(score.firstTeam).includes(normalizeTeamName(firstTeam)) || normalizeTeamName(firstTeam).includes(normalizeTeamName(score.firstTeam)));
      return !matchedScore || result.trim() !== matchedScore.score.trim();
    });

    setWon(hasIncorrect ? '0' : '1');
  }, [formData, scores]);

  // Send result to server
  useEffect(() => {
    if (!won) return;

    fetch('http://localhost:8081/auth/checkWin', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, won, points })
    })
      .then(res => res.json())
      // .then(data => setMsg({ win: data.win || null, lose: data.noWin || null }))
      .catch(err => console.error('Error sending win info:', err));
  }, [won, username, points]);

  // Fetch past forms
  useEffect(() => {
    if (!username) return;

    fetch('http://localhost:8081/auth/get-past-forms', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    })
      .then(res => res.json())
      .then(setPastForms)
      .catch(err => console.error(err));
  }, [username]);

  // Calculate stats
  useEffect(() => {
    if (!pastForms || pastForms.length === 0) return;

    let wonCount = 0, loseCount = 0, highScore = 0, highScoreForWin = 0, totalP = 0, totalPwin = 0;

    pastForms.forEach(form => {
      totalP += Number(form.total_price || 0);
      if (form.won) {
        wonCount++;
        totalPwin += Number(form.total_price || 0);
        if (form.total_price > highScoreForWin) highScoreForWin = form.total_price;
      } else {
        loseCount++;
      }
      if (form.total_price > highScore) highScore = form.total_price;
    });

    // setAvg(parseFloat(((wonCount / pastForms.length) * 100).toFixed(1)));
    // setWins(wonCount);
    // setLoses(loseCount);
    // setHighestPoints(highScore);
    // setHighestPointsForWin(highScoreForWin);
    // setTotalPoints(totalP);
    // setTotalWinningPoints(totalPwin);
  }, [pastForms]);

  return (
    <div className='blok'>
      {!formData ? (
        <h1>Loading...</h1>
      ) : !formData.active ? (
        <h1 className='h1-noForm'>You Haven't Created A Betting Yet ,<Link to={'/Game'} className='link'>GO AND PLAY!</Link></h1>
      ) : (
        <div className='table'>
          <h2 className='user-headline'><span style={{ color: 'gold' }}>{username}</span> , YOUR LAST BETTING STATUS:</h2>
          <table className='checkWin-table'>
            <thead>
              <tr>
                <th>MATCH :</th>
                <th>YOUR BET :</th>
                <th className='result'>RESULT :</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => {
                const match = formData[`match${i + 1}`];
                const result = formData[`result${i + 1}`];
                if (!match) return null;

                const [firstTeam] = match.split(' VS ');
                const matchedScore = scores.find(score => normalizeTeamName(score.firstTeam).includes(normalizeTeamName(firstTeam)) || normalizeTeamName(firstTeam).includes(normalizeTeamName(score.firstTeam)));
                const isCorrect = result === matchedScore?.score;

                return (
                  <tr key={i}>
                    <td>{match}</td>
                    <td style={{ color: 'black', backgroundColor: isCorrect ? 'gold' : '#585858' }}>{result}</td>
                    <td style={{ color: 'black', backgroundColor: isCorrect ? 'gold' : '#585858' }}>{matchedScore?.score} , ({matchedScore?.result})</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* ... המשך הצגת msg, pastForms וסטטיסטיקות ... */}
        </div>
      )}
    </div>
  );
}

export default CheckWinPage;
