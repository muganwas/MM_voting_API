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
    const idea = doc.getElementById('idea');
    const insight = doc.getElementById('insight');
    const submit = doc.getElementById('submit-nomination');
    const communications_integration = doc.getElementById('communications_integration');
    const kpis_impact = doc.getElementById('kpis_impact');
    const execution = doc.getElementById('execution');
    const comment = doc.getElementById('comment');

    const altUsername = email.split('@')[0];
    if (!username || username === 'null') name.innerText = altUsername;

    logoutButton.addEventListener('click', async function (e) {
        e.preventDefault();
        return signOut(win, 'j_');
    });
    "blur change".split(" ").forEach(function (e) {
        idea.addEventListener(e, (e) => validateInt(e.target, 10), false);
    });
    "blur change".split(" ").forEach(function (e) {
        insight.addEventListener(e, (e) => validateInt(e.target, 15), false);
    });
    "blur change".split(" ").forEach(function (e) {
        communications_integration.addEventListener(e, (e) => validateInt(e.target, 10), false);
    });
    "blur change".split(" ").forEach(function (e) {
        kpis_impact.addEventListener(e, (e) => validateInt(e.target, 30), false);
    });
    "blur change".split(" ").forEach(function (e) {
        execution.addEventListener(e, (e) => validateInt(e.target, 35), false);
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

            if (c.fileURL) {
                const lnk = document.createElement('a');
                const txt = document.createTextNode('Uploaded Material');
                lnk.append(txt);
                lnk.title = 'uploaded material';
                lnk.href = c.fileURL;
                span_1.appendChild(lnk);
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
    const idea = document.getElementById('idea');
    const insight = document.getElementById('insight');
    const submit = document.getElementById('submit-nomination');
    const communications_integration = document.getElementById('communications_integration');
    const kpis_impact = document.getElementById('kpis_impact');
    const execution = document.getElementById('execution');
    const comment = document.getElementById('comment');
    const nCatName = document.getElementById('nom-category-name');
    const titlePre = document.getElementById('title-pre');
    const submitDisabled = submit.getAttribute('disabled');

    if (!campaignId || submitDisabled) {
        titlePre.innerText = "Rate ";
        submit.removeAttribute('disabled');
        idea.removeAttribute('disabled');
        insight.removeAttribute('disabled');
        communications_integration.removeAttribute('disabled');
        kpis_impact.removeAttribute('disabled');
        execution.removeAttribute('disabled');
        comment.removeAttribute('disabled');

        idea.value = null;
        insight.value = null;
        communications_integration.value = null;
        kpis_impact.value = null;
        execution.value = null;
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
            idea.value = nom.idea;
            idea.classList.contains('error') && idea.classList.remove('error');
            insight.value = nom.insight;
            insight.classList.contains('error') && insight.classList.remove('error');
            communications_integration.value = nom.communications_integration;
            communications_integration.classList.contains('error') && communications_integration.classList.remove('error');
            kpis_impact.value = nom.kpis_impact;
            kpis_impact.classList.contains('error') && kpis_impact.classList.remove('error');
            execution.value = nom.execution;
            execution.classList.contains('error') && execution.classList.remove('error');
            comment.value = nom.comment;
            comment.classList.contains('error') && comment.classList.remove('error');
            titlePre.innerText = "Ratings of ";
            submit.setAttribute('disabled', true);
            idea.setAttribute('disabled', true);
            insight.setAttribute('disabled', true);
            communications_integration.setAttribute('disabled', true);
            kpis_impact.setAttribute('disabled', true);
            execution.setAttribute('disabled', true);
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
    const idea = document.getElementById('idea');
    const insight = document.getElementById('insight');
    const communications_integration = document.getElementById('communications_integration');
    const kpis_impact = document.getElementById('kpis_impact');
    const execution = document.getElementById('execution');
    const comment = document.getElementById('comment');

    if (!validateInt(idea, 10) || !validateInt(insight, 15) || !validateInt(communications_integration, 10) || !validateInt(kpis_impact, 30) || !validateInt(execution, 35) || !comment.value)
        return alert('Fill all fields');

    if (!confirm('Are you statisfied will all ratings?')) return false; // don't submit if user cancels

    const response = await fetch('/api/v1/nominations/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + idToken
        },
        body: JSON.stringify({ judgeId, campaignId, categoryId: selectedCategoryId, idea: idea.value, insight: insight.value, communications_integration: communications_integration.value, kpis_impact: kpis_impact.value, execution: execution.value, comment: comment.value })
    });
    const { result, message } = await response.json();
    toggleNominationModal();
    alert(message);
    if (result) await renderCampaigns(idToken, selectedCategoryId);
}