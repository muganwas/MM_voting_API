var categories;
var agencies;
var campaigns;
var companies;
var nominations;
var users;
var selectedCompBrands = [];
var selectedCategoryIds = [];
var selectedCategoryId;
var editCatId;
var editAgId;
var editCampId;
var editCompId;
var editUserId;
const selectedCategoryNames = [];
(async function (doc, win) {
    const username = win.localStorage.getItem('username');
    const idToken = win.localStorage.getItem('idToken');
    const userType = win.localStorage.getItem('userType');

    const adminName = doc.getElementById('admin-name');
    const tabs = doc.getElementsByClassName('tab');
    const logoutButton = doc.getElementById('logout');

    const catName = doc.getElementById('category-name');
    const catDesc = doc.getElementById('category-desc');
    const agName = doc.getElementById('agency-name');
    const agEmail = doc.getElementById('agency-email');
    const agIntro = doc.getElementById('agency-intro');
    const compName = doc.getElementById('company-name');
    const compBrands = doc.getElementById('company-brands');
    const compEmail = doc.getElementById('company-email');
    const newUserEmail = doc.getElementById('user-email');
    const newUserPassword = doc.getElementById('user-password');
    const campName = document.getElementById('campaign-name');
    const compId = document.getElementById('company-id');
    const conEmail = document.getElementById('contact-email');

    const companyDD = doc.getElementById('company-drop-down');
    const agencyDD = doc.getElementById('agency-drop-down');
    const brandDD = document.getElementById('brand-drop-down');
    const categoryDD = document.getElementById('category-drop-down');
    const nomCategoryDD = document.getElementById('nom-category-drop-down');

    const categoriesForm = doc.getElementById('categories-form');
    const companiesForm = doc.getElementById('companies-form');
    const campaignsForm = doc.getElementById('campaigns-form');
    const agenciesForm = doc.getElementById('agencies-form');
    const usersForm = doc.getElementById('users-form');

    if (userType !== 'Admin') signOut(win);

    if (username && username !== 'null') {// use admins username
        adminName.innerText = username;
    }

    await renderUsers(doc, idToken);
    await renderCategories(doc, idToken);
    await renderAgencies(doc, idToken);
    await renderCompanies(doc, idToken);
    await renderCampaigns(doc, idToken);
    await renderNominations(doc, idToken, selectedCategoryId);

    Array.from(tabs).forEach(e => {
        e.addEventListener('click', onTabClick)
    });

    logoutButton.addEventListener('click', async function (e) {
        e.preventDefault();
        return signOut(win);
    });

    companyDD.addEventListener('click', toggleCompanyDD);
    agencyDD.addEventListener('click', toggleAgencyDD);
    brandDD.addEventListener('click', toggleBrandDD);
    categoryDD.addEventListener('click', toggleCategoryDD);
    nomCategoryDD.addEventListener('click', toggleNomCategoryDD);

    newUserEmail.addEventListener('blur', (e) => validateEmail(e.target));
    newUserPassword.addEventListener('blur', (e) => validatePassword(e.target));

    catName.addEventListener('blur', errorOnNoValue);
    catDesc.addEventListener('blur', errorOnNoValue);
    agName.addEventListener('blur', errorOnNoValue);
    agEmail.addEventListener('blur', errorOnNoValue);
    agIntro.addEventListener('blur', errorOnNoValue);
    compName.addEventListener('blur', errorOnNoValue);
    compEmail.addEventListener('blur', (e) => validateEmail(e.target));
    compBrands.addEventListener('blur', errorOnNoValue);
    campName.addEventListener('blur', errorOnNoValue);
    compId.addEventListener('blur', errorOnNoValue);
    conEmail.addEventListener('blur', (e) => validateEmail(e.target));

    categoriesForm.addEventListener('submit', submitCategory);
    companiesForm.addEventListener('submit', submitCompany);
    agenciesForm.addEventListener('submit', submitAgency);
    usersForm.addEventListener('submit', createUser);
    campaignsForm.addEventListener('submit', submitCampaign);

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

function toggleNomCategoryDD(e) {
    e.preventDefault();
    const categoryList = document.getElementById('nom-category-list');
    const categoryId = document.getElementById('nom-category-id');
    const selectedCategory = document.getElementById('nom-selected-category');
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
                const idToken = window.localStorage.getItem('idToken');
                await renderNominations(document, idToken, selectedCategoryId);
            });
            categoryList.appendChild(br);
        });
        categoryList.classList.add('active');
    }
}

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
            const selectedIndex = selectedCategoryIds.findIndex(id => id === c.id);
            br.className = `item${selectedIndex > -1 ? ' active' : ''}`;
            br.innerText = c.name;
            br.addEventListener('click', (e) => {
                e.preventDefault();
                if (br.classList.contains('active')) {
                    selectedCategoryIds.splice(selectedIndex, 1);
                    selectedCategoryNames.splice(selectedIndex, 1);
                    br.classList.remove('active');
                } else {
                    selectedCategoryIds.push(c.id);
                    selectedCategoryNames.push(c.name);
                    br.classList.add('active');
                }
                selectedCategory.innerText = selectedCategoryIds.length ? selectedCategoryNames.join(', ') : 'Select Categories(One or more)';
                categoryId.value = JSON.stringify(selectedCategoryIds);
            });
            categoryList.appendChild(br);
        });
        categoryList.classList.add('active');
    }
}

