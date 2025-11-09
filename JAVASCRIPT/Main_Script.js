const popUpMain = document.getElementById("profile-pop-up-main");
const server = "http://localhost:3000";

console.log(fetch(server + "/test").then(response => response.text()).then(data => console.log(data)));

function openPopup(){
    popUpMain.style.display = "flex";
}

function closePopup(){
    popUpMain.style.display = "none";
}