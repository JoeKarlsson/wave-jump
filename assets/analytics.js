// Plausible, skipped for bots and headless browsers. Reports the first uncaught
// error on the page as a "JS Error" event so breakage on the live site shows up,
// and counts 404s from the not-found page (<html data-page="404">).
;(function () {
  if (
    navigator.webdriver ||
    /bot|crawl|spider|scrape|headless/i.test(navigator.userAgent) ||
    !navigator.languages ||
    navigator.languages.length === 0
  ) {
    return
  }
  // Queues events sent before the Plausible script has loaded
  window.plausible =
    window.plausible ||
    function () {
      ;(window.plausible.q = window.plausible.q || []).push(arguments)
    }

  const script = document.createElement('script')
  script.defer = true
  script.dataset.domain = 'wavejump.joekarlsson.com'
  script.src = 'https://plausible.joekarlsson.io/js/script.tagged-events.outbound-links.file-downloads.js'
  document.head.appendChild(script)

  if (document.documentElement.dataset.page === '404') {
    window.plausible('404', { props: { path: location.pathname } })
  }

  // Browser extensions throw into the page too; those aren't the site's errors.
  // The site creates no Trusted Types policies, so any policy error is an extension's.
  const isFromExtension = (message, source) =>
    /^(chrome|moz|safari-web)-extension:\/\//.test(source) || /trusted-types|TrustedTypePolicy/i.test(message)

  let reported = false
  const report = (message, source) => {
    message = String(message)
    if (reported || isFromExtension(message, source)) return
    reported = true
    window.plausible('JS Error', {
      props: { message: message.slice(0, 200), source, path: location.pathname }
    })
  }
  addEventListener('error', (e) => report(e.message, `${e.filename}:${e.lineno}`))
  addEventListener('unhandledrejection', (e) => report(e.reason, 'promise'))
})()