function toggleBrandDD(e) {
    e.preventDefault();
    const brandList = document.getElementById('brand-list');
    const brandName = document.getElementById('brand-name');
    const selectedBrand = document.getElementById('selected-brand');
    if (brandList.classList.contains('active')) {
        return brandList.classList.remove('active');
    }
    if (selectedCompBrands && Array.isArray(selectedCompBrands)) {
        brandList.innerHTML = "";
        selectedCompBrands.forEach(b => {
            const br = document.createElement('span');
            br.className = 'item';
            br.innerText = b;
            br.addEventListener('click', () => {
                selectedBrand.innerText = b;
                brandName.value = b;
            });
            brandList.appendChild(br);
        });
        brandList.classList.add('active');
    }
}

function toggleAgencyDD(e) {
    e.preventDefault();
    const agencyList = document.getElementById('agency-list');
    const agencyId = document.getElementById('agency-id');
    const selectedAg = document.getElementById('selected-agency');
    if (agencyList.classList.contains('active')) {
        return agencyList.classList.remove('active');
    }
    if (agencies && Array.isArray(agencies)) {
        agencyList.innerHTML = "";
        agencies.forEach(a => {
            const ag = document.createElement('span');
            ag.className = 'item';
            ag.innerText = a.name;
            ag.addEventListener('click', () => {
                selectedAg.innerText = a.name;
                agencyId.value = a.id;
            });
            agencyList.appendChild(ag);
        });
        agencyList.classList.add('active');
    }
}

function toggleCompanyDD(e) {
    e.preventDefault();
    const companyList = document.getElementById('company-list');
    const companyId = document.getElementById('company-id');
    const selectedComp = document.getElementById('selected-company');
    const selectedBrand = document.getElementById('selected-brand');
    const brandDD = document.getElementById('brand-drop-down');
    const brandNameInput = document.getElementById('brand-name');
    const brandList = document.getElementById('brand-list');
    if (companyList.classList.contains('active')) {
        return companyList.classList.remove('active');
    }
    if (companies && Array.isArray(companies)) {
        companyList.innerHTML = "";
        companies.forEach(c => {
            const comp = document.createElement('span');
            comp.className = 'item';
            comp.innerText = c.name;
            comp.addEventListener('click', () => {
                selectedComp.innerText = c.name;
                companyId.value = c.id;
                selectedBrand.innerText = "Select Brand";
                selectedCompBrands = c.brands;
                if (selectedCompBrands && Array.isArray(selectedCompBrands)) {
                    brandNameInput.style.display = "none";
                    brandDD.style.display = "flex";
                    brandList.innerHTML = null;
                    /** add brands to drop list */
                    selectedCompBrands.forEach(b => {
                        const bName = document.createElement('span');
                        bName.className = "item";
                        bName.innerText = b;
                        brandList.appendChild(bName);
                    });

                } else {
                    brandNameInput.removeAttribute('hidden');
                    brandDD.style.display = "none";
                }
            });
            companyList.appendChild(comp);
        });
        companyList.classList.add('active');
    }
}

/** Campaings */

async function submitCampaign(e) {
    e.preventDefault();
    const idToken = window.localStorage.getItem('idToken');
    const children = e.target.children;
    const campName = Array.from(children).find(c => c.id === 'campaign-name');
    const compId = Array.from(children).find(c => c.id === 'company-id');
    const brandName = Array.from(children).find(c => c.id === 'brand-name');
    const agId = Array.from(children).find(c => c.id === 'agency-id');
    const email = Array.from(children).find(c => c.id === 'contact-email');
    const overlay = document.getElementById('loading-overlay');
    const selComp = document.getElementById('selected-company');
    const selBrand = document.getElementById('selected-brand');
    const selAg = document.getElementById('selected-agency');
    const file = document.getElementById('file');
    const formData = new FormData();
    formData.append('name', campName.value);
    formData.append('categoryIds', selectedCategoryIds);
    formData.append('companyId', compId.value);
    formData.append('companyName', selComp.innerText);
    formData.append('brandName', brandName.value);
    formData.append('agencyId', agId.value);
    formData.append('emailAddress', email.value);
    if (!campName.value || !compId.value) return alert('Fill all fields');

    if (file.files.length > 0) {
        Array.from(file.files).forEach((f, i) => {
            // const fileSize = f.size;
            // const fileMb = fileSize / 1024 ** 2;
            // if (fileMb > 8)
            //     return alert(f.name + 'Attached file is too large');
            formData.append(campName.value.replaceAll(' ', '_') + '_' + i, f);
        });

    }
    overlay.style.display = 'block';
    const response = await fetch('/api/v1/campaigns/create', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
        },
        body: formData
    });
    const { result, message } = await response.json();
    overlay.style.display = 'none';
    if (result) {
        campName.value = "";
        compId.value = "";
        brandName.value = "";
        agId.value = "";
        email.value = "";
        selComp.innerText = "Select Company";
        selBrand.innerText = "Select Brand";
        selAg.innerText = "Select Agency";
        return renderCampaigns(document, idToken);
    }
    return alert(message);
}

