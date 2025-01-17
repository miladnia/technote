async function submitForm(form) {
    const formData = new FormData(form);
    const queryString = new URLSearchParams(formData).toString();
    const response = await fetch(`${form.action}?${queryString}`);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
}

async function fetchUrl(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    return response;
}

async function fetchText(url) {
    const response = await fetchUrl(url);
    return await response.text();
}

function disableFormElements(form, disabled = true) {
    // Disable all of the elements
    Array.from(form.elements).forEach(element => {
        // Ignore the buttons with `button` type.
        if ('button' === element.type) {
            return;
        }
        element.disabled = disabled
    });
}

function generateTextFragment(text, selection) {
    const selectionIndex = text.indexOf(selection);

    if (-1 === selectionIndex) {
        return '';
    }

    let prefix = text.substring(0, selectionIndex).trim();
    prefix = prefix ? `${encodeURIComponent(prefix)}-,` : '';
    let suffix = text.substring(selectionIndex + selection.length).trim();
    suffix = suffix ? `,-${encodeURIComponent(suffix)}` : '';

    return `#:~:text=${prefix}${selection}${suffix}`;
}

function onTextFragmentClick(event) {
    const url = event.currentTarget.href;
    location.href = '#';
    setTimeout(() => {
        location.href = url;
    }, 100);
}

export { submitForm, fetchText, disableFormElements, generateTextFragment, onTextFragmentClick };
