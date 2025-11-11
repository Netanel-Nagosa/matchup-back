import React from 'react'
import "./login.css"
import { useContext } from 'react';
import { UserContext } from './UserContext';
import Swal from 'sweetalert2';

import { Link } from 'react-router-dom'

// נעצר כאן , 18/6, לעצב את לוגין ואת רג'יסטר ולעבור על הדברים הרשומים בפלאפון
export default function Login() {
  // const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const handleLogin = async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      if (!username || !password) {
        Swal.fire({
          icon: 'warning',
          text: 'YOU NEED TO FILL ALL THE FORM.',
          background:"black",
          color:"white",
          timer: 2500,
          confirmButtonColor:'yellowgreen'
        });
        return;
      }
      const res = await fetch("https://matchup-back-10-11-2025.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        const dl = { logedName: data.username };
        localStorage.setItem('logedName', JSON.stringify(dl));
        setUser(data.username);
        Swal.fire({
          icon: 'success',
          text: `WELCOME BACK , ${dl.logedName} !`,
          background:"black",
          color:"white",
          timer: 2500,
          showConfirmButton: false,
        })
        
      } else {
        Swal.fire({
          icon: 'error',
          iconColor:'crimson',
          text: 'WORNG USERNAME OR PASSWORD .',
          background:"black",
          color:"red",
          timer: 2500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.log("Error line 30: " + err.message);
    }
  };

  return (
    <div className='login template d-flex justify-content-center align-item-center vh-100 p-5'>
      <div className='form_container rounded shadow p-3 mb-5 formBody'>
        <form onSubmit={handleLogin}>
          <div className='text-center'>
            <svg className='mx-auto' xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="goldenrod" class="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
            </svg>
          </div>
          <h3 className='text-center' style={{color:'goldenrod',fontWeight:'200'}}>LOGIN</h3>
          <div className='mb-2'>
            <label for="username" >User name</label>
            <input type='text' placeholder='Enter User name' className='form-control' id="username" name="username" />
          </div>

          <div className='mb-2'>
            <label for="password">Password</label>
            <input type='password' placeholder='Enter Password' className='form-control' id="password" name="password" />
          </div>

          <div className='mb-4'/>

          <div className='d-grid'>
            <button type="submit" className='btn' style={{color:'white',background:'#198754'}}> login </button>
          </div>
          <p className='text-right mt-2'>
            New here ?<Link to="/register" className='ms-2' style={{color:'gold'}}>Sign up !</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
