const regexes = {
    EMAIL: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
    PASSWORD: /[^\w\d]*(([0-9]+.*[A-Z]+.*)|[A-Z]+.*([0-9]+.*))/
};
const baseURL = 'http://localhost:8080';
(function (doc, win) {
    /** Live reload */
    doc.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +
        ':35729/livereload.js?snipver=1"></' + 'script>');
    /** End live reload */

    const login_form = doc.getElementById('login');
    const email = doc.getElementById('email');
    const password = doc.getElementById('password');
    const overlay = doc.getElementById('loading-overlay');
    const storedIdToken = win.localStorage.getItem('idToken');
    overlay.style.display = 'block';
    const validateEmail = function (email) {
        if (!email?.classList.contains('error') && (!email?.value || !email?.value.match(regexes.EMAIL)))
            email.classList.add('error');
        if (email?.classList.contains('error') && email?.value && email.value.match(regexes.EMAIL))
            email.classList.remove('error');
    }

    const validatePassword = function (password) {
        if (!password?.classList.contains('error') && (!password?.value || !password?.value.match(regexes.PASSWORD))) {
            password.classList.add('error');
        }
        if (password?.classList.contains('error') && password?.value && password?.value.match(regexes.PASSWORD))
            password.classList.remove('error');
    }

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
        if (!email.value || !password.value) return;
        overlay.style.display = 'block';
        const response = await fetch(baseURL + '/api/v1/users/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({ email: email.value, password: password.value })
        });
        const responseJson = await response.json();
        if (responseJson.result) {
            win.localStorage.setItem('idToken', responseJson.data.idToken);
            win.localStorage.setItem('uid', responseJson.data.uid);
            win.localStorage.setItem('username', responseJson.data.username);
            win.localStorage.setItem('email', responseJson.data.email);
            win.localStorage.setItem('refreshToken', responseJson.data.refreshToken);
            await renderDash(responseJson.data.idToken);
            overlay.style.display = 'none';
        }
    });
    renderDash(storedIdToken);

})(document, window);

async function renderDash(idToken) {
    const errorContainer = document.getElementById('error');
    const overlay = document.getElementById('loading-overlay');
    if (!idToken) {
        errorContainer.style.display = 'none';
        overlay.style.display = 'none';
        return;
    }
    const response = await fetch(baseURL + '/admin/dashboard', {
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