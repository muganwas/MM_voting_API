const regexes = {
    EMAIL: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
    PASSWORD: /[^\w\d]*(([0-9]+.*[A-Z]+.*)|[A-Z]+.*([0-9]+.*))/
};
const baseURL = "";
(function (doc, win) {
    const login_form = doc.getElementById('jury-login');
    const email = doc.getElementById('email');
    const password = doc.getElementById('password');
    const errorContainer = document.getElementById('error');
    const overlay = doc.getElementById('loading-overlay');
    const storedIdToken = win.localStorage.getItem('idToken');
    overlay.style.display = 'block';

    email.addEventListener('blur', function (e) {
        e.preventDefault();
        const target = e.target;
        validateEmail(target);
    });

    password.addEventListener('blur', function (e) {
        e.preventDefault();
        const target = e.target;
        validatePassword(target);
    });

    login_form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (!validateEmail(email) || !validatePassword(password)) return;
        overlay.style.display = 'block';
        const response = await fetch(baseURL + '/api/v1/users/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({ email: email.value, password: password.value })
        });
        const { result, data, message } = await response.json();
        if (result) {
            win.localStorage.setItem('idToken', data.idToken);
            win.localStorage.setItem('uid', data.uid);
            win.localStorage.setItem('userType', 'Jurer');
            win.localStorage.setItem('username', data.username);
            win.localStorage.setItem('email', data.email);
            win.localStorage.setItem('refreshToken', data.refreshToken);
            await renderDash(data.idToken);
        }
        overlay.style.display = 'none';
        errorContainer.style.display = 'block';
        errorContainer.innerText = message;
    });
    renderDash(storedIdToken);

})(document, window);

function validateEmail(email) {
    if ((!email?.value || !email?.value.match(regexes.EMAIL))) {
        !email?.classList.contains('error') && email.classList.add('error');
        return false;
    }
    if (email?.value && email.value.match(regexes.EMAIL)) {
        email?.classList.contains('error') && email.classList.remove('error');
        return true;
    }
}

function validatePassword(password) {
    if ((!password?.value || !password?.value.match(regexes.PASSWORD))) {
        !password?.classList.contains('error') && password.classList.add('error');
        return false;
    }
    if (password?.value && password?.value.match(regexes.PASSWORD)) {
        password?.classList.contains('error') && password.classList.remove('error');
        return true;
    }
}

async function renderDash(idToken) {
    const errorContainer = document.getElementById('error');
    const overlay = document.getElementById('loading-overlay');
    if (!idToken) {
        errorContainer.style.display = 'none';
        overlay.style.display = 'none';
        return;
    }
    const response = await fetch(baseURL + '/jury/dashboard', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + idToken
        }
    });
    overlay.style.display = 'none';
    if (response.status === 200) {
        const page = await response.text();
        return document.write(page);
    }
    errorContainer.style.display = 'block';
    errorContainer.innerText = 'Authentication Error, try loggin in again!';
}