async function updateCampaign(e) {
    e.preventDefault();
    const idToken = window.localStorage.getItem('idToken');
    const campName = document.getElementById('campaign-name');
    const compId = document.getElementById('company-id');
    const catId = document.getElementById('category-id');
    const brandName = document.getElementById('brand-name');
    const overlay = document.getElementById('loading-overlay');
    const agId = document.getElementById('agency-id');
    const email = document.getElementById('contact-email');
    const file = document.getElementById('file');
    if (!campName.value || !catId.value || !compId.value || !brandName.value || !editCampId) return alert('Fill all fields');
    const fileURL = campaigns.find(c => c.id === editCampId)?.fileURL;
    const formData = new FormData();
    formData.append('name', campName.value);
    formData.append('id', editCampId);
    formData.append('categoryIds', selectedCategoryIds);
    formData.append('companyId', compId.value);
    formData.append('brandName', brandName.value);
    formData.append('agencyId', agId.value);
    formData.append('emailAddress', email.value);
    formData.append('fileURL', fileURL);
    if (file.files.length > 0) {
        Array.from(file.files).forEach((f, i) => {
            // const fileSize = f.size;
            // const fileMb = fileSize / 1024 ** 2;
            // if (fileMb > 8)
            //     return alert(f.name + 'Attached file is too large');
            formData.append(campName.value.replaceAll(' ', '_') + '_' + i, f);
        });

    }
    if (!confirm('Are you sure you want to update campaign?')) return null;
    overlay.style.display = 'block';
    const response = await fetch('/api/v1/campaigns/update', {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + idToken
        },
        body: formData
    });
    const { result, message } = await response.json();
    overlay.style.display = 'none';
    if (result) {
        toggleEditCampaignModal();
        return renderCampaigns(document, idToken);
    }
    return alert(message);
}

async function deleteCampaign(id) {
    const idToken = window.localStorage.getItem('idToken');
    if (!id) return null;
    if (!confirm('Are you sure you want to delete Submission?')) return null;
    const response = await fetch('/api/v1/campaigns?campaignId=' + id, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + idToken
        }
    });
    const { result, message } = await response.json();
    if (!result && message.includes('auth')) {
        return signOut(window);
    }
    alert(message);
    renderCampaigns(document, idToken);
}

async function renderCampaigns(doc, idToken) {
    campaigns = await fetchCampaigns(idToken);
    if (campaigns && Array.isArray(campaigns)) {
        const campListContainer = doc.getElementById('campaigns-list');
        campListContainer.innerHTML = null;
        campaigns.forEach(camp => {
            const newDiv = doc.createElement('div');
            newDiv.className = 'campaign-info'
            const span_1 = doc.createElement('span');
            const span_2 = doc.createElement('span');
            const span_3 = doc.createElement('span');
            const span_4 = doc.createElement('span');
            const span_5 = doc.createElement('span');
            const span_6 = doc.createElement('span');
            const span_7 = doc.createElement('span');
            const span_8 = doc.createElement('span');

            let categoryIdsString = '';
            for (let i = 0; i < camp.categoryIds.length; i++) {
                const categoryId = camp.categoryIds[i];
                const cName = categories.find(c => categoryId == c.id)?.name;
                if (cName && i < (camp.categoryIds.length - 1)) categoryIdsString = categoryIdsString + `${cName}, `;
                else categoryIdsString = categoryIdsString + `${cName}.`;
            }
            if (camp.fileURLs && Array.isArray(camp.fileURLs)) {
                const linkContainer = doc.createElement('div');
                linkContainer.className = 'link-container';
                camp.fileURLs.forEach((url, i) => {
                    const lnk = doc.createElement('a');
                    const txt = doc.createTextNode('Link ' + (i + 1));
                    lnk.append(txt);
                    lnk.title = 'uploaded material_' + i + 1;
                    lnk.href = url;
                    linkContainer.appendChild(lnk);
                })
                span_1.appendChild(linkContainer);
            }
            const btn = document.createElement('span');
            btn.className = 'button';
            btn.id = camp.id;
            btn.addEventListener('click', () => {
                toggleEditCampaignModal(camp.id);
            });
            btn.innerText = 'Edit Campaign';
            const btn1 = document.createElement('span');
            btn1.className = 'button';
            btn1.addEventListener('click', () => {
                deleteCampaign(camp.id);
            });
            btn1.innerText = 'Delete Submission';
            span_7.appendChild(btn);
            span_8.appendChild(btn1);
            span_2.innerText = camp.name;
            span_3.innerText = categoryIdsString;
            span_4.innerText = camp.brandName;
            span_5.innerText = agencies?.find(a => camp.agencyId == a.id)?.name || 'No Agency';
            span_6.innerText = camp.emailAddress;

            span_1.className = 'info';
            span_2.className = 'info';
            span_3.className = 'info long';
            span_4.className = 'info';
            span_5.className = 'info';
            span_6.className = 'info';
            span_7.className = 'info';
            span_8.className = 'info';

            newDiv.appendChild(span_1);
            newDiv.appendChild(span_2);
            newDiv.appendChild(span_3);
            newDiv.appendChild(span_4);
            newDiv.appendChild(span_5);
            newDiv.appendChild(span_6);
            newDiv.appendChild(span_7);
            newDiv.appendChild(span_8);
            campListContainer.append(newDiv);
        });
    }
}

