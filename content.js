// EML Opener Helper - Chrome Extension
// This extension lets users open .eml and .msg email files directly in Outlook from the browser.
// It listens for clicks on links to these files and redirects them using a custom protocol (emlopen://),
// so a native app can handle the file without the user needing to download it first.

/**
 * Triggers a direct download of the link, bypassing our extension's click logic.
 * Adds a special attribute to the link so our listener ignores it, then clicks it.
 * Used as a fallback if the link is not an email file.
 * @param {HTMLElement} link - The <a> element to trigger download on
 */
function directDownload(link) {
  // Mark this link to be ignored by our click handler
  link.setAttribute('data-emlopen-ignore', 'true');
  // Simulate a click to start the download (browser default behavior)
  link.click();
}

/**
 * Main click event handler for the extension.
 * Intercepts all clicks on <a> links in the page.
 */
document.addEventListener('click', async function (e) {
  // Try to find the nearest <a> (link) element that was clicked
  const link = e.target.closest('a');

  // If not a link, or no href, or this link should be ignored, do nothing
  if (!link || !link.href || link.hasAttribute('data-emlopen-ignore')) return;

  // Stop the browser from following the link as usual
  e.preventDefault();
  e.stopImmediatePropagation();

  // Get the URL from the link
  const url = link.href;
  let encodedUrl = '';

  // STEP 1: Check if the link points to a .eml or .msg file by extension
  if (url.match(/\.(eml|msg)(\?.*)?$/i)) {
    // If yes, encode the URL for safe use in a custom protocol
    encodedUrl = encodeURIComponent(url);
  } else {
    // STEP 2: If not by extension, check the file's content type with a HEAD request
    try {
      const res = await fetch(url, {
        method: 'HEAD', // Only fetch headers, not the whole file
        mode: 'cors'    // Allow cross-origin requests
      });
      const contentType = res.headers.get('content-type');
      // If the content type matches Outlook files, treat as email file
      if (contentType && contentType.includes('application/vnd.ms-outlook')) {
        encodedUrl = encodeURIComponent(url);
      }
    } catch (err) {
      // If there is an error checking the file type, log it but continue
      console.error('Error in HEAD request:', err);
    }
  }

  // STEP 3: If we determined it's an email file, redirect with the custom protocol
  if (encodedUrl !== '') {
    const customUrl = `emlopen://${encodedUrl}`;
    window.location.href = customUrl;
    return;
  } else {
    // STEP 4: Otherwise, just trigger a normal download
    directDownload(link);    
  }

}, true);
