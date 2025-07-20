import React, { useState, useEffect } from 'react'
import { BsPencilSquare } from 'react-icons/bs';
import '../styles/profile.css'
import { data } from 'react-router-dom';
import Swal from 'sweetalert2';

function Profile() {
    const loggedUserString = localStorage.getItem('logedName');
    const loggedUser = loggedUserString ? JSON.parse(loggedUserString) : null;
    const user = loggedUser.logedName;
    const [refresh, setRefresh] = useState(false);
    const [joinDate, setJoinDate] = useState();

    const forceRerender = () => {
        setRefresh(prev => !prev);
    };;

    const handleUsernameChange = () => {
        const username = document.getElementById("currentUsername").value;
        const newUsername = document.getElementById("newUsername").value;

        fetch('http://localhost:8081/auth/editUsername', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, user, newUsername })
        })
            .then(res => res.json())
            .then(data => {
                if (data.problem) {
                    console.log("problem :: ", data.problem);
                    Swal.fire({
                        icon: 'error',
                        text: data.problem,
                        timer: 3000,
                        color: 'white',
                        background: 'black',
                        confirmButtonColor: 'red'
                    });
                }
                if (data.good) {
                    console.log("all good ! ", data.good);
                    const newUsername = { logedName: document.getElementById("newUsername").value };
                    localStorage.setItem('logedName', JSON.stringify(newUsername));
                    console.log("Updated localStorage to:", newUsername);
                    Swal.fire({
                        icon: 'success',
                        iconColor: 'gold',
                        text: `Update Succesfully , ${newUsername.logedName} !`,
                        timer: 3000,
                        color: 'goldenrod',
                        background: 'black',
                        showConfirmButton: false,
                    }).then(() => {
                        forceRerender();
                    })
                }
            })
            .catch(err => {
                console.log(err);
            });
    };
    const handlePasswordChange = () => {
        const password = document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;

        fetch('http://localhost:8081/auth/editPassword', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ newPassword, password, user })
        })
            .then(res => res.json())
            .then(data => {
                if (data.problem) {
                    console.log("problem :: ", data.problem);
                    Swal.fire({
                        icon: 'error',
                        text: data.problem,
                        timer: 3000,
                        color: 'white',
                        background: 'black',
                        confirmButtonColor: 'red'
                    });
                }
                if (data.good) {
                    console.log("all good ! ", data.good);
                    Swal.fire({
                        icon: 'success',
                        iconColor: 'gold',
                        text: `Yor Password Is Update Succesfully!`,
                        timer: 3000,
                        color: 'goldenrod',
                        background: 'black',
                        showConfirmButton: false,
                    }).then(() => {
                        forceRerender();
                    })
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetch(`http://localhost:8081/auth/getJoinDate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user })
        })
            .then(res => res.json())
            .then(data => {
                if (data.msg) {
                    const onlyDate = data.msg.split("T")[0];
                    setJoinDate(onlyDate)
                }
            })
            .catch(err => {
                console.log(err);
            });

    }, [])

    return (

        <div className='profile'>
            <div className="profile-main rounded shadow-lg" style={{ minWidth: '320px' }}>
                <div className="profile-main-person">
                    <div className="profile-main-person-sticker">
                        <i className="bi bi-person-circle" style={{ marginRight: '0' , }}></i>
                    </div>
                    <div className="profile-main-person-username">
                        <p>Hello , {user}! want to do some changes ?</p>
                    </div>
                </div>
                <div className="profile-main-change">
                    <div className="profile-main-change-old">
                        <label style={{ flex: '1', textAlign: 'left', justifyContent: 'space-around' }}>Current Username:</label>
                        <input className='oldUsername' type="text" placeholder='type your Currently username..' id='currentUsername' />
                    </div>
                    <div className="profile-main-change-new">
                        <label style={{ flex: '1', textAlign: 'left', justifyContent: 'space-around', color:'goldenrod' }}>New Username:</label>
                        <input className='newUsername' type="text" placeholder='type new username..' id='newUsername' />
                    </div>
                    <div className="btnUsername">
                        <button className=" btn btn-success" onClick={handleUsernameChange}>
                            Change Username
                        </button>
                    </div>
                </div>
                <div className="profile-main-change">
                    <div className="profile-main-change-old">
                        <label style={{ flex: '1', textAlign: 'left', justifyContent: 'space-around', }}>Current Password:</label>
                        <input className='oldUsername' type="password" placeholder='type your Currently Password..' id='currentPassword' />
                    </div>
                    <div className="profile-main-change-new">
                        <label style={{ flex: '1', textAlign: 'left', justifyContent: 'space-around', color:'goldenrod'}}>New Password:</label>
                        <input className='newUsername' type="password" placeholder='type new Password..' id='newPassword' />
                    </div>
                    <div className="btnUsername">
                        <button className=" btn btn-success" onClick={handlePasswordChange}>
                            Change Password
                        </button>
                    </div>
                </div>
                <div className="profile-main-details">
                    <div className="profile-main-details-join">
                        Joining Date : {joinDate}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile