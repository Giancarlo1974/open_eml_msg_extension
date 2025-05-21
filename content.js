document.addEventListener('click', function (e) {
  const link = e.target.closest('a');
  if (!link || !link.href) return;

  const href = link.href;
  
  if (href.match(/\.(eml|msg)(\?.*)?$/i)) {
    console.log('[Open EML & MSG] Clicked link:', href);
    e.preventDefault();

    const encoded = encodeURIComponent(href);
    const customUrl = `emlopen://${encoded}`;

    console.log('[Open EML & MSG] Redirecting to custom protocol:', customUrl);

    window.location.href = customUrl;
  }
}, true);
