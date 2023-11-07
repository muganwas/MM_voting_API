var selectedCategoryId;
var campaigns;
var categories;
var nominations;
var activeCampaign;
(async function (doc, win) {
    const username = win.localStorage.getItem('j_username');
    const idToken = win.localStorage.getItem('j_idToken');
    const email = win.localStorage.getItem('j_email');
    const userType = win.localStorage.getItem('j_userType');

    if (userType !== 'Jurer') signOut(win, 'j_');

    const name = doc.getElementById('jurer-name');
    const logoutButton = doc.getElementById('logout');
    const categoryDD = doc.getElementById('category-drop-down');
    const nominationForm = doc.getElementById('nomination');
    const nominationContainer = doc.getElementById('nomination-container');
    const modal = doc.getElementsByClassName('modal');
    const alignment = doc.getElementById('alignment');
    const objectives = doc.getElementById('objectives');
    const submit = doc.getElementById('submit-nomination');
    const implementation = doc.getElementById('implementation');
    const impact = doc.getElementById('impact');
    const why_win = doc.getElementById('why_win');
    const comment = doc.getElementById('comment');

    const altUsername = email.split('@')[0];
    if (!username || username === 'null') name.innerText = altUsername;

    logoutButton.addEventListener('click', async function (e) {
        e.preventDefault();
        return signOut(win, 'j_');
    });
    "blur change".split(" ").forEach(function (e) {
        alignment.addEventListener(e, (e) => validateInt(e.target, 20), false);
    });
    "blur change".split(" ").forEach(function (e) {
        objectives.addEventListener(e, (e) => validateInt(e.target, 15), false);
    });
    "blur change".split(" ").forEach(function (e) {
        implementation.addEventListener(e, (e) => validateInt(e.target, 30), false);
    });
    "blur change".split(" ").forEach(function (e) {
        impact.addEventListener(e, (e) => validateInt(e.target, 30), false);
    });
    "blur change".split(" ").forEach(function (e) {
        why_win.addEventListener(e, (e) => validateInt(e.target, 5), false);
    });
    "blur change".split(" ").forEach(function (e) {
        comment.addEventListener(e, errorOnNoValue, false);
    });
    categoryDD.addEventListener('click', toggleCategoryDD);
    nominationForm.addEventListener('submit', submitNomination);
    submit.addEventListener('click', submitNomination);
    nominationContainer.addEventListener('click', preventPropagation);

    categories = await fetchCategories(idToken);
    /** set default selectedCategoryId */
    selectedCategoryId = categories[0]?.id;

    await renderCampaigns(idToken, selectedCategoryId);
    Array.from(modal).forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            toggleNominationModal(activeCampaign.id);
        });
    });

})(document, window);

/** categeries */

function toggleCategoryDD(e) {
    e.preventDefault();
    const categoryList = document.getElementById('category-list');
    const categoryId = document.getElementById('category-id');
    const selectedCategory = document.getElementById('selected-category');
    if (categoryList.classList.contains('active')) {
        return categoryList.classList.remove('active');
    }
    if (categories && Array.isArray(categories)) {
        categoryList.innerHTML = "";
        categories.forEach(c => {
            const br = document.createElement('span');
            br.innerText = c.name;
            br.className = `item${selectedCategoryId == c.id ? ' active' : ''}`;
            br.addEventListener('click', async (e) => {
                e.preventDefault();
                if (br.classList.contains('active')) {
                    br.classList.remove('active');
                } else {
                    br.classList.add('active');
                }
                selectedCategory.innerText = c.name;
                categoryId.value = JSON.stringify(selectedCategoryId);
                selectedCategoryId = c.id;
                const idToken = window.localStorage.getItem('j_idToken');
                await renderCampaigns(idToken, selectedCategoryId);
            });
            categoryList.appendChild(br);
        });
        categoryList.classList.add('active');
    }
}

/** campaigns */

async function renderCampaigns(idToken, selectedCategoryId) {
    const uid = window.localStorage.getItem('j_uid');
    campaigns = await fetchCampaigns(idToken, selectedCategoryId);
    nominations = await fetchNominations(idToken, uid, selectedCategoryId);
    const categorySelector = document.getElementById('selected-category');
    const listContainer = document.getElementById('campaigns-list');
    listContainer.innerHTML = null;
    categorySelector.innerText = categories.find(c => c.id == selectedCategoryId)?.name;
    if (Array.isArray(campaigns)) {
        campaigns.forEach((c, i) => {
            const newDiv = document.createElement('div');
            newDiv.className = 'campaign-info'
            const span_1 = document.createElement('span');
            const span_2 = document.createElement('span');
            const span_3 = document.createElement('span');
            const nom = nominations?.find(n => n.campaignId === c.id && n.categoryId === selectedCategoryId);
            span_1.className = 'info';
            span_2.className = 'info';
            span_3.className = 'info';

            if (c.fileURLs && Array.isArray(c.fileURLs)) {
                const linkContainer = document.createElement('div');
                linkContainer.className = 'link-container';
                c.fileURLs.forEach((url, i) => {
                    const lnk = document.createElement('a');
                    const txt = document.createTextNode('Link ' + (i + 1));
                    lnk.append(txt);
                    lnk.title = 'uploaded material_' + i + 1;
                    lnk.href = url;
                    linkContainer.appendChild(lnk);
                })
                span_1.appendChild(linkContainer);
            }
            const btn = document.createElement('span');
            btn.className = `button ${nom && nom.categoryId === selectedCategoryId ? 'submitted' : ''} tgl-modal`;
            btn.id = c.id;
            btn.addEventListener('click', () => {
                toggleNominationModal(c.id);
            });
            btn.innerText = c.name;
            span_2.appendChild(btn);
            span_3.innerText = c.brandName;

            newDiv.appendChild(span_1);
            newDiv.appendChild(span_2);
            newDiv.appendChild(span_3);

            listContainer.append(newDiv);
        });
    }
}

