import React from 'react'
import '../styles/home.css'
import { Link } from 'react-router-dom'
import Countdown from './countdown'
import img1 from '../images/imgB1.png';
import img2 from '../images/imgB2.png';
import img3 from '../images/imgB3.png';
import img4 from '../images/imgB4.png';
import img5 from '../images/imgB5.png';
import img6 from '../images/imgB6.png';

export default function Home() {
  const loggedUserString = localStorage.getItem('logedName');
  let player = null;

  try {
    const loggedUser = JSON.parse(loggedUserString);
    player = loggedUser?.logedName || null;
  } catch (error) {
    player = null;
  }

  return (
    <div className='home-blok'>
      <div className="matchup-slideShow">
        <div
          id="carouselExampleInterval"
          className="carousel slide h-100"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner h-100">


            {[img1, img2, img3, img4, img5, img6].map((imgSrc, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                data-bs-interval="4000"
              >
                <img
                  src={imgSrc}
                  className="d-block w-100"
                  alt={`img${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="content-overlay">
        <h1>
          MatchUp
        </h1>
        <p>
          Welcome to <strong>Matchup</strong> — a space for sports fans. We
          provide you with the best Football betting games.
        </p>

        {player === null ? (
          <>
            <Link to="/register" aria-label="Sign in to your account">
              <button className="btn btn-primary w-100" style={{ maxWidth: '200px' }}>Join Now !</button>
            </Link>
          </>
        ) : null}

      </div>
      <div className="info-words">
        What do you think about a double ticket to the Champions League final 🎟️? Or a brand new iPhone 16📱?
        Play now and you could win tons of awesome prizes for FREE!</div>
      <div className="info-cards shadow">
        <div className="card shadow">
          <div className="text-center p-3">
            <i className="bi bi-windows" style={{ fontSize: "2rem" }}></i>
            <h5>Play Everywhere!</h5>
            <p>Download on PC/Phone</p>
            <a href="about:blank" target='_blank'><button className="btn btn-secondary">Download Now</button></a>
          </div>
        </div>
        <div className="card shadow">
          <div className="text-center p-3">
            <i className="bi bi-trophy" style={{ fontSize: "2rem" }}></i>
            <h5>Price every month!</h5>
            <p>Play your way to the top</p>
            <Link to='/howToPlay'><button className="btn btn-secondary">How to play?</button></Link>
          </div>
        </div>
        <div className="card shadow">
          <div className="text-center p-3">
            <i className="bi bi-people" style={{ fontSize: "2rem" }}></i>
            <h5>Stay in touch!</h5>
            <p>follow us on all platforms</p>
            <a href="https://www.tiktok.com/he-IL/" target='#'><button className="btn btn-link icons" style={{ color: 'goldenrod' }}><i className="bi bi-tiktok"></i></button></a>
            <a href="https://www.facebook.com/" target='#'><button className="btn btn-link icons" style={{ color: 'goldenrod' }}><i className="bi bi-facebook"></i></button></a>
            <a href="https://www.instagram.com/" target='#'><button className="btn btn-link icons" style={{ color: 'goldenrod' }}><i className="bi bi-instagram"></i></button></a>
            <a href="https://www.x.com/" target='#'><button className="btn btn-link icons" style={{ color: 'goldenrod' }}><i className="bi bi-twitter"></i></button></a>
            <a href="https://www.youtube.com/" target='#'><button className="btn btn-link icons" style={{ color: 'goldenrod' }}><i className="bi bi-youtube"></i></button></a>
          </div>
        </div>
      </div>
      <Countdown />
    </div>
  )
}
