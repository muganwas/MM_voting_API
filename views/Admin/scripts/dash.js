//const baseURL = 'http://localhost:8080';
(async function (doc, win) {
    /** Live reload */
    doc.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +
        ':35729/livereload.js?snipver=1"></' + 'script>');
    /** End live reload */

    const username = win.localStorage.getItem('username');
    const idToken = win.localStorage.getItem('idToken');
    const adminName = doc.getElementById('admin-name');
    if (username && username !== 'null') {
        adminName.innerText = username;
    }

    await renderUsers(doc, idToken);

    const logout = doc.getElementById('logout');
    logout.addEventListener('click', async function (e) {
        e.preventDefault();
        return signOut(win);
    });
})(document, window);

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