import React, { useEffect, useState } from "react";
import "./game.css";
import LeaguePage from "./LeaguePage";

export default function Game() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState({ key: "", title: "" });

  useEffect(() => {
    fetch(`https://api.the-odds-api.com/v4/sports/?daysFrom=1&apiKey=0613db6638dbe8a7727b4d16ca62bca1`)
      .then(res => res.json())
      .then(data => {
        const soccerTitles = Object.values(data)
          .filter(el => el && el.group === "Soccer")
          .sort((a, b) => a.title.localeCompare(b.title));
        setLeagues(soccerTitles); 
      });
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
    console.log("selected leg KEY : ",selectedLeague)
  };
  
  return (
    <div className="gameBox">
      <div className='App'>
        <select className="selectDiv" onChange={handleChange} defaultValue="">
          <option value="" disabled>Select League / Competition ..</option>
          { leagues.map((league) => (
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
