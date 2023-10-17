//const baseURL = 'http://localhost:8080';
(function (doc, win) {
    /** Live reload */
    doc.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +
        ':35729/livereload.js?snipver=1"></' + 'script>');
    /** End live reload */

    const logout = doc.getElementById('logout');
    logout.addEventListener('click', async function (e) {
        e.preventDefault();
        const uid = win.localStorage.getItem('uid');
        const response = await fetch(baseURL + '/api/v1/users/revoke-tokens?uid=' + uid);
        const responseJson = await response.json();
        if (responseJson.result) {
            win.localStorage.removeItem('uid');
            win.localStorage.removeItem('idToken');
            win.location.reload();
            return;
        }
    });
})(document, window);