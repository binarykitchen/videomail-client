import h from 'hyperscript'
import hidden from 'hidden'

import VideomailError from './../../../../util/videomailError'

export default function (visuals, options) {
  if (!options.text.pausedHeader) {
    throw VideomailError.create('Paused header cannot be empty', options)
  }

  var pausedBlockElement
  var pausedHeaderElement
  var pausedHintElement

  this.build = function () {
    pausedBlockElement = visuals.querySelector('.paused')
    pausedHeaderElement = visuals.querySelector('.pausedHeader')
    pausedHintElement = visuals.querySelector('.pausedHint')

    if (!pausedHeaderElement) {
      pausedBlockElement = h('div.paused')
      pausedHeaderElement = h('p.pausedHeader')
      pausedHintElement = h('p.pausedHint')

      this.hide()

      pausedHeaderElement.innerHTML = options.text.pausedHeader
      pausedHintElement.innerHTML = options.text.pausedHint

      pausedBlockElement.appendChild(pausedHeaderElement)
      pausedBlockElement.appendChild(pausedHintElement)

      visuals.appendChild(pausedBlockElement)
    } else {
      this.hide()

      pausedHeaderElement.innerHTML = options.text.pausedHeader
      pausedHintElement.innerHTML = options.text.pausedHint
    }
  }

  this.hide = function () {
    hidden(pausedBlockElement, true)
  }

  this.show = function () {
    hidden(pausedBlockElement, false)
  }
}
