var test = require('tape'),
    h    = require('hyperscript')

    VideomailClient = require('./../../src/client')

function addDivForVideomail() {
    var body = document.getElementsByTagName('body')[0],
        div  = h('div#videomail')

    body.appendChild(div)
}

test('VideomailClient:', {timeout: 1000}, function(t) {

    var client

    addDivForVideomail()

    t.test('can be instantiated', function(tt) {
        tt.plan(1)

        tt.doesNotThrow(function() {
            client = new VideomailClient({verbose: true})
        })
    })

    t.test('emits built events', function(tt) {
        client.on(
            client.events.BUILT,
            function() {
                tt.pass("Built event received")
                tt.end()
            }
        )
    })

    t.test('unload does not throw an error', function(tt) {
        tt.plan(1)

        tt.doesNotThrow(function() {
            client.unload()
        })
    })

    // todo: add more tests
})