function toggleEditCampaignModal(id) {
    const editContainer = document.getElementById('new-campaign');
    const editContainerSub = document.getElementById('new-campaign-sub');
    const newCampTitle = document.getElementById('new-camp-title');
    const campForm = document.getElementById('campaigns-form');
    const campName = document.getElementById('campaign-name');
    const compId = document.getElementById('company-id');
    const catId = document.getElementById('category-id');
    const brandName = document.getElementById('brand-name');
    const agId = document.getElementById('agency-id');
    const email = document.getElementById('contact-email');
    const selComp = document.getElementById('selected-company');
    const selBrand = document.getElementById('selected-brand');
    const selCat = document.getElementById('selected-category');
    const brandNameInput = document.getElementById('brand-name');
    const selAg = document.getElementById('selected-agency');
    const fileInputCont = document.getElementById('file-drop-down');
    const fileLink = document.getElementById('file-link')
    const file = document.getElementById('file');
    if (id && typeof id === 'string') {
        editCampId = id;
        editContainer.classList.add('modal');
        editContainerSub.classList.add('edit');
        newCampTitle.innerText = 'Edit Campaign';
        const camp = campaigns.find(c => c.id === id);
        let categoryIdsString = '';
        for (let i = 0; i < camp.categoryIds.length; i++) {
            const categoryId = camp.categoryIds[i];
            const cName = categories.find(c => categoryId == c.id)?.name;
            if (cName && i < (camp.categoryIds.length - 1)) categoryIdsString = categoryIdsString + `${cName}, `;
            else categoryIdsString = categoryIdsString + `${cName}.`;
        }
        selectedCategoryIds = camp.categoryIds;
        campName.value = camp.name;
        compId.value = camp.companyId;
        catId.value = categoryIdsString;
        brandName.value = camp.brandName;
        agId.value = camp.agencyId;
        email.value = camp.emailAddress;
        brandNameInput.value = camp.brandName;
        brandNameInput.setAttribute('disabled', true);
        selAg.innerText = agencies?.find(a => a.id === camp.agencyId)?.name || 'Select Agency';
        selComp.innerText = companies?.find(c => c.id === camp.companyId)?.name || 'Select Company';
        selBrand.innerText = camp.brandName;
        selCat.innerText = categoryIdsString;
        if (camp.fileURLs && Array.isArray(camp.fileURLs)) {
            const linkContainer = document.createElement('div');
            linkContainer.className = 'link-container';
            linkContainer.id = 'file-link';
            camp.fileURLs.forEach((url, i) => {
                const lnk = document.createElement('a');
                const txt = document.createTextNode('Link ' + (i + 1));
                lnk.append(txt);
                lnk.title = 'uploaded material_' + i + 1;
                lnk.href = url;
                linkContainer.appendChild(lnk);
            })
            fileInputCont.appendChild(linkContainer);
        }
        campForm.removeEventListener('submit', submitCampaign);
        campForm.addEventListener('submit', updateCampaign);
        editContainerSub.addEventListener('click', preventPropagation);
        editContainer.addEventListener('click', toggleEditCampaignModal);
    } else {
        editContainer.removeEventListener('click', toggleEditCampaignModal);
        editContainerSub.removeEventListener('click', preventPropagation);
        editContainer.classList.remove('modal');
        editContainerSub.classList.remove('edit');
        newCampTitle.innerText = 'Create New Agency';
        campName.value = null;
        compId.value = null;
        catId.value = null;
        brandName.value = null;
        brandNameInput.removeAttribute('disabled');
        fileLink && fileInputCont.removeChild(fileLink);
        file.value = null;
        file.remove
        agId.value = null;
        email.value = null;
        selAg.innerText = 'Select Agency';
        selComp.innerText = 'Select Company';
        selBrand.innerText = 'Select Brand';
        selCat.innerText = 'Select Categories(One or more)';
        brandNameInput.value = null;
        campForm.removeEventListener('submit', updateCampaign);
        campForm.addEventListener('submit', submitCampaign);
    }
}

/** Companies */

async function submitCompany(e) {
    e.preventDefault();
    const idToken = window.localStorage.getItem('idToken');
    const children = e.target.children;
    const compName = Array.from(children).find(c => c.id === 'company-name');
    const compBrands = Array.from(children).find(c => c.id === 'company-brands');
    const compEmail = Array.from(children).find(c => c.id === 'company-email');
    if (!compName.value || !validateEmail(compEmail)) return;
    const response = await fetch(baseURL + '/api/v1/companies/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + idToken
        },
        body: JSON.stringify({ name: compName.value, brands: compBrands.value?.split(","), emailAddress: compEmail.value })
    });
    const { result, message } = await response.json();
    if (result) {
        compName.value = "";
        compBrands.value = "";
        compEmail.value = "";
        return renderCompanies(document, idToken);
    }
    return alert(message);
}

