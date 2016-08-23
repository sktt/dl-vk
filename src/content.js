import Kefir from 'kefir'
import {obsAdded} from 'kefir-observable-selector'

var script = document.createElement('script')
script.setAttribute('type', 'text/javascript')
script.innerHTML = `(${function() {
  function download(id) {
    ajax.post('al_audio.php', {
      act: 'reload_audio',
      ids: id
    }, {
      onDone: function(res) {
        // has to be run in backgrond to set download attribute. to a cross-origin url
        const song = AudioUtils.asObject(res[0])

        window.postMessage({type: 'vk-dl', song}, '*')
      }
    });
  }
  window.addEventListener('vk-dl', e => {
    download(e.detail)
  });
}.toString()})()`;
document.body.appendChild(script)

window.addEventListener('message', (e) => {
  if (e.data.type === 'vk-dl') {
    const song = e.data.song

    const ta = document.createElement('textarea')
    ta.innerHTML = `${song.performer} - ${song.title}` //&amp; -> & etc

    chrome.extension.sendMessage({
      dl: {
        href: song.url,
        name: ta.value
      }
    }, () => {})
  }
})

obsAdded(document.querySelector('#page_body'), '.audio_row', true)
  .flatten()
  .onValue(el => {
    const playBtn = el.querySelector('.audio_play_wrap')
    const pbClone = playBtn.cloneNode(true)
    pbClone.style.transform = 'rotateZ(90deg)'
    pbClone.style.marginRight = '6px'
    pbClone.style.float = 'left'
    pbClone.querySelector('button').addEventListener('click', e => {
      e.stopPropagation();
      window.dispatchEvent(new CustomEvent('vk-dl', {detail: pbClone.parentNode.dataset.fullId}))
    })
    playBtn.parentNode.insertBefore(pbClone, playBtn)
  })
