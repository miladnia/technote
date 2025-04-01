function request(url, resultCallback, messageCallback) {
  if (Array.isArray(url)) {
    url = `${url[0]}/${encodeURIComponent(url[1])}`;
  }
  fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`${res.statusText} (Failed to load "${url}")`);
      }
      return res.json();
    })
    .then(data => {
      if (data.result) {
        resultCallback(data.result);
      } else {
        throw new Error(`Bad response ${JSON.stringify(data)} (GET "${url}")`)
      }
    })
    .catch(error => {
      console.error('[request]', error);
      if (messageCallback) {
        messageCallback('Something went wrong.');
      }
  });
};

function requestPOST(url, payload, resultCallback, messageCallback) {
  const body = JSON.stringify(payload);
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body,
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`${res.statusText} (POST "${url}" ${body})`);
      }
      return res.json();
    })
    .then(data => {
      if (data.message) {
        console.warn('[request]', data.message);
        if (messageCallback) {
          messageCallback(data.message);
        }
      } else if (data.result) {
        resultCallback(data.result);
      } else {
        throw new Error(`Bad response ${JSON.stringify(data)} (POST request "${url}" ${body})`)
      }
    })
    .catch(error => {
      console.error('[request]', error);
      if (messageCallback) {
        messageCallback('Something went wrong.');
      }
  });
}

export { request, requestPOST };
