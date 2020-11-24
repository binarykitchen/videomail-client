import h from 'hyperscript'
import hidden from 'hidden'

import VideomailError from './../../../../util/videomailError'

export default function (visuals, options) {
  if (!options.text.pausedHeader) {
    throw VideomailError.create('Paused header cannot be empty', options)
  }

  let pausedBlockElement
  let pausedHeaderElement
  let pausedHintElement

  function hasPausedHint() {
    return options.text.pausedHint
  }

  this.build = function () {
    pausedBlockElement = visuals.querySelector('.paused')
    pausedHeaderElement = visuals.querySelector('.pausedHeader')

    if (!pausedHeaderElement) {
      pausedBlockElement = h('div.paused')
      pausedHeaderElement = h('p.pausedHeader')

      this.hide()

      pausedHeaderElement.innerHTML = options.text.pausedHeader

      pausedBlockElement.appendChild(pausedHeaderElement)

      if (hasPausedHint()) {
        pausedHintElement = visuals.querySelector('.pausedHint')
        pausedHintElement = h('p.pausedHint')
        pausedHintElement.innerHTML = options.text.pausedHint
        pausedBlockElement.appendChild(pausedHintElement)
      }

      visuals.appendChild(pausedBlockElement)
    } else {
      this.hide()

      pausedHeaderElement.innerHTML = options.text.pausedHeader

      if (hasPausedHint()) {
        pausedHintElement.innerHTML = options.text.pausedHint
      }
    }
  }

  this.hide = function () {
    hidden(pausedBlockElement, true)
  }

  this.show = function () {
    hidden(pausedBlockElement, false)
  }
}
