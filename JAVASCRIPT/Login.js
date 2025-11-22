const serverAddr = "http://localhost:3000";

async function login() {
    try {
        const res = await fetch(`${serverAddr}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: "Tk1nter", password: "tk1nter159951" })
        });
        const data = await res.json();
        localStorage.setItem('token', data.token);
    } catch(err) {
        console.error(err);
    }
}
login();
const token = localStorage.getItem('token');
console.log(token);
