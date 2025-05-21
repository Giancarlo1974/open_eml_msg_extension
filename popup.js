document.addEventListener('DOMContentLoaded', () => {
  const radios = document.querySelectorAll('input[name="mode"]');
  const saveBtn = document.getElementById('saveBtn');

  chrome.storage.sync.get(['mode'], ({mode}) => {
    if (mode) {
      radios.forEach(r => {
        if (r.value === mode) r.checked = true;
      });
    }
  });

  saveBtn.addEventListener('click', () => {
    const selected = Array.from(radios).find(r => r.checked);
    if (selected) {
      chrome.storage.sync.set({mode: selected.value}, () => {
        alert('Mode saved: ' + selected.value);
      });
    }
  });
});
