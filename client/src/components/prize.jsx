import { use, useEffect, useState } from 'react'
import '../styles/prize.css';
import img1 from '../prizePhotos/img1.png';
import img2 from '../prizePhotos/img2.png';
import img3 from '../prizePhotos/img3.png';
import img4 from '../prizePhotos/img4.jpg';
import img5 from '../prizePhotos/img5.jpg';
import Countdown from './countdown';
import { Link } from 'react-router-dom';

function Prize() {
  const [players, setPlayers] = useState([]);
  const rewards = [
    { name: 'Champions League Final X2 Tickets ', image: img1 },
    { name: 'Iphone 16', image: img2 },
    { name: 'TV Screen 50 Inch', image: img3 },
    { name: 'Mystery Box', image: img4 },
    { name: 'Mystery Box', image: img5 }
  ];

  useEffect(() => {
    fetch('http://localhost:8081/auth/getnames')
      .then(response => response.json())
      .then(data => {
        const filteredPlayers = data
          .filter(player => player.id && player.username && player.points !== undefined)
          .map(player => ({
            id: player.id,
            username: player.username,
            points: player.points
          }));

        setPlayers(filteredPlayers);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    console.log("players >> ", players)
  }, [players])

const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

  return (
    <div className="blokPrize">
      <section>
        <div className="headline">
          <h1>PRIZES🎁</h1>
          <p>The prizes for the upcoming season!
            A new set of prizes every month for five new winners.
            Play and win!</p>
           <span>Think You Won ? Check <Link to={'/'} className='link-prize'>HERE !</Link></span>
        </div>
        <div className="card-first3-blok">
          <>
            {/* מקום ראשון */}
            {rewards[0] && (

              <div className="card1" key={0} aria-label={rewards[0].name}>
                <div
                  className="card-blur-bg"
                  style={{ backgroundImage: `url(${rewards[0].image})` }}
                ></div>
                <a href="https://www.uefa.com/tickets/" target="_blank">
                  <div className="cardInfo">
                    <h1 className="card-title1">FIRST PLACE 🥇</h1>
                    <p className="card-text">{rewards[0].name}</p>
                  </div>
                </a>
              </div>
            )}

            {/* מקום שני ושלישי יחד בתוך card2N3 */}
            <div className="card2N3">
              {[1, 2].map((index) => (
                rewards[index] && (
                  <div className="cardMain2N3" key={index} aria-label={rewards[index].name}>
                    <div
                      className="card-blur-bg"
                      style={{
                        backgroundImage: `url(${rewards[index].image})`,
                      }}
                    ></div>
                    <a target="_blank" href={index === 1 ? 'https://www.apple.com/il/iphone/' : 'https://www.lg.com/il/tv/lg-50ut80006la?utm_campaign=lastcallmay&utm_source=google&utm_medium=cpc&utm_content=oledtv_wave2&utm_content=oledtv&gad_source=1&gad_campaignid=22603346061&gbraid=0AAAAADhlMWfz7mHqxZRTuJwZHRyNN8nL8&gclid=Cj0KCQjw9O_BBhCUARIsAHQMjS5ksmcI6oewFpmU44XHdCfxhyn-TBFB7MeFDxSD37I9G8kAL0BMKH8aAggYEALw_wcB#pdp_where'}>
                      <div className="cardInfo">
                        <h1
                          className="card-title2"
                          style={{ color: index === 2 ? 'rgb(226 132 2)' : undefined }}
                        >
                          {index === 1 ? 'SECOND PLACE 🥈' : 'THIRD PLACE 🥉'}
                        </h1>
                        <p className="card-text">{rewards[index].name}</p>
                      </div>
                    </a>
                  </div>
                )
              ))}
            </div>
          </>

        </div>
        <div className="card-last2-blok">
          {[3, 4].map(index => (
            <div className="card4N5" key={index} aria-label={rewards[index].name}>
              <div
                className="card-blur-bg"
                style={{
                  backgroundImage: `url(${rewards[index].image})`,
                }}
              ></div>
              <a target="_blank" href="https://jerseyniho.com/product/%d7%9e%d7%99%d7%a1%d7%98%d7%a8%d7%99-%d7%91%d7%95%d7%a7%d7%a1/">
                <div className="cardInfo">
                  <h1
                    className="card-title2"
                    style={{ color: '#2d3839', textShadow: '-4px 4px 2px rgba(93, 89, 89, 0.7)' }}
                  >
                    {index === 3 ? 'FORTH PLACE 🎁' : 'FIFTH PLACE 🎁'}
                  </h1>
                  <p className="card-text">{rewards[index].name}</p>
                </div>
              </a>
            </div>
          ))}
          <div className="users-table">
            <h1 className='top5'>TOP 5:</h1>
            <div className="the-table">
              {!players ? (
                <p>loading</p>
              ) : (
                sortedPlayers.slice(0, 5).map((player, index) => {
                  if (index == 0) {
                    return <h2 key={index} style={{ color: "gold" }}>{index+1}) name : {player.username} , points : {player.points}</h2>
                  }
                  if (index == 1) {
                    return <h3 key={index} style={{ color: "silver" }}>{index+1}) name : {player.username} , points : {player.points}</h3>
                  }
                  if (index == 2) {
                    return <h4 key={index} style={{ color: "rgb(226 132 2)" }}>{index+1}) name : {player.username} , points : {player.points}</h4>
                  }
                  if (index == 3) {
                    return <h5 key={index} style={{ color: "#585858" }}>{index+1}) name : {player.username} , points : {player.points}</h5>
                  }
                  if (index == 4) {
                    return <h6 key={index} style={{ color: "#585858" }}>{index+1}) name : {player.username} , points : {player.points}</h6>
                  }
                })
              )}
            </div>
          </div>
        </div>
      </section >
      <Countdown/>
    </div >
  )
}

export default Prize