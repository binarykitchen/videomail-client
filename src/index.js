var standardize = require('./util/standardize'),
    Client = require('./client')

if (!navigator) {
    throw new Error('Navigator is missing!')

} else {
    // Ensures Videomail functionality is not broken on exotic browsers with shims.
    //
    // UMD (Universal Module Definition), inspired by https://github.com/es-shims/es5-shim
    ;(function(navigator) {
        standardize(this, navigator)

    }(navigator))
}

module.exports = Client
