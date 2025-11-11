import React from 'react'
import { Link } from 'react-router-dom'
// import '../styles/register.css'
import './login.css'
import Swal from 'sweetalert2';
import { useContext, useState } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [read, setRead] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();


    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const first_name = document.getElementById("first_name").value;
    const email = document.getElementById("email").value;
    const last_name = document.getElementById("last_name").value;

    try {
      console.log("enterd >>>")
      if (!username || !password || !first_name || !email || !last_name) {
        Swal.fire({
          icon: 'warning',
          iconColor: 'red',
          text: 'YOU NEED TO FILL ALL THE FORM.',
          timer: 2000,
          background: 'black',
          color: "white",
          showConfirmButton: false,
        });
        return;

      }
      if (read === false) {
        Swal.fire({
          icon: 'warning',
          iconColor: 'red',
          text: 'Please read and accept the terms of use.',
          timer: 2000,
          background: 'black',
          color: "white",
          showConfirmButton: false,
        });
        return;
      }
      const res = await fetch("https://matchup-back-10-11-2025.onrender.com/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, first_name, last_name, email, password })
      });
      const data = await res.json();
      console.log("data >>>>>>>>>> ", data)

      if (res.ok) {
        const dl = { logedName: username };
        localStorage.setItem('logedName', JSON.stringify(dl));
        setUser(username);
        Swal.fire({
          icon: 'success',
          text: `WELCOME TO MATCHUP ,${username} !`,
          timer: 2500,
          background:'black',
          showConfirmButton: false,
        }).then(() => {
          navigate('/');
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: data.msg,
          timer: 2500,
        });
        return;
      }
    } catch (err) {
      console.log("Error line 32: " + err.message);
    }
  };

  return (
    <div className='signup template d-flex justify-content-center align-item-center vh-100 p-5'>
      <div className='form_container rounded shadow p-3 mb-5 formBody' style={{ height: '88%' }}>
        <form onSubmit={handleRegister}>
          <h3 className='text-center' style={{ color: 'goldenrod', fontWeight: '200' }}>SIGN UP</h3>

          <div className='mb-2'>
            <label for="firstname">First name</label>
            <input type='text' placeholder='Enter First Name' className='form-control' id="first_name" name="first_name" />
          </div>

          <div className='mb-2'>
            <label for="lastname">Last name</label>
            <input type='text' placeholder='Enter Last Name' className='form-control' id="last_name" name="last_name" />
          </div>

          <div className='mb-2'>
            <label for="email">Email</label>
            <input type='email' placeholder='Enter Email' className='form-control' id="email" name="email" />
          </div>

          <div className='mb-2'>
            <label for="username">User Name :</label>
            <input type='text' placeholder='Creat your Nickname ' className='form-control' id="username" name="username" />
          </div>

          <div className='mb-2'>
            <label for="password">Password</label>
            <input type='password' placeholder='Enter Password' className='form-control' id="password" name="password" />
          </div>

          <div className='mb-2'>
            <input type='checkbox' className='custom-control custom-checkbox' id='check' checked={read}
              onChange={() => setRead(prev => !prev)} />
            <label htmlFor='check' className='custom-input-label ms-2'>
             <a href="http://" target="_blank" rel="noreferrer">terms and conditions</a> 
            </label>
          </div>

          <div className='d-grid'>
            <button className='btn' style={{ background: '#198754', color: 'white' }} type='submit'>
              Sign up
            </button>
          </div>
          <p className='text-right mt-2'>
            Already have user ?<Link to="/login" className='ms-2' style={{ color: 'goldenrod' }}>Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
