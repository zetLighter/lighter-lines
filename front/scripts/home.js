
const cartCounter = document.querySelector('.cart-counter'); 
const cardContainer = document.querySelector('.card-container');
const cardsLoadButton = document.querySelector('.load-button');

const cartLinkElement = document.querySelector('.cart-link');

const loginOrExitLinkElement = document.querySelector('.auth-link');

cardsLoadButton.addEventListener('click', () => getRoutes(page++, limit));
cartLinkElement.addEventListener('click', toCartPage);
loginOrExitLinkElement.addEventListener('click', toLoginOrExit);

const cardsByClickCount = 4;
let displayedCards = 4;
let loadButtonClickCounter = 1;

let page = 1;
let limit = 4;
let cardLinkElements;

let routesData = [];

loginOrExitDisplay();
getRoutes();
updateCartCounter();


async function isAuth () {
    const token = getToken();
    if (!token) {
        return false;
    }
    const bearer = 'Bearer ' + token;
    const response = await fetch('http://localhost:8080/api/user/isAuth', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': bearer
        }
    });
    if(!response.ok) {
        return false;
    } else {
        return true;
    }
}
async function loginOrExitDisplay() {
    const auth = await isAuth();
    console.log(auth);
    if (!auth) {
        loginOrExitLinkElement.textContent = 'Войти'
        loginOrExitLinkElement.classList.remove('exit');
        loginOrExitLinkElement.classList.add('login');

        cartLinkElement.classList.add('none')
    } else {
        loginOrExitLinkElement.textContent = 'Выйти'
        loginOrExitLinkElement.classList.remove('login');
        loginOrExitLinkElement.classList.add('exit');
    }
}

async function getRoutes() {
    try {
        const response = await fetch(`http://localhost:8080/api/routes?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const parsedResponse = await response.json();
        parsedResponse.forEach(route => {
            routesData.push(route);
        })
        if (parsedResponse.length < limit && !cardsLoadButton.classList.contains('none')) {
            cardsLoadButton.classList.add('none');
        }
        if (parsedResponse.length > 0) {
            createCards(parsedResponse);
        }
    } catch (error) {
        console.log(error);
    }
}
function createCards(cardsArray) {
    cardsArray.forEach(card => {
        const {id, from, to, price, imageName, shortDescription} = card;
        const cardElement = `
            <div class="card shadow" data-route-id=${id}> 
                <div class="card-link">
                    <img class="card-image" src="../../database/static/${imageName}">
                    <div class="title-desc">
                        <h3 class="card-title">${from} - ${to}</h3>
                        <p class="card-desc">${shortDescription}</p>
                    </div>
                </div>
            </div>`
        cardContainer.insertAdjacentHTML('beforeend', cardElement);
    })
    cardLinkElements = document.querySelectorAll('.card-link');
    cardLinkElements.forEach(element => element.addEventListener('click', toRoutePage));
}
async function updateCartCounter() {
    const cartRoutes = await fetchCartRoutes();
    cartCounter.textContent = cartRoutes.length;
}
function toCartPage () {
    window.location.replace('http://localhost:5500/front/html/cart.html');
}
function toLoginOrExit(event) {
    const elementClassList = event.target.classList;
    if (elementClassList.contains('login')) {
        window.location.replace('http://localhost:5500/front/html/login.html')
    } else if (elementClassList.contains('exit')) {
        localStorage.removeItem('token');
        window.location.replace('http://localhost:5500/front/html/home.html');
    }
}
function toRoutePage (event) {
    const routeId = event.target.closest('.card').getAttribute('data-route-id');
    window.location.replace(`http://localhost:5500/front/html/route.html?id=${routeId}`)
}

async function fetchCartRoutes() {
    const bearer = 'Bearer ' + getToken();
    console.log(bearer);
    const response = await fetch(`http://localhost:8080/api/cart`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': bearer
        }
    });
    const cartRoutes = await response.json();
    return cartRoutes;
}

function getToken() {
    const token = localStorage.getItem('token');
    return token ? JSON.parse(token) : null;
}



