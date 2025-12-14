
const serverAddr = "http://localhost:3000";

const loginBtn = document.getElementById("Login");
const username = document.getElementById("Username");
const password = document.getElementById("Password");

const alertBox = document.getElementById("aleart-box");

localStorage.removeItem('token');

const toggleEyes = document.querySelectorAll('.toggle-eye');

toggleEyes.forEach(eye => {
    eye.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const inputPass = document.getElementById(targetId);
        // สลับ type ของ input
        const type = inputPass.getAttribute('type') === 'password' ? 'text' : 'password';
        inputPass.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
        this.classList.toggle('fa-eye');   
    });
});

async function login() {
    try {
        const res = await fetch(`${serverAddr}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username.value, password: password.value})
        });
        const data = await res.json();
        if(!res.ok) {
            console.error("Login error:", data.message);
            alertBox.style.display = "block";
            username.classList.add('invalid');
            password.classList.add('invalid');
            return;
        }
        localStorage.setItem('token', data.token);
        window.location.href = "Home.html";
    } catch(err) {
        console.error(err);
        alertBox.style.display = "block";
        username.classList.add('invalid');
        password.classList.add('invalid');
    }
}


loginBtn.addEventListener('click', ()=>{
    if (username.value && password.value){
        login();
    }
});

