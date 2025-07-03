document.addEventListener('click', async function (e) {

  const link = e.target.closest('a');
  if (!link || !link.href) return;

  const url = link.href;
  // console.log(url);

  try {
    const res = await fetch(url, {
      method: 'HEAD',
      mode: 'cors'
    });

    const contentType = res.headers.get('content-type');
    // console.log('Content-Type:', contentType);

    if (url.match(/\.(eml|msg)(\?.*)?$/i)) {
      e.preventDefault();
      e.stopImmediatePropagation();

      // console.log('[Open EML & MSG] Clicked link:', url);

      const encoded = encodeURIComponent(url);
      const customUrl = `emlopen://${encoded}`;

      // console.log('[Open EML & MSG] Redirecting to custom protocol:', customUrl);

      window.location.href = customUrl;
    } else if (contentType && contentType.includes('application/vnd.ms-outlook')) {
      e.preventDefault()
      e.stopImmediatePropagation();
      const customUrl = url.replace('https', 'emlopen')
      window.location.href = customUrl;
    }

  } catch (err) {
    console.error('Errore nella richiesta HEAD:', err);
  }
}, true);
