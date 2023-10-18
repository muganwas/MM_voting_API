//const baseURL = 'http://localhost:8080';
(async function (doc, win) {
    /** Live reload */
    doc.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +
        ':35729/livereload.js?snipver=1"></' + 'script>');
    /** End live reload */

    const newUserEmail = doc.getElementById('user-email');
    const newUserPassword = doc.getElementById('user-password');
    const username = win.localStorage.getItem('username');
    const idToken = win.localStorage.getItem('idToken');
    const adminName = doc.getElementById('admin-name');
    const tabs = doc.getElementsByClassName('tab');
    const logoutButton = doc.getElementById('logout');
    const categoriesForm = doc.getElementById('categories-form');
    const usersForm = doc.getElementById('users-form');
    const catName = doc.getElementById('category-name');
    const catDesc = doc.getElementById('category-desc');

    if (username && username !== 'null') {// use admins username
        adminName.innerText = username;
    }

    await renderUsers(doc, idToken);
    await renderCategories(doc, idToken);
    Array.from(tabs).forEach(e => {
        e.addEventListener('click', onTabClick)
    });

    logoutButton.addEventListener('click', async function (e) {
        e.preventDefault();
        return signOut(win);
    });

    catName.addEventListener('blur', errorOnNoValue);
    catDesc.addEventListener('blur', errorOnNoValue);
    newUserEmail.addEventListener('blur', (e) => validateEmail(e.target));
    newUserPassword.addEventListener('blur', (e) => validatePassword(e.target));
    categoriesForm.addEventListener('submit', submitCategory);
    usersForm.addEventListener('submit', createUser);

})(document, window);

function onTabClick(e) {
    e.preventDefault();
    const target = e.target;
    const id = target.id;
    const idArr = id.split('-');
    const containerId = idArr[0] + "-container";
    const container = document.getElementById(containerId);
    const tabs = document.getElementsByClassName('tab');
    const containers = document.getElementsByClassName('details-sub');
    if (!target.classList.contains('active')) {
        Array.from(containers).forEach(e => e.classList.remove('active'));
        Array.from(tabs).forEach(e => {
            e.classList.remove('active');
        });
        target.classList.add('active');
        container.classList.add('active');
    }
}

function errorOnNoValue(e) {
    e.preventDefault();
    const t = e.target;
    if (!t.value) t.classList.add('error');
    else if (t.value && t.classList.contains('error')) t.classList.remove('error');
}

async function createUser(e) {
    e.preventDefault();
    const idToken = window.localStorage.getItem('idToken');
    const children = e.target.children;
    const userEmail = Array.from(children).find(c => c.id === 'user-email');
    const userPassword = Array.from(children).find(c => c.id === 'user-password');
    if (!userEmail.value || !userPassword.value) return;
    const response = await fetch(baseURL + '/api/v1/users/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + idToken
        },
        body: JSON.stringify({ email: userEmail.value, password: userPassword.value })
    });
    const { result, message } = await response.json();
    if (result) {
        userEmail.value = "";
        userPassword.value = "";
        return renderUsers(document, idToken);
    }
    return alert(message);
}

async function submitCategory(e) {
    e.preventDefault();
    const idToken = window.localStorage.getItem('idToken');
    const children = e.target.children;
    const catName = Array.from(children).find(c => c.id === 'category-name');
    const catDesc = Array.from(children).find(c => c.id === 'category-desc');
    if (!catName.value || !catDesc.value) return;
    const response = await fetch(baseURL + '/api/v1/categories/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + idToken
        },
        body: JSON.stringify({ name: catName.value, desc: catDesc.value })
    });
    const { result, message } = await response.json();
    if (result) {
        catName.value = "";
        catDesc.value = "";
        return renderCategories(document, idToken);
    }
    return alert(message);
}

async function fetchCategories(idToken) {
    const response = await fetch(baseURL + '/api/v1/categories', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + idToken
        }
    });
    const { result, data } = await response.json();
    if (result) return data;
    return null;
}

async function renderCategories(doc, idToken) {
    const categories = await fetchCategories(idToken);
    if (categories && Array.isArray(categories)) {
        const catListContainer = doc.getElementById('categories-list');
        catListContainer.innerHTML = null;
        categories.forEach(cat => {
            const newDiv = doc.createElement('div');
            newDiv.className = 'category-info'
            const span_1 = doc.createElement('span');
            const span_2 = doc.createElement('span');
            span_1.innerText = cat.name;
            span_2.innerText = cat.desc;

            span_1.className = 'info';
            span_2.className = 'info desc';
            newDiv.appendChild(span_1);
            newDiv.appendChild(span_2);
            catListContainer.append(newDiv);
        });
    }

}

async function signOut(win) {
    const uid = win.localStorage.getItem('uid');
    const response = await fetch(baseURL + '/api/v1/users/revoke-tokens?uid=' + uid);
    const responseJson = await response.json();
    if (responseJson.result) {
        win.localStorage.removeItem('uid');
        win.localStorage.removeItem('idToken');
        win.localStorage.removeItem('username');
        win.localStorage.removeItem('email');
        win.localStorage.removeItem('refreshToken');
        win.location.reload();
        return;
    }
}

async function fetchUsers(idToken) {
    const response = await fetch(baseURL + '/api/v1/users', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + idToken
        }
    });
    const responseJson = await response.json();
    if (responseJson.result) return responseJson.data;
    return null;
}

async function toggleVerification(uid, value, idToken) {
    if (!uid || value == undefined || !idToken) return null;
    const response = await fetch(baseURL + '/api/v1/users/admin-verify-user', {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + idToken
        },
        body: JSON.stringify({ uid, value })
    });
    const responseJson = await response.json();
    if (!responseJson.result && responseJson.message.includes('auth')) {
        return signOut(window);
    }
}

async function renderUsers(doc, idToken) {
    const users = await fetchUsers(idToken);
    if (users && Array.isArray(users)) {
        const userListContainer = doc.getElementById('users-list');
        userListContainer.innerHTML = null;
        users.forEach(user => {
            const newDiv = doc.createElement('div');
            newDiv.className = 'user-info'
            const span_1 = doc.createElement('span');
            const span_2 = doc.createElement('span');
            const span_3 = doc.createElement('span');
            const span_sub_3 = doc.createElement('span');
            span_1.innerText = user.uid;
            span_2.innerText = user.email;

            span_sub_3.innerText = user.emailVerified ? "Unverify" : "Verify";
            span_sub_3.className = 'action';

            span_sub_3.addEventListener('click', async function (e) {
                e.preventDefault();
                await toggleVerification(user.uid, !user.emailVerified, idToken);
                return renderUsers(doc, idToken);
            });

            span_1.className = 'info';
            span_2.className = 'info';
            span_3.className = 'info';
            span_3.appendChild(span_sub_3);
            newDiv.appendChild(span_1);
            newDiv.appendChild(span_2);
            newDiv.appendChild(span_3);
            userListContainer.append(newDiv);
        });
    }
}