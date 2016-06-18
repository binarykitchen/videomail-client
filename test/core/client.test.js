var test = require('tape'),
    h    = require('hyperscript')

    VideomailClient = require('./../../src/client')

var SILENT = true

function addDivForVideomail() {
    var body = document.getElementsByTagName('body')[0],
        div  = h('div#videomail')

    body.appendChild(div)
}

test.only('VideomailClient:', {timeout: 500}, function(t) {

    var client

    addDivForVideomail()

    t.test('can be instantiated and emits built event', function(tt) {
        tt.plan(2)

        consoleFacade = console

        if (SILENT) {
            consoleFacade.error = function() {}
            consoleFacade.warn  = function() {}
            consoleFacade.debug = function() {}
        }

        tt.doesNotThrow(function() {
            client = new VideomailClient({verbose: !SILENT, logger: consoleFacade})

            client.once(
                client.events.BUILT,
                function() {
                    tt.pass("Built event received")
                }
            )
        })
    })

    // todo: add test for fn show() once tape-run + electronjs allow getUserMedia access

    t.test('replay without videomail parameter emits error', function(tt) {
        tt.plan(1)

        client.once(
            client.events.ERROR,
            function() {
                tt.pass("Error event received")
            }
        )

        client.replay()
    })

    t.test('hiding does not throw error and emits event', function(tt) {
        tt.plan(2)

        client.once(
            client.events.HIDE,
            function() {
                tt.pass("Hide event received")
            }
        )

        tt.doesNotThrow(function() {
            client.hide()
        })
    })

    t.test('unload does not throw an error and emits event', function(tt) {
        tt.plan(1)

        tt.doesNotThrow(function() {
            client.unload()
        })
    })
})
