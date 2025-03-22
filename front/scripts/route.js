
const addToCartButton = document.querySelector('.add-to-cart');
const cartCounter = document.querySelector('.cart-counter');
const cardComponents = document.querySelector('.card-components'); 
const cartLinkElement = document.querySelector('.cart-link');
const loginOrExitLinkElement = document.querySelector('.auth-link');

let cartLength = 0;
let routesData = [];
let currentRouteData; 
loginOrExitDisplay();
getRoute();
checkingIsInCart();
addToCartButton.addEventListener('click', addToCart);
cartLinkElement.addEventListener('click', toCartPage);
loginOrExitLinkElement.addEventListener('click', toLoginOrExit);

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
        addToCartButton.classList.add('none')
    } else {
        loginOrExitLinkElement.textContent = 'Выйти'
        loginOrExitLinkElement.classList.remove('login');
        loginOrExitLinkElement.classList.add('exit');
    }
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
function toCartPage () {
    window.location.replace('http://localhost:5500/front/html/cart.html');
}
async function updateCartCounter() {
    const cartRoutes = await fetchCartRoutes();
    cartCounter.textContent = cartRoutes.length;
}
async function fetchCartRoutes() {
    const bearer = 'Bearer ' + getToken();
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

async function getRoute () {
    try {
        const routeId = Number(getParameterFromURL('id'));
        if (!routeId) {
            return;
        }
        if (!routesData.length) {
            const response = await fetch('http://localhost:8080/api/routes');
            if(!response.ok) {
                throw new Error(response.statusText);
            }
            routesData = await response.json();
        }
        currentRouteData = routesData.find(route => route.id === routeId);
        if(currentRouteData) {
            createCard();
        }
    } catch(error) {
        console.log(error.message);
    }
}

function createCard () {
    const {id, from, to, price, imageName, fullDescription} = currentRouteData;
    const components = `
    <h2 class="container-title">${from} - ${to}</h2>
    <img class="container-image" src="../../database/static/${imageName}">
    <p class="container-description">${fullDescription}</p>`
    cardComponents.insertAdjacentHTML('afterbegin', components);
}

async function addToCart (event) {
    const routeId = Number(getParameterFromURL('id'));
    const userCartRoutes = await fetchCartRoutes();
    const isInCart = userCartRoutes.find(cartRoute => cartRoute.routeId === routeId);
    if (isInCart) {
        await deleteCartRoute(routeId);
    } else {
        await addCartRoute(routeId);
    }
    checkingIsInCart();
}

async function checkingIsInCart () {
    const routeId = Number(getParameterFromURL('id'));
    const userCartRoutes = await fetchCartRoutes();

    const isInCart = userCartRoutes.find(cartRoute => cartRoute.routeId === routeId);
    console.log(isInCart);

    if(isInCart) {
        addToCartButton.classList.add('active');
    } else {
        addToCartButton.classList.remove('active');
    }
    addToCartButton.textContent = isInCart ? 'В корзине' : 'В корзину';
    updateCartCounter();
}

async function deleteCartRoute(routeId) {
    const bearer = 'Bearer ' + getToken();
    const response = await fetch(`http://localhost:8080/api/cart/${routeId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': bearer
        }
    }); 
    const wasDeleted = await response.json();
    console.log(wasDeleted);
}
async function addCartRoute(routeId) {
    const bearer = 'Bearer ' + getToken();
    const response = await fetch(`http://localhost:8080/api/cart/${routeId}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': bearer
        }
    }); 
    const addedCartRoute = await response.json();
    console.log(addedCartRoute);
}

function getToken() {
    const token = localStorage.getItem('token');
    return token ? JSON.parse(token) : null;
}
function getParameterFromURL(parameter) {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get(parameter);
}