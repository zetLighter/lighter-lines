const loginElement = document.querySelector('.login-input');
const passwordElement = document.querySelector('.password-input');
const errorBoard = document.querySelector('.error-board');
const loginButton = document.querySelector('.login-button');
const toRegisterButton = document.querySelector('.to-register-button');

loginButton.addEventListener('click', getInputValues);
toRegisterButton.addEventListener('click', toRegister)

function getInputValues(event) {
    event.preventDefault();
    const loginValue = loginElement.value;
    const passwordValue = passwordElement.value;
    console.log(loginValue, passwordValue);
    loginFetch(loginValue, passwordValue);
}
async function loginFetch(loginValue, passwordValue) {
    const isEmail = loginValue.includes("@");
    const login = isEmail ? "email" : "username";
    console.log(login);
    const response = await fetch('http://localhost:8080/api/user/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            [login]: loginValue,
            password: passwordValue
        })
    });
    const tokenObject = await response.json();
    if (response.ok) {
        errorBoard.textContent = '';
        setToken(tokenObject.token);
        window.location.replace('/');
    } else {
        errorBoard.textContent = tokenObject.message;
        console.log(tokenObject.message);
    }
}
function toRegister() {
    window.location.replace('/registration');
}
function setToken(token) {
    localStorage.setItem('token', JSON.stringify(token));
}
  