function toggleNominationModal(campaignId) {
    const modal = document.getElementById('nomination-modal');
    const campaignName = document.getElementById('campaign-name');
    const alignment = document.getElementById('alignment');
    const objectives = document.getElementById('objectives');
    const submit = document.getElementById('submit-nomination');
    const implementation = document.getElementById('implementation');
    const impact = document.getElementById('impact');
    const why_win = document.getElementById('why_win');
    const comment = document.getElementById('comment');
    const nCatName = document.getElementById('nom-category-name');
    const titlePre = document.getElementById('title-pre');
    const submitDisabled = submit.getAttribute('disabled');

    if (!campaignId || submitDisabled) {
        titlePre.innerText = "Rate ";
        submit.removeAttribute('disabled');
        alignment.removeAttribute('disabled');
        objectives.removeAttribute('disabled');
        implementation.removeAttribute('disabled');
        impact.removeAttribute('disabled');
        why_win.removeAttribute('disabled');
        comment.removeAttribute('disabled');

        alignment.value = null;
        objectives.value = null;
        implementation.value = null;
        impact.value = null;
        why_win.value = null;
        comment.value = null;
    }
    if (modal.classList.contains('active')) {
        return modal.classList.remove('active');
    }
    nCatName.innerText = categories?.find(c => selectedCategoryId === c.id)?.name;
    if (campaignId) {
        activeCampaign = campaigns?.find(c => c.id === campaignId);
        const nom = nominations?.find(n => n.campaignId === campaignId && n.categoryId === selectedCategoryId);
        if (nom) {
            alignment.value = nom.alignment;
            alignment.classList.contains('error') && alignment.classList.remove('error');
            objectives.value = nom.objectives;
            objectives.classList.contains('error') && objectives.classList.remove('error');
            implementation.value = nom.implementation;
            implementation.classList.contains('error') && implementation.classList.remove('error');
            impact.value = nom.impact;
            impact.classList.contains('error') && impact.classList.remove('error');
            why_win.value = nom.why_win;
            why_win.classList.contains('error') && why_win.classList.remove('error');
            comment.value = nom.comment;
            comment.classList.contains('error') && comment.classList.remove('error');
            titlePre.innerText = "Ratings of ";
            submit.setAttribute('disabled', true);
            alignment.setAttribute('disabled', true);
            objectives.setAttribute('disabled', true);
            implementation.setAttribute('disabled', true);
            impact.setAttribute('disabled', true);
            why_win.setAttribute('disabled', true);
            comment.setAttribute('disabled', true);

        }
        modal.classList.add('active');
        campaignName.innerText = activeCampaign.name;
    }

}

async function submitNomination(e) {
    e.preventDefault();
    const judgeId = window.localStorage.getItem('j_uid');
    const idToken = window.localStorage.getItem('j_idToken');
    const campaignId = activeCampaign.id;
    const alignment = document.getElementById('alignment');
    const objectives = document.getElementById('objectives');
    const implementation = document.getElementById('implementation');
    const impact = document.getElementById('impact');
    const why_win = document.getElementById('why_win');
    const comment = document.getElementById('comment');

    if (!validateInt(alignment, 20) || !validateInt(objectives, 15) || !validateInt(implementation, 30) || !validateInt(impact, 30) || !validateInt(why_win, 5) || !comment.value)
        return alert('Fill all fields');

    if (!confirm('Are you statisfied will all ratings?')) return false; // don't submit if user cancels

    const response = await fetch('/api/v1/nominations/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + idToken
        },
        body: JSON.stringify({
            judgeId, campaignId, categoryId: selectedCategoryId, alignment: alignment.value, objectives: objectives.value, implementation: implementation.value, impact: impact.value, why_win: why_win.value, comment
        })
    });
    const { result, message } = await response.json();
    toggleNominationModal();
    alert(message);
    if (result) await renderCampaigns(idToken, selectedCategoryId);
}