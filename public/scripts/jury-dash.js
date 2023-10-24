(function (doc, win) {
    const username = win.localStorage.getItem('username');
    const idToken = win.localStorage.getItem('idToken');
    const email = win.localStorage.getItem('email');
    const userType = win.localStorage.getItem('userType');

    if (userType !== 'Jurer') signOut(win);
    const name = doc.getElementById('jurer-name');
    const tabs = doc.getElementsByClassName('tab');
    const logoutButton = doc.getElementById('logout');
    const altUsername = email.split('@')[0];
    if (!username || username === 'null') name.innerText = altUsername;

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
        win.localStorage.removeItem('userType');
        win.localStorage.removeItem('refreshToken');
        win.location.reload();
        return;
    }
}