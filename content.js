// Redirect to channel videos tab
function redirectToChannelVideos() {
  const url = window.location.href;
  const pathname = window.location.pathname;

  // Check if we're on a channel page but not already on /videos, /shorts, /streams, /playlists, /community, /about, etc.
  const isChannelPage = pathname.match(/^\/@[^\/]+$/) || pathname.match(/^\/channel\/[^\/]+$/);

  if (isChannelPage) {
    // Redirect to videos tab
    window.location.href = pathname + '/videos';
  }
}

// Hide "Most Relevant" and "Shorts" sections

function hideSections() {


  // Hide Shorts sections - target ytd-rich-shelf-renderer with is-shorts attribute
  const shortsElements = document.querySelectorAll('ytd-rich-shelf-renderer[is-shorts]');
  shortsElements.forEach(element => {
    element.style.display = 'none';
    console.log('Hid Shorts section');
  });


  // Hide "Most Relevant" section - look for ytd-rich-shelf-renderer with "Most relevant" title
  const richShelves = document.querySelectorAll('ytd-rich-shelf-renderer');
  richShelves.forEach(shelf => {
    const titleElement = shelf.querySelector('#title');
    if (titleElement && titleElement.textContent.trim() === 'Most relevant') {
      shelf.style.display = 'none';
    }
  });

  // Hide videos with "Notify me" button
  const notifyButtons = document.querySelectorAll(
    '.yt-spec-button-shape-next__button-text-content, .ytSpecButtonShapeNextButtonTextContent'
  );
  notifyButtons.forEach(button => {
    if (button.textContent.trim() === 'Notify me') {
      const videoItem = button.closest('ytd-rich-item-renderer');
      if (videoItem) {
        videoItem.style.display = 'none';
      }
    }
  });

  // Hide "Shorts" and "Home" menu items in sidebar (YT logo already links home)
  const guideEntries = document.querySelectorAll('ytd-guide-entry-renderer');
  guideEntries.forEach(entry => {
    const titleElement = entry.querySelector('yt-formatted-string.title');
    if (!titleElement) return;
    const title = titleElement.textContent.trim();
    if (title === 'Shorts' || title === 'Home') {
      entry.style.display = 'none';
    }
  });
}

// Run immediately
redirectToChannelVideos();
hideSections();

// Watch for DOM changes (YouTube is a SPA)
const observer = new MutationObserver(() => {
  hideSections();
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Also run when navigating (for SPA navigation)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    redirectToChannelVideos();
    hideSections();
  }
}).observe(document, { subtree: true, childList: true });


