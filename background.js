chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('riseintime.com')) {
    chrome.action.openPopup(() => {
      chrome.runtime.sendMessage({ closePopup: true });
    });
  }
});