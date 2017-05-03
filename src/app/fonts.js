/* eslint-env browser */
export default function loadFonts() {
  const WebFontLoader = require('webfontloader') // eslint-disable-line global-require
  WebFontLoader.load({
    google: {
      families: ['Montserrat'],
    },
    active: () => document.body.classList.remove('fonts-loading'),
  })
}
