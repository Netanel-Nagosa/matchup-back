window.onload = function() {
    printingNames();
    
};


const hamburger = document.querySelector('.nav-settings');
const offScreenMenu = document.querySelector('.off-screen-menu');
let x = -1;
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    if (x < 0)
        hamburger.style.color = "#fc72ff"
    else
        hamburger.style.color = "black";
    x = x * -1;
    offScreenMenu.classList.toggle('active');
});
const players = [];
console.log(players)
fetch('http://localhost:8081/auth/getnames')
    .then(response => response.json())
    .then(data => {
        players.push(...data);
        console.log("players :::", players)
        printingNames();
    },[])
    .catch(error => console.error('Error fetching data:', error));
    
//פונקציה שמדפיסה את שמות המדתמדים לטבלת TOP PLAYERS
const printingNames = () => {
    const usersNames = document.querySelector('.usersNames');
    usersNames.innerHTML = "";
    let counter = 1;
    let logedName;
    logedName = players[players.length-1].logedName;
    players.forEach(player => {
        const h21 = document.createElement('h4');
        h21.textContent = counter + ") " + player.username;
        usersNames.append(h21);
        counter++;
        if(logedName === player.username){
            h21.style.backgroundColor="gold";
            h21.style.color="black";
        }
    })
}



