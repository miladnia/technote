"use strict";

function initSearchBox() {
    const searchBox = document.getElementById('searchBox');

    if (!searchBox) {
        return;
    }

    // On `#searchInput` focus
    document.getElementById('searchInput').addEventListener(
        'focus', onSearchInputFocus
    );
    // On `#searchForm` submit
    document.getElementById('searchForm').addEventListener(
        'submit', onSearchFormSubmit
    );
    // On `#searchBox` focus out
    searchBox.addEventListener(
        'focusout', onSearchBoxFocusOut
    );
}

function onSearchInputFocus(event) {
    const searchInput = event.currentTarget;
    searchInput.select();
    openSearchPanel();
}

async function onSearchFormSubmit(event) {
    event.preventDefault();
    const searchForm = event.currentTarget;
    await submitSearchQuery(searchForm);
}

function onSearchBoxFocusOut(event) {
    const searchBox = event.currentTarget;
    // Is it an Element inside searchBox?
    if (event.relatedTarget &&
        event.relatedTarget.closest(`#${searchBox.id}`)) {
            return;
    }
    closeSearchPanel();
}

function focusSearchBox() {
    document.getElementById('searchInput').focus();
}

async function submitSearchQuery(form) {
    renderSearchLoading();
    let results = [];

    try {
        results = await submitForm(form);
    } catch (error) {
        console.error(error.message);
    }

    if (!results.length) {
        renderSearchNoResult();
        return;
    }

    const query = form.q.value;
    renderSearchResults(results, query);
}

function renderSearchResults(results, query) {
    const template = document.getElementById('searchResultsTemplate');
    const sectionTemplate = template.content.firstElementChild.cloneNode(true);
    const fragment = document.createDocumentFragment();

    results.forEach(entry => {
        const section = sectionTemplate.cloneNode(true);
        fragment.appendChild(section);
        // Replace placeholders
        section.innerHTML = section.innerHTML
            .replaceAll('[[ source ]]', entry['source']);

        // Create items for the section
        const itemTemplate = section.querySelector('[data-iterate-for="occurrence"]');
        entry['occurrences'].forEach(occurrence => {
            const item = itemTemplate.cloneNode(true);
            itemTemplate.parentNode.appendChild(item);
            // Replace placeholders
            const markedText = occurrence.replaceAll(
                query, `<mark>${query}</mark>`
            );
            item.innerHTML = item.innerHTML
                .replaceAll('[[ occurrence ]]', markedText)
                .replaceAll('[[ url ]]', entry['source_url']);
            item.querySelector('a').addEventListener(
                'mousedown', onSearchResultMousedown, {once: true}
            );
        });
        // Remove the ref node
        itemTemplate.remove();
    });

    // Remove the ref node
    sectionTemplate.remove();
    openSearchPanel(fragment);
}

function onSearchResultMousedown(event) {
    // Add text fragment to the URL
    const link = event.currentTarget;
    const markedText = link.querySelector('mark').textContent;
    const itemUrl = link.href;
    link.href += generateTextFragment(link.textContent, markedText);

    // We are already in the same page
    if (itemUrl === location.href) {
        link.addEventListener('click', onTextFragmentClick);
    }
}

function renderSearchLoading() {
    const template = document.getElementById('searchLoadingTemplate');
    const templateNode = template.content.firstElementChild.cloneNode(true);
    openSearchPanel(templateNode);
}

function renderSearchNoResult() {
    const template = document.getElementById('searchNoResultTemplate');
    const templateNode = template.content.firstElementChild.cloneNode(true);
    openSearchPanel(templateNode);
}

function openSearchPanel(fragment) {
    const container = document.getElementById('searchPanelContainer');
    
    if (!fragment && '' == container.textContent) {
        return;
    }

    if (fragment) {
        container.textContent = '';
        container.appendChild(fragment);
    }

    const panel = document.getElementById('searchPanel');
    panel.style.display = 'block';
}

function closeSearchPanel() {
    const panel = document.getElementById('searchPanel');
    panel.style.display = 'none';
}
