import React, { useContext, useState } from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Game from "./components/game";
import Myform from "./components/myform";
import TablePage from "./components/tablePage";
import Home from "./components/home";
import AuthToken from "./components/authToken";
import CheckToken from "./components/checkToken";
import CheckWinPage from "./components/checkWinPage";
import Prize from "./components/prize";
import About from "./components/about";
import Profile from "./components/profile";
import Howtoplay from "./components/howtoplay";
import Swal from "sweetalert2";
import { UserContext, UserProvider } from "./components/UserContext";

function AppContent() {
  const { user, setUser } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "LAST CHANCE TO STAY ?",
      icon: "question",
      iconColor: "goldenrod",
      background: "black",
      color: "white",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "goldenrod",
      confirmButtonText: "LOG OUT ANYWAY",
      cancelButtonText: "KEEP PLAYING",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log("New App.js loaded")
          const res = await fetch(
            "https://matchup-back-10-11-2025.onrender.com/auth/matchup",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            }
          );
          const data = await res.json();
          if (res.ok) {
            localStorage.removeItem("logedName");
            localStorage.removeItem("token");
            setUser(null);
            window.location.href = "/login";
          } else {
            console.log("Logout failed:", data.msg);
          }
        } catch (err) {
          console.log("Error in logout:", err.message);
        }
      }
    });
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <>
      <header className="container-fluid p-3 backGDimonds">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            {/* לוגו */}
            <div className="col-4 col-md-2 logo">
              <Link to="/" style={{ color: "white" }}>
                Match<span style={{ color: "gold" }}>Up</span>
              </Link>
            </div>

            {/* ניווט רגיל במסך גדול */}
            <nav className="col-md-8 d-none d-md-flex justify-content-center ">
              <ul className="d-flex gap-4 align-items-center mb-0 ps-0">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link active-link" : "nav-link"
                  }
                  to="/checkWin"
                >
                  <li style={{ color: "gold" }}>Check Win</li>
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link active-link" : "nav-link"
                  }
                  to="/Game"
                >
                  <li>Games</li>
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link active-link" : "nav-link"
                  }
                  to="/myform"
                >
                  <li>My Bet</li>
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link active-link" : "nav-link"
                  }
                  to="/table"
                >
                  <li>Table</li>
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link active-link" : "nav-link"
                  }
                  to="/awards"
                >
                  <li>Prizes</li>
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link active-link" : "nav-link"
                  }
                  to="/about"
                >
                  <li>About us</li>
                </NavLink>
              </ul>
            </nav>

            {/* Login/Logout רגיל במסך גדול */}
            <div className="col-md-2 d-none d-md-flex btnLogEX">
              {user ? (
                <>
                  <Link to="/profile" className="custom-btn btn-profile">
                    👤
                  </Link>
                  <button
                    className="custom-btn btn-logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/Login" className="custom-btn btn-login">
                  Login
                </Link>
              )}
            </div>

            {/* המבורגר במסך קטן */}
            <div className="col-8 d-flex d-md-none justify-content-end">
              <button className="hamburger" onClick={toggleMenu}>
                ☰
              </button>
            </div>

            {/* תפריט נפתח במסך קטן */}
            {menuOpen && (
              <nav className="nav-menu d-md-none col-12 mt-2">
                <ul className="d-flex flex-column gap-2 align-items-center mb-0 ps-0">
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active-link" : "nav-link"
                    }
                    to="/checkWin"
                  >
                    <li className="nav-link" style={{ color: "gold" }}>
                      Check Win
                    </li>
                  </NavLink>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active-link" : "nav-link"
                    }
                    to="/Game"
                  >
                    <li
                      className={({ isActive }) =>
                        isActive ? "nav-link active-link" : "nav-link"
                      }
                    >
                      Games
                    </li>
                  </NavLink>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active-link" : "nav-link"
                    }
                    to="/myform"
                  >
                    <li>My Bet</li>
                  </NavLink>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active-link" : "nav-link"
                    }
                    to="/table"
                  >
                    <li>Table</li>
                  </NavLink>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active-link" : "nav-link"
                    }
                    to="/awards"
                  >
                    <li>Prizes</li>
                  </NavLink>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active-link" : "nav-link"
                    }
                    to="/about"
                  >
                    <li>About us</li>
                  </NavLink>
                </ul>
                <div className="btnLogEX mt-3 justify-content-center">
                  {user ? (
                    <>
                      <Link to="/profile" className="custom-btn btn-profile">
                        👤
                      </Link>
                      <button
                        className="custom-btn btn-logout"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link to="/Login" className="custom-btn btn-login">
                      Login
                    </Link>
                  )}
                </div>
              </nav>
            )}
          </div>
        </div>
      </header>

      <Routes>
        <Route index element={<Home />} />
        <Route
          path="/Login"
          element={
            <CheckToken>
              <Login />
            </CheckToken>
          }
        />
        <Route
          path="/register"
          element={
            <CheckToken>
              <Register />
            </CheckToken>
          }
        />
        <Route
          path="/Game"
          element={
              <Game /> 
          }
        />
        <Route
          path="/myform"
          element={
            <AuthToken>
              <Myform />
            </AuthToken>
          }
        />
        <Route
          path="/table"
          element={
            <AuthToken>
              <TablePage />
            </AuthToken>
          }
        />
        <Route
          path="/checkWin"
          element={
            <AuthToken>
              <CheckWinPage />
            </AuthToken>
          }
        />
        <Route
          path="/awards"
          element={
            <AuthToken>
              <Prize />
            </AuthToken>
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/profile"
          element={
            <AuthToken>
              <Profile />
            </AuthToken>
          }
        />
        <Route path="/howToPlay" element={<Howtoplay />} />
      </Routes>

      <footer className="backGDimonds footerDown">
        <div className="container-fluid">
          <div className="container p-3">
            <div className="row d-flex justify-content-evenly">
              <div>
                <p>
                  All rights reserved to Netanel Nagosa and Sharon Rada. This
                  site is not a gambling website. Free access. For phone
                  assistance: *4455 (not available on Saturday).
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
