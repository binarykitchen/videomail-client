import h from 'hyperscript'
import hidden from 'hidden'

import Events from './../../../../events'
import EventEmitter from './../../../../util/eventEmitter'

export default function (visuals, options) {
  EventEmitter.call(this, options, 'Facing Mode')

  const self = this
  let facingModeElement

  function initEvents() {
    self.on(Events.ERROR, function () {
      self.hide()
    })
  }

  this.build = function () {
    facingModeElement = visuals.querySelector('.facingMode')

    if (!facingModeElement) {
      facingModeElement = h('button.facingMode')
      facingModeElement.innerHTML = '⤾'

      facingModeElement.onclick = (e) => {
        e && e.preventDefault()

        try {
          self.emit(Events.SWITCH_FACING_MODE)
        } catch (exc) {
          self.emit(Events.ERROR, exc)
        }
      }

      this.hide()

      visuals.appendChild(facingModeElement)
    } else {
      this.hide()
    }

    initEvents()
  }

  this.hide = function () {
    hidden(facingModeElement, true)
  }

  this.show = function () {
    hidden(facingModeElement, false)
  }
}
