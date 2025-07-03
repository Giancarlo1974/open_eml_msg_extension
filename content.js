/**
 * Helper function for direct download without relaunching click
 * This function adds a special attribute to the original link to avoid
 * being intercepted by our own click listener, then clicks it directly
 */
function delayedDownload(link, url) {
  console.log('delayedDownload: ultra simplified version');
  
  // Add special attribute to prevent our listener from intercepting this link
  link.setAttribute('data-emlopen-ignore', 'true');
  
  // Click the original link directly (preserves any target attribute)
  link.click();
}

/**
 * Main click event listener for the extension
 * This intercepts all clicks on links and handles them based on the URL or content type
 */
document.addEventListener('click', async function (e) {
  // Find if the clicked element is a link or is inside a link
  const link = e.target.closest('a');
  if (!link || !link.href) return; // Exit if not a link or no href
  
  // Ignore links with data-emlopen-ignore attribute (temporary links for downloads)
  if (link.hasAttribute('data-emlopen-ignore')) {
    console.log('Temporary download link, ignoring');
    return;
  }

  console.log('Evaluating link');

  // 1. Block default link behavior immediately
  e.preventDefault();
  e.stopImmediatePropagation();

  const url = link.href;

  // 2. First check if it's an .eml or .msg file based on extension
  if (url.match(/\.(eml|msg)(\?.*)?$/i)) {
    // If it's an email file, encode the URL and open with our custom protocol
    const encoded = encodeURIComponent(url);
    const customUrl = `emlopen://${encoded}`;
    window.location.href = customUrl;
    return;
  }

  // 3. If not identified by extension, check content type with HEAD request
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      mode: 'cors'
    });
    const contentType = res.headers.get('content-type');
    // 4. If it's an Outlook MIME type, use our custom protocol
    if (contentType && contentType.includes('application/vnd.ms-outlook')) {
      const customUrl = url.replace('https', 'emlopen');
      window.location.href = customUrl;
      return;
    }
  } catch (err) {
    console.error('Error in HEAD request:', err);
  }

  // 5. If no special handling was triggered, use regular download
  console.log('No special handling needed, using regular download');
  delayedDownload(link, url);
}, true);
