// Sends a Plausible custom event. assets/analytics.js defines window.plausible
// (a queue until the script loads); bots and headless browsers never get it.
export function trackEvent (name, props) {
  window.plausible?.(name, props && { props })
}
