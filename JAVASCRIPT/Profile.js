// เชือมกับ back-end -----------------------------------------------------------------------------------

const serverAddr = "http://localhost:3000";

//function สำหรับการเชื่อมต่อกับ back-end

async function profileSend(token) { //ใช้ตอนโหลดเข้าหน้า profile

  try {
    const res = await fetch(`${serverAddr}/profile`, {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${token}`
      }
    })

    const data = await res.json()
    if (!res.ok) {
      console.log(data.message)
      return null
    }
    return data
  }
  catch (err) {
    console.log(err)
    return null
  }
}

async function changePassword(token, oldPass, newPass) {
  try {
    const res = await fetch(`${serverAddr}/profile/changePassword`, {
      method: 'PATCH',
      headers: {
        'authorization': `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        oldPassword: oldPass,
        newPassword: newPass
      })
    })

    const data = await res.json()
    if (!res.ok) {
      console.log(data.message)
      return null
    }
    return data
  }

  catch (err) {
    console.log(err)
    return null
  }
}

async function deleteUser(token) {

  try {
    const res = await fetch(`${serverAddr}/deleteUser`, {
      method: 'DELETE',
      headers: {
        'authorization': `Bearer ${token}`,
      },
    })

    const data = await res.json()
    if (!res.ok) {
      console.log(data.message)
      return null
    }
    return data
  }
  catch (err) {
    console.error(err)
    return null
  }

}

// Use the data that we fetch from the server when the client starts

window.addEventListener('DOMContentLoaded', async () => { // load all essential data from back-end
  const token = localStorage.getItem('token')
  console.log(token)
  if (!token) {
    window.location.href = 'Login.html'
    return
  }

  const data = await profileSend(token)

  const usernameInfo = document.getElementById('username-info')
  const emailInfo = document.getElementById('email-info')


  usernameInfo.innerText = `Username: ${data.username}`
  emailInfo.innerText = `Email: ${data.email}`

})


// Front-end ของพี (Pop UP)

const logoutBtn = document.getElementById('logoutBtn');
const logout = document.getElementById('logout');
const closeBtn = document.getElementById('close');
const confirmLogoutBtn = document.getElementById('confirmLogout');

const boxChangepassword = document.getElementById('box-changepassword1')
const confirmOK = document.getElementById('confirmOK')

const boxChangepasswordIncorrect = document.getElementById('box-changepassword-incorrect')
const confirmOkIncorrect = document.getElementById('confirmOK-incorrect')

const delete_a = document.getElementById('Delete_a');
const Delete_account = document.getElementById('Delete_account');
const close_d = document.getElementById('close_d');
const confirmDelete = document.getElementById('confirmDelete');


//Changepassword POPUP

confirmOK.addEventListener('click', () => {
  boxChangepassword.classList.remove('show');        // ปิดด้วยปุ่ม Cancel
});

boxChangepassword.addEventListener('click', (e) => {
  if (e.target === boxChangepassword) {       // คลิกพื้นหลังด้านนอก = ปิด
    boxChangepassword.classList.remove('show');
  }
});

confirmOkIncorrect.addEventListener('click', () => {
  boxChangepasswordIncorrect.classList.remove('show');        // ปิดด้วยปุ่ม Cancel
});

boxChangepasswordIncorrect.addEventListener('click', (e) => {
  if (e.target === boxChangepasswordIncorrect) {       // คลิกพื้นหลังด้านนอก = ปิด
    boxChangepasswordIncorrect.classList.remove('show');
  }
});


// DELETE POPUP
delete_a.addEventListener('click', () => {
  Delete_account.classList.add('show');   // เปิดกล่อง
});

close_d.addEventListener('click', () => {
  Delete_account.classList.remove('show'); // ปิดกล่องด้วยปุ่ม Cancel
});

Delete_account.addEventListener('click', (e) => {
  if (e.target === Delete_account) {       // คลิกพื้นหลังด้านนอก = ปิด
    Delete_account.classList.remove('show');
  }
});

