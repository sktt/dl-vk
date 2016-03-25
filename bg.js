chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  if(request.dl) {
    const a = document.createElement('a')
    a.download = request.dl.name + '.mp3'
    a.href = request.dl.href
    a.click()
  }
})
