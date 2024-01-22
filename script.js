let url = new URL(document.URL)
let noStretch = url.searchParams.get('no-stretch') == 'true'
let imgTags = url.searchParams.get('img-tags') == 'true'

if (url.searchParams.get('context-menu') == 'true') {
  document.body.classList.add('context-menu')
}

let contextMenu = document.body.classList.contains('context-menu')

if (noStretch) {
let imgw = Number(url.searchParams.get('imgw')) || 'auto'
let imgh = Number(url.searchParams.get('imgh')) || 'auto'
if (typeof(imgw) == 'number') imgw += 'px'
if (typeof(imgh) == 'number') imgh += 'px'
document.body.insertAdjacentHTML('afterbegin', `
<style>
.attachments {
display: flex!important;
flex-wrap: wrap;
}
.media-flex {
width: auto;
}
.media {
width: ${imgw};
height: ${imgh};
max-width: none;
padding-bottom: 0;
}
.media-image {
width: ${imgw};
height: ${imgh};
position: relative;
width: auto;
}
.media-flex {
flex-wrap: wrap;
}
</style>`)
}

if (imgTags) {
  document.body.innerHTML = document.body.innerHTML.replaceAll('<div class="media-image" style="background-image: url(', '<img class="media-image" src="').replaceAll(')"></div>', '">')
}

function link(url) { return open(url, '_blank') }
function downloadURI(uri, name) { let link = document.createElement("a"); link.setAttribute('download', name); link.href = uri; document.body.appendChild(link); link.click(); link.remove() } 
function getBase64Image(url){    
  return new Promise(resolve => {
      let canvas = document.createElement("canvas")
      let img = new Image()
      img.crossOrigin="anonymous"
      img.src = url
      img.onload = function() {
      canvas.width = img.width
      canvas.height = img.height
      let ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0)
      let dataURL = canvas.toDataURL("image/png")   
      resolve(dataURL)
      }
  })
}
let buttonNavigation = document.querySelector('#buttonNavigation')
document.querySelector('#buttonNavigation').onclick = function() {
  let topPos = document.body.scrollHeight
  this.textContent = '🡹'
  if(window.scrollY > document.body.scrollHeight/1.2) {
    topPos = 0
    this.textContent = '🡻'
  }
  window.scrollTo({top: topPos})
}
setInterval(() => {
  if(window.scrollY > document.body.scrollHeight/1.2) {
    buttonNavigation.textContent = '🡹'
  } else {
    buttonNavigation.textContent = '🡻'
  }
}, 200)
//message-media
let conversation = document.querySelector('.conversation')
if (conversation) {
  for (let media of [...document.querySelectorAll('.message-media')]) {
    let videoLink = media.getAttribute('data-video')
    if (videoLink) {
      media.onclick = function() { link('https://google.com/videoplayer.html?link=' + btoa(videoLink)) }
      media.oncontextmenu = function() { link(videoLink) }
    } else {
      media.onclick = function() { getBase64Image(this.src).then(x => downloadURI(x, 'img.jpg')) }
      media.oncontextmenu = function() { link(this.src) }
    }
  }
} else {
  let isVideos = document.querySelector('.attachments').classList.contains('is-videos')
  if (isVideos) {
    for (let media of [...document.querySelectorAll('.media')]) {
      media.onclick = function() { link('https://google.com/videoplayer.html?link=' + btoa(this.getAttribute('data-link'))) }
      media.oncontextmenu = function() { link(this.getAttribute('data-link')) }
    }
  } else {
    if (contextMenu) {
      for (let media of [...document.querySelectorAll('.media')]) {
        media.onclick = function() { link(this.getAttribute('data-link')) }
      }
    } else {
      for (let media of [...document.querySelectorAll('.media')]) {
        media.onclick = function() { link(this.getAttribute('data-link')) }
        media.oncontextmenu = function() { getBase64Image(this.getAttribute('data-link')).then(x => downloadURI(x, this.getAttribute('data-name'))); return false }
      }
    }
  }
}
