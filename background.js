chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('riseintime.com')) {
    setTimeout(() => {
      chrome.action.openPopup(() => {
        chrome.runtime.sendMessage({ closePopup: true });
      });
    }, 200); // Delay in milliseconds
  }
});