async function updateCompany(e) {
    e.preventDefault();
    const idToken = window.localStorage.getItem('idToken');
    const children = e.target.children;
    const compName = Array.from(children).find(c => c.id === 'company-name');
    const compBrands = Array.from(children).find(c => c.id === 'company-brands');
    const compEmail = Array.from(children).find(c => c.id === 'company-email');
    if (!compName.value || !compBrands.value || !validateEmail(compEmail)) return;
    const response = await fetch(baseURL + '/api/v1/companies/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + idToken
        },
        body: JSON.stringify({ companyId: editCompId, details: { name: compName.value, brands: compBrands.value.split(","), emailAddress: compEmail.value } })
    });
    const { result, message } = await response.json();
    if (result) {
        toggleEditCompanyModal();
        return renderCompanies(document, idToken);
    }
    return alert(message);
}

async function fetchCompanies(idToken) {
    const response = await fetch(baseURL + '/api/v1/companies', {
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

async function deleteCompany(id) {
    const idToken = window.localStorage.getItem('idToken');
    if (!id) return null;
    if (!confirm('Are you sure you want to delete Company?')) return null;
    const response = await fetch('/api/v1/companies?companyId=' + id, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + idToken
        }
    });
    const { result, message } = await response.json();
    if (!result && message.includes('auth')) {
        return signOut(window);
    }
    alert(message);
    renderCompanies(document, idToken);
}

async function renderCompanies(doc, idToken) {
    companies = await fetchCompanies(idToken);
    if (companies && Array.isArray(companies)) {
        const compListContainer = doc.getElementById('companies-list');
        compListContainer.innerHTML = null;
        companies.forEach(comp => {
            const newDiv = doc.createElement('div');
            newDiv.className = 'company-info'
            const span_1 = doc.createElement('span');
            const span_2 = doc.createElement('span');
            const span_3 = doc.createElement('span');
            const span_4 = doc.createElement('span');
            const span_5 = doc.createElement('span');

            span_1.innerText = comp.name;
            span_2.innerText = comp.brands.join(', ');
            span_3.innerText = comp.emailAddress;

            const btn = document.createElement('span');
            btn.className = 'button';
            btn.id = comp.id;
            btn.addEventListener('click', () => {
                toggleEditCompanyModal(comp.id);
            });
            btn.innerText = 'Edit Company';
            const btn1 = document.createElement('span');
            btn1.className = 'button';
            btn1.addEventListener('click', () => {
                deleteCompany(comp.id);
            });

            btn1.innerText = 'Delete Company';

            span_5.appendChild(btn1);
            span_4.appendChild(btn);

            span_1.className = 'info';
            span_2.className = 'info';
            span_3.className = 'info';
            span_4.className = 'info';
            span_5.className = 'info';

            newDiv.appendChild(span_1);
            newDiv.appendChild(span_2);
            newDiv.appendChild(span_3);
            newDiv.appendChild(span_4);
            newDiv.appendChild(span_5);
            compListContainer.append(newDiv);
        });
    }
}

function toggleEditCompanyModal(id) {
    const editContainer = document.getElementById('new-company');
    const editContainerSub = document.getElementById('new-company-sub');
    const newCompTitle = document.getElementById('new-comp-title');
    const compName = document.getElementById('company-name');
    const compForm = document.getElementById('companies-form');
    const compEmail = document.getElementById('company-email');
    const compBrands = document.getElementById('company-brands');
    if (id && typeof id === 'string') {
        editCompId = id;
        editContainer.classList.add('modal');
        editContainerSub.classList.add('edit');
        newCompTitle.innerText = 'Edit Company';
        const comp = companies.find(c => c.id === id);
        compName.value = comp.name;
        compEmail.value = comp.emailAddress;
        compBrands.value = comp.brands.join(',');
        compForm.removeEventListener('submit', submitCompany);
        compForm.addEventListener('submit', updateCompany);
        editContainerSub.addEventListener('click', preventPropagation);
        editContainer.addEventListener('click', toggleEditCompanyModal);
    } else {
        editContainer.removeEventListener('click', toggleEditCompanyModal);
        editContainerSub.removeEventListener('click', preventPropagation);
        editContainer.classList.remove('modal');
        editContainerSub.classList.remove('edit');
        newCompTitle.innerText = 'Create New Agency';
        compName.value = null;
        compEmail.value = null;
        compBrands.value = null;
        compForm.removeEventListener('submit', updateCompany);
        compForm.addEventListener('submit', submitCompany);
    }
}

/** Agencies */

async function submitAgency(e) {
    e.preventDefault();
    const idToken = window.localStorage.getItem('idToken');
    const children = e.target.children;
    const agName = Array.from(children).find(c => c.id === 'agency-name');
    const agEmail = Array.from(children).find(c => c.id === 'agency-email');
    const agIntro = Array.from(children).find(c => c.id === 'agency-intro');
    if (!agName.value || !agEmail.value) return;
    const response = await fetch(baseURL + '/api/v1/agencies/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + idToken
        },
        body: JSON.stringify({ name: agName.value, introduction: agIntro.value, emailAddress: agEmail.value })
    });
    const { result, message } = await response.json();
    if (result) {
        agName.value = "";
        agEmail.value = "";
        agIntro.value = "";
        return renderAgencies(document, idToken);
    }
    return alert(message);
}

