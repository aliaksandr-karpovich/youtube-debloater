const DEFAULTS = {
  redirectChannelToVideos: true,
  hideShortsShelves: true,
  hideMostRelevant: true,
  hideUpcomingStreams: true,
  hideSidebarHome: true,
  hideSidebarShorts: true,
};

let flags = { ...DEFAULTS };

function redirectToChannelVideos() {
  if (!flags.redirectChannelToVideos) return;
  const pathname = window.location.pathname;
  const isChannelPage = pathname.match(/^\/@[^\/]+$/) || pathname.match(/^\/channel\/[^\/]+$/);
  if (isChannelPage) {
    window.location.href = pathname + '/videos';
  }
}

function hideSections() {
  if (flags.hideShortsShelves) {
    document.querySelectorAll(
      'ytd-rich-shelf-renderer[is-shorts], ytd-reel-shelf-renderer'
    ).forEach(el => {
      el.style.display = 'none';
    });
  }

  if (flags.hideMostRelevant) {
    document.querySelectorAll('ytd-rich-shelf-renderer').forEach(shelf => {
      const titleElement = shelf.querySelector('#title');
      if (titleElement?.textContent.trim() === 'Most relevant') {
        shelf.style.display = 'none';
      }
    });
  }

  if (flags.hideUpcomingStreams) {
    document.querySelectorAll(
      '.yt-spec-button-shape-next__button-text-content, .ytSpecButtonShapeNextButtonTextContent'
    ).forEach(button => {
      if (button.textContent.trim() === 'Notify me') {
        const videoItem = button.closest('ytd-rich-item-renderer');
        if (videoItem) videoItem.style.display = 'none';
      }
    });
  }

  if (flags.hideSidebarHome || flags.hideSidebarShorts) {
    document.querySelectorAll('ytd-guide-entry-renderer').forEach(entry => {
      const titleElement = entry.querySelector('yt-formatted-string.title');
      if (!titleElement) return;
      const title = titleElement.textContent.trim();
      if ((title === 'Home' && flags.hideSidebarHome) ||
          (title === 'Shorts' && flags.hideSidebarShorts)) {
        entry.style.display = 'none';
      }
    });
  }
}

function run() {
  redirectToChannelVideos();
  hideSections();
}

chrome.storage.sync.get(DEFAULTS, (stored) => {
  flags = stored;
  run();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  for (const key in changes) {
    flags[key] = changes[key].newValue;
  }
  run();
});

new MutationObserver(() => hideSections()).observe(document.body, {
  childList: true,
  subtree: true,
});

let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    run();
  }
}).observe(document, { subtree: true, childList: true });