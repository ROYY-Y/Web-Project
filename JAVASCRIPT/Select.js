// checking token (if token is null return to login.html)

window.addEventListener('DOMContentLoaded',()=>{
    const token = localStorage.getItem('token')
    if(!token){
        window.location.href = 'Login.html'
        return
    }
    return
})

// Set up essential variables

const n5Btn = document.getElementById('N5')
const n4Btn = document.getElementById('N4')
const n3Btn = document.getElementById('N3')
const n2Btn = document.getElementById('N2')
const n1Btn = document.getElementById('N1')

const arr = [n5Btn,n4Btn,n3Btn,n2Btn,n1Btn]

arr.forEach((button)=>{
    button.addEventListener('click',()=>{
        localStorage.setItem('level',button.id)
        window.location.href = 'Prepare.html'
    })
})
