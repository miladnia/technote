import * as utils from './utils.js';

function init() {
    const searchBox = document.getElementById('searchBox');

    if (!searchBox) {
        return;
    }

    // On `#searchInput` focus
    document.getElementById('searchInput').addEventListener(
        'focus', onInputFocus
    );
    // On `#searchForm` submit
    document.getElementById('searchForm').addEventListener(
        'submit', onFormSubmit
    );
    // On `#searchBox` focus out
    searchBox.addEventListener(
        'focusout', onFocusOut
    );
}

function focus() {
    document.getElementById('searchInput').focus();
}

function onInputFocus(event) {
    const searchInput = event.currentTarget;
    searchInput.select();
    openPanel();
}

async function onFormSubmit(event) {
    event.preventDefault();
    const searchForm = event.currentTarget;
    await submitSearchQuery(searchForm);
}

function onFocusOut(event) {
    const searchBox = event.currentTarget;
    // Is it an Element inside searchBox?
    if (event.relatedTarget &&
        event.relatedTarget.closest(`#${searchBox.id}`)) {
            return;
    }
    closePanel();
}

async function submitSearchQuery(form) {
    renderLoading();
    let results = [];

    try {
        results = await utils.submitForm(form);
    } catch (error) {
        console.error(error.message);
    }

    if (!results.length) {
        renderNoResult();
        return;
    }

    const query = form.q.value;
    renderResults(results, query);
}

function renderResults(results, query) {
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
                'mousedown', onResultMousedown, {once: true}
            );
        });
        // Remove the ref node
        itemTemplate.remove();
    });

    // Remove the ref node
    sectionTemplate.remove();
    openPanel(fragment);
}

function onResultMousedown(event) {
    // Add text fragment to the URL
    const link = event.currentTarget;
    const markedText = link.querySelector('mark').textContent;
    const itemUrl = link.href;
    link.href += utils.generateTextFragment(link.textContent, markedText);

    // We are already in the same page
    if (itemUrl === location.href) {
        link.addEventListener('click', utils.onTextFragmentClick);
    }
}

function renderLoading() {
    const template = document.getElementById('searchLoadingTemplate');
    const templateNode = template.content.firstElementChild.cloneNode(true);
    openPanel(templateNode);
}

function renderNoResult() {
    const template = document.getElementById('searchNoResultTemplate');
    const templateNode = template.content.firstElementChild.cloneNode(true);
    openPanel(templateNode);
}

function openPanel(fragment) {
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

function closePanel() {
    const panel = document.getElementById('searchPanel');
    panel.style.display = 'none';
}

export { init, focus };