async function updateAgency(e) {
    e.preventDefault();
    const idToken = window.localStorage.getItem('idToken');
    const agName = document.getElementById('agency-name');
    const agEmail = document.getElementById('agency-email');
    const agIntro = document.getElementById('agency-intro');
    if (!agName.value || !agEmail.value || !editAgId) return;
    if (!confirm('Are you sure you want to update agency?')) return null;
    const response = await fetch(baseURL + '/api/v1/agencies/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + idToken
        },
        body: JSON.stringify({ agencyId: editAgId, details: { name: agName.value, introduction: agIntro.value, emailAddress: agEmail.value } })
    });
    const { result, message } = await response.json();
    if (result) {
        toggleEditAgencyModal();
        return renderAgencies(document, idToken);
    }
    return alert(message);
}

async function fetchAgencies(idToken) {
    const response = await fetch(baseURL + '/api/v1/agencies', {
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

async function deleteAgency(id) {
    const idToken = window.localStorage.getItem('idToken');
    if (!id) return null;
    if (!confirm('Are you sure you want to delete Agency?')) return null;
    const response = await fetch('/api/v1/agencies?agencyId=' + id, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + idToken
        }
    });
    const { result, message } = await response.json();
    if (!result && message.includes('auth')) {
        return signOut(window);
    }
    alert(message);
    renderAgencies(document, idToken);
}

async function renderAgencies(doc, idToken) {
    agencies = await fetchAgencies(idToken);
    if (agencies && Array.isArray(agencies)) {
        const agListContainer = doc.getElementById('agencies-list');
        agListContainer.innerHTML = null;
        agencies.forEach(ag => {
            const newDiv = doc.createElement('div');
            newDiv.className = 'agency-info'
            const span_1 = doc.createElement('span');
            const span_2 = doc.createElement('span');
            const span_3 = doc.createElement('span');
            const span_4 = doc.createElement('span');
            const span_5 = doc.createElement('span');
            span_1.innerText = ag.name;
            span_2.innerText = ag.emailAddress;
            span_3.innerText = ag?.introduction || '';
            const btn = document.createElement('span');
            btn.className = 'button';
            btn.id = ag.id;
            btn.addEventListener('click', () => {
                toggleEditAgencyModal(ag.id);
            });
            btn.innerText = 'Edit Agency';
            const btn1 = document.createElement('span');
            btn1.className = 'button';
            btn1.addEventListener('click', () => {
                deleteAgency(ag.id);
            });
            btn1.innerText = 'Delete Agency';
            span_1.className = 'info';
            span_2.className = 'info';
            span_3.className = 'info long';
            span_4.className = 'info';
            span_5.className = 'info';
            span_4.appendChild(btn);
            span_5.appendChild(btn1);
            newDiv.appendChild(span_1);
            newDiv.appendChild(span_2);
            newDiv.appendChild(span_3);
            newDiv.appendChild(span_4);
            newDiv.appendChild(span_5);
            agListContainer.append(newDiv);
        });
    }
}

function toggleEditAgencyModal(id) {
    const editContainer = document.getElementById('new-agency');
    const editContainerSub = document.getElementById('new-agency-sub');
    const newAgTitle = document.getElementById('new-ag-title');
    const agName = document.getElementById('agency-name');
    const agForm = document.getElementById('agencies-form');
    const agEmail = document.getElementById('agency-email');
    const agIntro = document.getElementById('agency-intro');
    if (id && typeof id === 'string') {
        editAgId = id;
        editContainer.classList.add('modal');
        editContainerSub.classList.add('edit');
        newAgTitle.innerText = 'Edit Agency';
        const ag = agencies.find(a => a.id === id);
        agName.value = ag.name;
        agEmail.value = ag.emailAddress;
        agIntro.value = ag.introduction;
        agForm.removeEventListener('submit', submitAgency);
        agForm.addEventListener('submit', updateAgency);
        editContainerSub.addEventListener('click', preventPropagation);
        editContainer.addEventListener('click', toggleEditAgencyModal);
    } else {
        editContainer.removeEventListener('click', toggleEditAgencyModal);
        editContainerSub.removeEventListener('click', preventPropagation);
        editContainer.classList.remove('modal');
        editContainerSub.classList.remove('edit');
        newAgTitle.innerText = 'Create New Agency';
        agName.value = null;
        agEmail.value = null;
        agIntro.value = null;
        agForm.removeEventListener('submit', updateAgency);
        agForm.addEventListener('submit', submitAgency);
    }
}

/** Categories */

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

async function updateCategory(e) {
    e.preventDefault();
    const idToken = window.localStorage.getItem('idToken');
    const catName = document.getElementById('category-name');
    const catDesc = document.getElementById('category-desc');
    if (!catName.value || !catDesc.value || !editCatId) return null;
    if (!confirm('Are you sure you want to update category?')) return null;
    const response = await fetch(baseURL + '/api/v1/categories/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + idToken
        },
        body: JSON.stringify({ categoryId: editCatId, details: { name: catName.value, desc: catDesc.value } })
    });
    const { result, message } = await response.json();
    if (result) {
        toggleEditCategoryModal();
        return renderCategories(document, idToken);
    }
    return alert(message);
}

