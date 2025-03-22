const emailElement = document.querySelector('.email-input');
const usernameElement = document.querySelector('.username-input');
const passwordElement = document.querySelector('.password-input');
const registerButton = document.querySelector('.register-button')
const errorBoard = document.querySelector('.error-board');
const toLoginButton = document.querySelector('.to-login-button'); 

registerButton.addEventListener('click', getInputValues);
toLoginButton.addEventListener('click', toLogin);

function getInputValues (event) {
    event.preventDefault();
    const emailValue = emailElement.value;
    const usernameValue = usernameElement.value;
    const passwordValue = passwordElement.value;
    
    registerFetch(emailValue, usernameValue, passwordValue);
}
async function registerFetch(email, username, password) {
    console.log(email, username, password);
    const response = await fetch('http://localhost:8080/api/user/registration', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            username,
            password
        })
    });
    const tokenObject = await response.json();
    if (response.ok) {
        errorBoard.textContent = '';
        setToken(tokenObject.token);
        window.location.replace('http://localhost:5500/front/html/home.html')
    } else {
        errorBoard.textContent = tokenObject.message;
    }
}
function toLogin() {
    window.location.replace('http://localhost:5500/front/html/login.html');
}
function setToken(token) {
    localStorage.setItem('token', JSON.stringify(token));
}