// Plausible, skipped for bots and headless browsers. Reports the first uncaught
// error on the page as a "JS Error" event so breakage on the live site shows up.
;(function () {
  if (
    navigator.webdriver ||
    /bot|crawl|spider|scrape|headless/i.test(navigator.userAgent) ||
    !navigator.languages ||
    navigator.languages.length === 0
  ) {
    return
  }
  const script = document.createElement('script')
  script.defer = true
  script.dataset.domain = 'wavejump.joekarlsson.com'
  script.src = 'https://plausible.joekarlsson.io/js/script.tagged-events.outbound-links.file-downloads.js'
  document.head.appendChild(script)

  let reported = false
  const report = (message, source) => {
    if (reported || typeof window.plausible !== 'function') return
    reported = true
    window.plausible('JS Error', {
      props: { message: String(message).slice(0, 200), source, path: location.pathname }
    })
  }
  addEventListener('error', (e) => report(e.message, `${e.filename}:${e.lineno}`))
  addEventListener('unhandledrejection', (e) => report(e.reason, 'promise'))
})()
