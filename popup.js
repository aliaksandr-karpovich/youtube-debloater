const FLAGS = [
  { key: 'redirectChannelToVideos', label: 'Open channels on Videos tab' },
  { key: 'hideShortsShelves', label: 'Hide Shorts shelves' },
  { key: 'hideMostRelevant', label: 'Hide "Most relevant" shelf' },
  { key: 'hideUpcomingStreams', label: 'Hide upcoming streams' },
  { key: 'hideSidebarHome', label: 'Hide Home in sidebar' },
  { key: 'hideSidebarShorts', label: 'Hide Shorts in sidebar' },
];

const DEFAULTS = Object.fromEntries(FLAGS.map(f => [f.key, true]));

const list = document.getElementById('flags');

chrome.storage.sync.get(DEFAULTS, (stored) => {
  for (const { key, label } of FLAGS) {
    const li = document.createElement('li');

    const text = document.createElement('span');
    text.textContent = label;

    const switchLabel = document.createElement('label');
    switchLabel.className = 'switch';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = Boolean(stored[key]);
    input.addEventListener('change', () => {
      chrome.storage.sync.set({ [key]: input.checked });
    });

    const slider = document.createElement('span');
    slider.className = 'slider';

    switchLabel.append(input, slider);
    li.append(text, switchLabel);
    list.append(li);
  }
});