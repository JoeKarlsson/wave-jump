// Page-level controls that matter most when the game is embedded in another page:
// a full-screen button, and pausing while the game is scrolled out of view.
export function setUpPageControls (game) {
  const button = document.querySelector('.fullscreen-toggle')
  if (document.fullscreenEnabled) {
    button.hidden = false
    button.addEventListener('click', () => {
      const request = document.fullscreenElement
        ? document.exitFullscreen()
        : document.documentElement.requestFullscreen()
      request.catch((error) => console.warn('Full screen failed:', error))
      // Otherwise the next spacebar press would toggle full screen again
      button.blur()
    })
    document.addEventListener('fullscreenchange', () => {
      button.setAttribute('aria-label', document.fullscreenElement ? 'Exit full screen' : 'Full screen')
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
