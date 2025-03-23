const cartLinkElement = document.querySelector('.cart-link');
const cartCounter = document.querySelector('.cart-counter');
const cartTitle = document.querySelector('.cart-title');
const cardContainer = document.querySelector('.card-container');
const loginOrExitLinkElement = document.querySelector('.auth-link');

cartLinkElement.addEventListener('click', toCartPage)
loginOrExitLinkElement.addEventListener('click', toLoginOrExit);

loginOrExitDisplay();
getDetailedRoutes();

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
        cartTitle.textContent = 'Войдите, чтобы видеть свою корзину. ';
    } else {
        loginOrExitLinkElement.textContent = 'Выйти'
        loginOrExitLinkElement.classList.remove('login');
        loginOrExitLinkElement.classList.add('exit');

        cartTitle.textContent = 'Корзина';
    }
}

async function updateCartCounter() {
    const cartRoutes = await fetchCartRoutes(); 
    cartCounter.textContent = cartRoutes.length;
}
function addCardListener() {
    const cardElements = document.querySelectorAll('.card');
    cardElements.forEach(cardElement => cardElement.addEventListener('click', removeFromCart));
}
async function fetchCartRoutes () {
    const bearer = 'Bearer ' + getToken();
    const response = await fetch(`http://localhost:8080/api/cart`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': bearer
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const cartRoutes = await response.json();
    return cartRoutes;
}
async function fetchRoutes () {
    const response = await fetch(`http://localhost:8080/api/routes`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const routes = await response.json();
    return routes;
}

async function getDetailedRoutes() {
    const detailedRoutes = [];

    const cartRoutes = await fetchCartRoutes();
    const routes = await fetchRoutes();

    cartRoutes.forEach(cartRoute => {
        const detailedRoute = routes.find(route => route.id === cartRoute.routeId);
        detailedRoutes.push(detailedRoute);
    })

    createCards(detailedRoutes);
    updateCartCounter();
}
function createCards(detailedRoutes) {
    console.log(detailedRoutes);
    cardContainer.textContent = '';
    if (!detailedRoutes.length) {
        cartTitle.textContent = 'Пока вы не добавили не один маршрут в корзину.';
    } else {
        detailedRoutes.forEach(route => {
            const {id, from, to, dateTime, price} = route;
            const date = new Date(dateTime);
            const cardElement = `
            <div class="card shadow" data-route-id="${id}">
                <h3 class="card-title">${from} - ${to}</h3>
                <div class="card-date-time">
                    <h3 class="card-time">Время: ${date.toLocaleTimeString()}</h3>
                    <h3 class="card-date">Дата: ${date.toLocaleDateString()}</h3>
                </div>
                <h3 class="card-price">${price}$</h3>
            </div`
            cardContainer.insertAdjacentHTML('afterbegin', cardElement);
       });
       addCardListener();
    }
}
async function removeFromCart(event) {
    const bearer = 'Bearer ' + getToken();
    const routeId = event.target.closest('.card').getAttribute('data-route-id')

    const response = await fetch(`http://localhost:8080/api/cart/${routeId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': bearer
        }
    });
    const deletedCartRoute = await response.json();
    console.log(deletedCartRoute);
    getDetailedRoutes();
}
function toCartPage () {
    window.location.replace('/cart');
}
function toLoginOrExit(event) {
    const elementClassList = event.target.classList;
    if (elementClassList.contains('login')) {
        window.location.replace('/login')
    } else if (elementClassList.contains('exit')) {
        localStorage.removeItem('token');
        window.location.replace('/');
    }
}

function getToken() {
    const token = localStorage.getItem('token');
    return token ? JSON.parse(token) : null;
}