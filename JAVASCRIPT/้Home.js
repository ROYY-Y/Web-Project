const popUpMain = document.getElementById("profile-pop-up-main");
const serverAddr = "http://localhost:3000";

function openPopup(){
    popUpMain.style.display = "flex";
}

function closePopup(){
    popUpMain.style.display = "none";
}

window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    console.log("Token on home page:", token);
});