
//Server setup
const serverAddr = "http://localhost:3000";
localStorage.removeItem('token');
// Input Element
const enterEmail = document.getElementById('Entermail')
const enterUsername = document.getElementById('Enteruser')
const enterPassword = document.getElementById('password')
const enterConPass = document.getElementById('confirmpassword')
const signBtn = document.getElementById('sign_in')
const termCheck = document.getElementById('term-check')
const arr = [enterEmail, enterUsername, enterPassword, enterConPass]
// Error Input show
const inputErrList = ['Password must be at least 8 characters long.',
    'Password must contain at least one number.',
    'Username must be at least 3 characters long.',
    'Username can only contain letters, numbers, and underscores.',
    'Username cannot contain spaces.',
    'This username is already exists.',
]

const emailErr = document.getElementById('email-err')
const usernameErr = document.getElementById('username-err')
const passwordErr = document.getElementById('password-err')
const confirmErr = document.getElementById('confirm-err')
const termErr = document.getElementById('term-err')

const arrErr = [emailErr, usernameErr, passwordErr, confirmErr]
const checkErr = [0, 0, 0, 0]
let gobalCheck = false

arr.forEach(e => { // Error checking for every inputs
    e.value = ''
    if (e.id == 'Entermail') {
        e.addEventListener('input', () => {
            const email = e.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            checkErr[0] = 1
            if (!emailRegex.test(email)) {
                enterEmail.style.borderColor = "red"
                emailErr.innerText = 'Invalid email format'
                emailErr.classList.add('visible')
                gobalCheck = false
            } else {
                enterEmail.style.borderColor = "#77ff72ff"
                emailErr.classList.remove('visible')
                gobalCheck = true
            }
        })
    }

    else if (e.id == 'Enteruser') {
        e.addEventListener('input', () => {
            const username = e.value;
            const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
            checkErr[1] = 1
            if (!usernameRegex.test(username)) {
                enterUsername.style.borderColor = "red"
                usernameErr.innerText = inputErrList[3]
                if (username.length < 3) usernameErr.innerText = inputErrList[2]
                usernameErr.classList.add('visible')
                gobalCheck = false
            } else {
                enterUsername.style.borderColor = "#77ff72ff"
                usernameErr.classList.remove('visible')
                gobalCheck = true
            }
        })
    }
    else if (e.id == 'password') {
        e.addEventListener('input', () => {
            const pass = e.value;
            checkErr[2] = 1
            if (pass.length < 8) {
                enterPassword.style.borderColor = 'red'
                passwordErr.innerText = inputErrList[0]
                passwordErr.classList.add('visible')
                gobalCheck = false
            }
            else if (!/[0-9]/.test(pass)) {
                enterPassword.style.borderColor = 'red'
                passwordErr.innerText = inputErrList[1]
                passwordErr.classList.add('visible')
                gobalCheck = false
            }
            else {
                enterPassword.style.borderColor = "#77ff72ff"
                passwordErr.classList.remove('visible')
                gobalCheck = true
            }
        })
    } else if (e.id == 'confirmpassword') {
        e.addEventListener('input', () => {
            const confirm = e.value;
            checkErr[3] = 1
            if (confirm != enterPassword.value || confirm == '') {
                enterConPass.style.borderColor = 'red'
                confirmErr.innerText = 'Password do not match'
                confirmErr.classList.add('visible')
                gobalCheck = false
            } else {
                enterConPass.style.borderColor = "#77ff72ff"
                confirmErr.classList.remove('visible')
                gobalCheck = true
            }
        })
    }
})

// Post new user to server function

async function sendUser() {
    try {
        const userDetail = [enterEmail.value, enterUsername.value, enterPassword.value]

        const result = await fetch(`${serverAddr}/signIn`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: userDetail[0],
                username: userDetail[1],
                userpass: userDetail[2]
            })
        })

        const data = result.json();

        if (!result.ok) {
            enterUsername.style.borderColor = "red"
            usernameErr.innerText = inputErrList[5]
            usernameErr.classList.add('visible')
            console.log(data.message)
            return false
        } else {
            console.log(data.message)
            usernameErr.classList.remove('visible')
            return true
        }
    }
    catch (err) {
        console.error(err)
        return false
    }
}


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

//---------------------------------


// Login function
async function login() {
    try {
        const res = await fetch(`${serverAddr}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: enterUsername.value, password: enterPassword.value})
        });
        const data = await res.json();
        if(!res.ok) {
            console.error("Login error:", data.message);
            return;
        }
        localStorage.setItem('token', data.token);
        window.location.href = "Home.html";
    } catch(err) {
        console.error(err);
    }
}




//---------------------------------


// Sign button
signBtn.addEventListener('click', async () => {
    if (gobalCheck && termCheck.checked) {
        termErr.classList.remove('visible')
        const send_signin = await sendUser()
        if(!send_signin) return
        await login()
    } else {
        if (!termCheck.checked) {
            termErr.classList.add('visible')
        }
        checkErr.forEach((e, i) => {
            if (e == 0) {
                arrErr[i].innerText = 'Require'
                arrErr[i].classList.add('visible')
            }
        })
        console.log("No")
    }
})