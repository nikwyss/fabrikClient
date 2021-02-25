/// POLYFILL (IE11 for oAuth2 PKCE Module)
; (function (window) {
  if (typeof window.TextEncoder !== 'function') {
    const TextEncodingPolyfill = require('text-encoding');
    window.TextEncoder = TextEncodingPolyfill.TextEncoder;
    window.TextDecoder = TextEncodingPolyfill.TextDecoder;
  }
  if (typeof window.crypto === 'undefined') {
    const { webcrypto } = require('webcrypto-shim')
  }
  if (typeof window.fetch === 'undefined') {
    const { fetch } = require('whatwg-fetch')
  }
}(window));
