chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  if(request.dl) {
    chrome.downloads.download({
      url: request.dl.href,
      filename: request.dl.name + '.mp3'
    });
  }
})