async function deleteCategory(id) {
    const idToken = window.localStorage.getItem('idToken');
    if (!id) return null;
    if (!confirm('Are you sure you want to delete Category?')) return null;
    const response = await fetch('/api/v1/categories?categoryId=' + id, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + idToken
        }
    });
    const { result, message } = await response.json();
    if (!result && message.includes('auth')) {
        return signOut(window);
    }
    alert(message);
    renderCategories(document, idToken);
}

async function renderCategories(doc, idToken) {
    categories = await fetchCategories(idToken);
    selectedCategoryId = categories[0]?.id;
    if (categories && Array.isArray(categories)) {
        const catListContainer = doc.getElementById('categories-list');
        catListContainer.innerHTML = null;
        categories.forEach(cat => {
            const newDiv = doc.createElement('div');
            newDiv.className = 'category-info'
            const span_1 = doc.createElement('span');
            const span_2 = doc.createElement('span');
            const span_3 = doc.createElement('span');
            const span_4 = doc.createElement('span');
            span_2.innerText = cat.name;
            span_3.innerText = cat.desc;
            const btn = document.createElement('span');
            btn.className = 'button';
            btn.id = cat.id;
            btn.addEventListener('click', () => {
                toggleEditCategoryModal(cat.id);
            });
            btn.innerText = 'Edit Category';
            const btn1 = document.createElement('span');
            btn1.className = 'button';
            btn1.id = cat.id;
            btn1.addEventListener('click', () => {
                deleteCategory(cat.id);
            });
            btn1.innerText = 'Delete Category';
            span_4.appendChild(btn);
            span_1.className = 'info';
            span_2.className = 'info';
            span_3.className = 'info desc';
            span_4.className = 'info';
            span_1.appendChild(btn1);
            newDiv.appendChild(span_2);
            newDiv.appendChild(span_3);
            newDiv.appendChild(span_4);
            newDiv.appendChild(span_1);
            catListContainer.append(newDiv);
        });
    }

}

function toggleEditCategoryModal(id) {
    const editContainer = document.getElementById('new-category');
    const editContainerSub = document.getElementById('new-category-sub');
    const newCatTitle = document.getElementById('new-cat-title');
    const catName = document.getElementById('category-name');
    const catForm = document.getElementById('categories-form');
    const catDesc = document.getElementById('category-desc');
    if (id && typeof id === 'string') {
        editCatId = id;
        editContainer.classList.add('modal');
        editContainerSub.classList.add('edit');
        newCatTitle.innerText = 'Edit Category';
        const cat = categories.find(c => c.id === id);
        catName.value = cat.name;
        catDesc.value = cat.desc;
        catForm.removeEventListener('submit', submitCategory);
        catForm.addEventListener('submit', updateCategory);
        editContainerSub.addEventListener('click', preventPropagation);
        editContainer.addEventListener('click', toggleEditCategoryModal);
    } else {
        editContainer.removeEventListener('click', toggleEditCategoryModal);
        editContainerSub.removeEventListener('click', preventPropagation);
        editContainer.classList.remove('modal');
        editContainerSub.classList.remove('edit');
        newCatTitle.innerText = 'Create New Category';
        catName.value = null;
        catDesc.value = null;
        catForm.removeEventListener('submit', updateCategory);
        catForm.addEventListener('submit', submitCategory);
    }
}

/** nominations */

async function renderNominations(doc, idToken, selectedCategoryId) {
    nominations = await fetchNominations(idToken, '', selectedCategoryId);
    const selectedCat = doc.getElementById('nom-selected-category');
    const nomListContainer = doc.getElementById('nominations-list');
    nomListContainer.innerHTML = null;
    selectedCat.innerText = categories.find(c => c.id === selectedCategoryId)?.name || 'No Categories Available';
    nominations?.forEach(n => {
        const newDiv = doc.createElement('div');
        newDiv.className = 'nomination-info';/** change class name */
        const span_1 = doc.createElement('span');
        const span_2 = doc.createElement('span');
        const span_3 = doc.createElement('span');
        const span_4 = doc.createElement('span');
        const span_5 = doc.createElement('span');
        const span_6 = doc.createElement('span');
        const span_7 = doc.createElement('span');
        const span_8 = doc.createElement('span');

        span_1.id = 'judge-id';
        span_2.id = 'campaign-id';
        span_3.id = 'big-idea-r';
        span_4.id = 'insight-r';
        span_5.id = 'comm-integration-r';
        span_6.id = 'kpis_impact-r';
        span_7.id = 'execution-r';
        span_8.id = 'total-r';

        span_1.className = 'info';
        span_2.className = 'info';
        span_3.className = 'info';
        span_4.className = 'info';
        span_5.className = 'info';
        span_6.className = 'info';
        span_7.className = 'info';
        span_8.className = 'info';

        span_1.innerText = n.judgeId.substring(0, 12) + '..';
        span_2.innerText = campaigns?.find(c => c.id === n.campaignId)?.name;
        span_3.innerText = n.alignment;
        span_4.innerText = n.objectives;
        span_5.innerText = n.implementation;
        span_6.innerText = n.impact;
        span_7.innerText = n.why_win;
        span_8.innerText = n.total;

        newDiv.appendChild(span_1);
        newDiv.appendChild(span_2);
        newDiv.appendChild(span_3);
        newDiv.appendChild(span_4);
        newDiv.appendChild(span_5);
        newDiv.appendChild(span_6);
        newDiv.appendChild(span_7);
        newDiv.appendChild(span_8);
        nomListContainer.appendChild(newDiv);
    });
}