confirmDelete.addEventListener('click', async () => { // click ที่ delete account
  const token = localStorage.getItem('token')
  if(!token) {
    window.location.href = 'Login.html'
    return
  }  
  const result = await deleteUser(token)
  
  window.location.href = 'Login.html'
})

// LOGOUT POPUP
logoutBtn.addEventListener('click', () => {
  logout.classList.add('show');           // เปิดกล่อง
});

closeBtn.addEventListener('click', () => {
  logout.classList.remove('show');        // ปิดด้วยปุ่ม Cancel
});

logout.addEventListener('click', (e) => {
  if (e.target === logout) {              // คลิกพื้นหลัง = ปิด
    logout.classList.remove('show');
  }
});


// Front-end ของปัน (Change password)

// set up element
const currPass = document.getElementById('CurrentPassword')
const newPass = document.getElementById('NewPassword')
const confirmPass = document.getElementById('ConfirmPassword')

const changePassBtn = document.getElementById('change-pass-btn')
// error element

const inputErrList = ['Password must be at least 8 characters long.',
  'Password must contain at least one number.'
]

const newPassErr = document.getElementById('newpassword-err')
const confirmPassErr = document.getElementById('confirmpass-err')
const currPassErr = document.getElementById('currpassword-err')
// gobal checking
const gobalCheck = [1, 0, 0];

currPass.addEventListener('input', () => {
  currPass.style.outlineColor = '#38b6ff'
  currPassErr.classList.remove('visible')
})



newPass.addEventListener('input', () => {
  const pass = newPass.value;
  if (pass.length < 8) {
    newPass.style.outlineColor = 'red'
    newPassErr.innerText = inputErrList[0]
    newPassErr.classList.add('visible')
    gobalCheck[1] = 0
  }
  else if (!/[0-9]/.test(pass)) {
    newPass.style.outlineColor = 'red'
    newPassErr.innerText = inputErrList[1]
    newPassErr.classList.add('visible')
    gobalCheck[1] = 0
  }
  else {
    newPass.style.outlineColor = "#77ff72ff"
    newPassErr.classList.remove('visible')
    gobalCheck[1] = 1
  }
})


confirmPass.addEventListener('input', () => {
  const pass = confirmPass.value;
  if (pass != newPass.value) {
    confirmPass.style.outlineColor = 'red'
    confirmPass.innerText = 'Password do not match'
    confirmPassErr.classList.add('visible')
    gobalCheck[2] = 0
  }
  else {
    confirmPass.style.outlineColor = "#77ff72ff"
    confirmPassErr.classList.remove('visible')
    gobalCheck[2] = 1
  }
})

confirmPass.addEventListener('focus', () => {
  const pass = confirmPass.value
  if (pass != newPass.value) {
    confirmPass.style.outlineColor = 'red'
    confirmPass.innerText = 'Password do not match'
    confirmPassErr.classList.add('visible')
    gobalCheck[2] = 0
  }
  else {
    confirmPass.style.outlineColor = "#77ff72ff"
    confirmPassErr.classList.remove('visible')
    gobalCheck[2] = 1
  }
})


changePassBtn.addEventListener('click', async () => {
  if (!currPass.value || !newPass.value || !confirmPass.value) {
    if (!currPass.value) {
      currPass.style.outlineColor = 'red'
      currPassErr.innerText = 'Required'
      currPassErr.classList.add('visible')
    }
    if (!newPass.value) {
      newPass.style.outlineColor = 'red'
      newPassErr.innerText = 'Required'
      newPassErr.classList.add('visible')
    }
    if (!confirmPass.value) {
      confirmPass.style.outlineColor = 'red'
      confirmPassErr.innerText = 'Required'
      confirmPassErr.classList.add('visible')
    }
    return
  }

  if (gobalCheck.some((e) => e == 0)) {
    return
  }

  const token = localStorage.getItem('token')

  const result = await changePassword(token, currPass.value, newPass.value);

  if (!result) {
    boxChangepasswordIncorrect.classList.add('show')
    currPass.value = ''
    newPass.value = ''
    confirmPass.value = ''
    return
  }
  boxChangepassword.classList.add('show')

  currPass.value = ''
  newPass.value = ''
  confirmPass.value = ''


})

// password visibility toggle

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
