// Page-level controls that matter most when the game is embedded in another page:
// sound and full-screen buttons, and pausing while the game is scrolled out of view.

// Embedded in another page (the project page on joekarlsson.com) the game starts
// muted, so nobody scrolling past gets a surprise phone ring or music; the sound
// button turns it on. On its own page it starts with sound.
let soundOn = window.self === window.top

// Called once Phaser's sound manager exists (the Boot state)
export function applySoundSetting (game) {
  game.sound.mute = !soundOn
}

export function setUpPageControls (game) {
  const soundButton = document.querySelector('.sound-toggle')
  const showSoundSetting = () => {
    soundButton.setAttribute('aria-label', soundOn ? 'Turn sound off' : 'Turn sound on')
    soundButton.classList.toggle('is-muted', !soundOn)
  }
  showSoundSetting()
  soundButton.addEventListener('click', () => {
    soundOn = !soundOn
    applySoundSetting(game)
    if (soundOn) {
      game.sound.resumeWebAudioIfSuspended()
    }
    showSoundSetting()
    // Otherwise the next spacebar press would toggle the sound again
    soundButton.blur()
  })

  // Embedded, the about page opens in a new tab instead of replacing the game in the frame
  if (window.self !== window.top) {
    const aboutLink = document.querySelector('.about-link')
    aboutLink.target = '_blank'
    aboutLink.rel = 'noopener'
  }

  const fullscreenButton = document.querySelector('.fullscreen-toggle')
  if (document.fullscreenEnabled) {
    fullscreenButton.hidden = false
    fullscreenButton.addEventListener('click', () => {
      const request = document.fullscreenElement
        ? document.exitFullscreen()
        : document.documentElement.requestFullscreen()
      request.catch((error) => console.warn('Full screen failed:', error))
      // Otherwise the next spacebar press would toggle full screen again
      fullscreenButton.blur()
    })
    document.addEventListener('fullscreenchange', () => {
      fullscreenButton.setAttribute('aria-label', document.fullscreenElement ? 'Exit full screen' : 'Full screen')
    })
  }

  // Inside an iframe this tracks the embedding page's viewport, so the game and
  // its music stop when the reader scrolls past it
  let wasVisible = true
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting !== wasVisible) {
      wasVisible = entry.isIntersecting
      game.paused = !wasVisible
    }
  }).observe(document.documentElement)
}
