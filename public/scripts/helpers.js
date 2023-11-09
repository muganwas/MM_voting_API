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

function preventPropagation(e) {
    e.stopPropagation();
    /** prevent propagation on child click */
}

function validateInt(t, tV = 10) {
    const val = t.value;
    if ((!val || Number(val) < 0) || (val && Number(val) > tV)) {
        t.classList.add('error');
        t.value = "";
        return false;
    }
    else if (val && t.classList.contains('error')) t.classList.remove('error');
    return true;
}

function errorOnNoValue(e) {
    e.preventDefault();
    const t = e.target;
    if (!t.value) t.classList.add('error');
    else if (t.value && t.classList.contains('error')) t.classList.remove('error');
}

async function signOut(win, pref) {
    const p = pref || '';
    const uid = win.localStorage.getItem(p + 'uid');
    const response = await fetch(baseURL + '/api/v1/users/revoke-tokens?uid=' + uid);
    const responseJson = await response.json();
    if (responseJson.result) {
        win.localStorage.removeItem(p + 'uid');
        win.localStorage.removeItem(p + 'idToken');
        win.localStorage.removeItem(p + 'username');
        win.localStorage.removeItem(p + 'email');
        win.localStorage.removeItem(p + 'userType');
        win.localStorage.removeItem(p + 'refreshToken');
        win.location.reload();
        return;
    }
}

async function fetchCategories(idToken) {
    const response = await fetch('/api/v1/categories', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + idToken
        }
    });
    const { result, data } = await response.json();
    if (result) return data;
    return [];
}

async function fetchAggregatedNominations(idToken, limit = 5) {
    const response = await fetch('/api/v1/nominations/aggregated?limit=' + limit, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + idToken
        }
    });
    const { result, data } = await response.json();
    if (result) return data;
    return [];
}

async function fetchNominations(idToken, id, catId) {
    const response = await fetch('/api/v1/nominations?judgeId=' + id + "&catId=" + catId, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + idToken
        }
    });
    const { result, data } = await response.json();
    if (result) return data;
    return [];
}

async function fetchCampaigns(idToken, catId) {
    const response = await fetch('/api/v1/campaigns?catId=' + catId, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + idToken
        }
    });
    const { result, data } = await response.json();
    if (result) return data;
    return [];
}