/** Users */

async function createUser(e) {
    e.preventDefault();
    const idToken = window.localStorage.getItem('idToken');
    const children = e.target.children;
    const userEmail = Array.from(children).find(c => c.id === 'user-email');
    const userPassword = Array.from(children).find(c => c.id === 'user-password');
    if (!validateEmail(userEmail) || !validatePassword(userPassword)) return;
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

async function renderUsers(doc, idToken) {
    users = await fetchUsers(idToken);
    if (users && Array.isArray(users)) {
        const userListContainer = doc.getElementById('users-list');
        userListContainer.innerHTML = null;
        users.forEach(user => {
            const newDiv = doc.createElement('div');
            newDiv.className = 'user-info'
            const span_1 = doc.createElement('span');
            const span_2 = doc.createElement('span');
            const span_3 = doc.createElement('span');
            const span_4 = doc.createElement('span');
            const span_sub_3 = doc.createElement('span');
            span_2.innerText = user.email;

            span_sub_3.innerText = user.emailVerified ? "Unverify" : "Verify";
            span_sub_3.className = 'action';

            const btn = document.createElement('span');
            btn.className = 'button';
            btn.id = user.uid;
            btn.addEventListener('click', () => {
                toggleEditUserModal(user.uid);
            });
            btn.innerText = 'Edit User';
            const btn1 = document.createElement('span');
            btn1.className = 'button';
            btn1.id = user.uid;
            btn1.addEventListener('click', () => {
                deleteUser(user.uid);
            });
            btn1.innerText = 'Delete User';

            span_sub_3.addEventListener('click', async function (e) {
                e.preventDefault();
                await toggleVerification(user.uid, !user.emailVerified, idToken);
                return renderUsers(doc, idToken);
            });

            span_1.className = 'info';
            span_2.className = 'info lng';
            span_3.className = 'info';
            span_4.className = 'info';
            span_4.appendChild(btn);
            span_1.appendChild(btn1);
            span_3.appendChild(span_sub_3);
            newDiv.appendChild(span_2);
            newDiv.appendChild(span_3);
            newDiv.appendChild(span_4);
            newDiv.appendChild(span_1);
            userListContainer.append(newDiv);
        });
    }
}

function toggleEditUserModal(id) {
    const editContainer = document.getElementById('new-user');
    const editContainerSub = document.getElementById('new-user-sub');
    const newUserTitle = document.getElementById('new-user-title');
    const userForm = document.getElementById('users-form');
    const userEmail = document.getElementById('user-email');
    const userPassword = document.getElementById('user-password');
    if (id && typeof id === 'string') {
        editUserId = id;
        editContainer.classList.add('modal');
        editContainerSub.classList.add('edit');
        newUserTitle.innerText = 'Edit User Information';
        const user = users.find(u => u.uid === id);
        userEmail.value = user.email;
        userForm.removeEventListener('submit', createUser);
        userForm.addEventListener('submit', updateUser);
        editContainerSub.addEventListener('click', preventPropagation);
        editContainer.addEventListener('click', toggleEditUserModal);
    } else {
        editContainer.removeEventListener('click', toggleEditUserModal);
        editContainerSub.removeEventListener('click', preventPropagation);
        editContainer.classList.remove('modal');
        editContainerSub.classList.remove('edit');
        newUserTitle.innerText = 'Create New User';
        userEmail.value = null;
        userPassword.value = null;
        userForm.removeEventListener('submit', updateUser);
        userForm.addEventListener('submit', createUser);
    }
}

async function toggleVerification(uid, value, idToken) {
    if (!uid || value == undefined || !idToken) return null;
    const response = await fetch(baseURL + '/api/v1/users/Admin-verify-user', {
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

async function updateUser(e) {
    e.preventDefault();
    const userEmail = document.getElementById('user-email');
    const userPassword = document.getElementById('user-password');
    const uid = editUserId,
        email = userEmail.value,
        password = userPassword.value,
        idToken = window.localStorage.getItem('idToken');
    if (!uid || !validateEmail(userEmail) || !validatePassword(userPassword) || !idToken) return null;
    const response = await fetch('/api/v1/users/update', {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + idToken
        },
        body: JSON.stringify({ uid, email, password })
    });
    const { result, message } = await response.json();
    if (!result && message.includes('auth')) {
        return signOut(window);
    }
    alert(message);
    toggleEditUserModal();
}

async function deleteUser(uid) {
    const idToken = window.localStorage.getItem('idToken');
    if (!uid) return null;
    if (!confirm('Are you sure you want to delete user?')) return null;
    const response = await fetch('/api/v1/users?uid=' + uid, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + idToken
        }
    });
    const { result, message } = await response.json();
    if (!result && message.includes('auth')) {
        return signOut(window);
    }
    alert(message);
    renderUsers(document, idToken);
}