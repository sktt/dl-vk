import Kefir from 'kefir'
import {obsAdded} from 'kefir-observable-selector'

function download(e) {
  e.stopPropagation() // dont play

  // has to be run in backgrond to set download attribute. to a cross-origin url
  chrome.extension.sendMessage({
    dl: {
      href: this.querySelector('input').value.match(/^[^\?]*/)[0],
      name: this.parentNode.querySelector('.title_wrap').innerText
    }
  }, () => {})
}

obsAdded(document.querySelector('#page_body'), '#audios_list', true).map(
  els => els[0] // subtree can give the same many times
).flatMapLatest(
  // replace with latest stream, unsubs previous
  el => Kefir.merge([
    obsAdded(el.querySelector('#initial_list'), '[id^=audio].audio.fl_l'),
    obsAdded(el.querySelector('#search_list'), '[id^=audio].audio.fl_l')
  ])
).onValue(els => {
  els.forEach(el => {
    const playBtn = el.querySelector('.play_btn')
    if(!playBtn.nextElementSibling.matches('.play_btn')) {
      const pbClone = playBtn.cloneNode(true)
      pbClone.style.transform = 'rotateZ(90deg)'
      pbClone.style.marginRight = '-9px'
      pbClone.addEventListener('click', download)
      playBtn.parentNode.insertBefore(pbClone, playBtn)
      el.querySelector('.info').style.width = '365px'
      el.querySelector('.title_wrap').style.width = '305px'
    }
  })
})
