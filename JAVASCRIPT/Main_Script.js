const popUpMain = document.getElementById("profile-pop-up-main");
const serverAddr = "http://localhost:3000";

fetch(`${serverAddr}/test-post`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username: "testUser", password: "testPass" })
})
.then(response => response.json())
.then(data => console.log(data.message))
.catch(err => console.error(err));

function openPopup(){
    popUpMain.style.display = "flex";
}

function closePopup(){
    popUpMain.style.display = "none";
}