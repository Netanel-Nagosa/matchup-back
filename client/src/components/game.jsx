import React, { useEffect, useState } from "react";
import "./game.css";
import LeaguePage from "./LeaguePage";

export default function Game() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState({ key: "", title: "" });

  const fetchSoccerLeagues = async () => {
    try {
      const res = await fetch(`https://matchup-back-10-11-2025.onrender.com/api/sports`);
      const data = await res.json();

      const soccerTitles = Object.values(data)
        .filter(el => el && el.group === "Soccer")
        .sort((a, b) => a.title.localeCompare(b.title));

      setLeagues(soccerTitles);
    } catch (err) {
      console.error("Error fetching soccer leagues:", err);
    }
  };

  // ואז לקרוא לפונקציה
  useEffect(() => {
    fetchSoccerLeagues();
  }, []);

  const handleChange = (e) => {
    const selectedKey = e.target.value;
    const selectedOption = leagues.find(league => league.key === selectedKey);
    if (selectedOption) {
      setSelectedLeague({
        key: selectedOption.key,
        title: selectedOption.title,
      });
    }
    console.log("selected leg KEY : ", selectedLeague)
  };

  return (
    <div className="gameBox">
      <div className='App'>
        <select className="selectDiv" onChange={handleChange} defaultValue="">
          <option value="" disabled>Select League / Competition ..</option>
          {leagues.map((league) => (
            <option key={league.key} value={league.key}>
              {league.title}
            </option>
          ))}
        </select>
      </div>

      <LeaguePage leagueKey={selectedLeague.key} leagueTitle={selectedLeague.title} />
    </div>
  );
}
