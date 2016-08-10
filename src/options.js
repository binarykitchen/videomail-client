module.exports = {
    logger:          null,                   // define logging instance. leave null for default, console.
    logStackSize:    20,                     // limits the stack size of log outputs to collect
    verbose:         false,                  // set true to log more info
    baseUrl:         'https://videomail.io', // leave as it, permanent url to post videos
    socketUrl:       'wss://videomail.io',   // leave as it, permanent url to send frames
    siteName:        'videomail-client-demo',// Required for the API. If you change it, contact me
    cache:           true,                   // reduces GET queries when loading videos
    insertCss:       true,                   // inserts predefined CSS, see examples
    enablePause:     true,                   // enable pause/resume button
    enableAutoPause: true,                   // automatically pauses when window becomes inactive
    enableSpace:     true,                   // hitting space can pause recording
    disableSubmit:   false,                  // set this to true if you do not want to submit videos,
                                             // but just want to record and replay these temporarily
    enableAutoValidation: true,              // automatically validates all form inputs if any exist and
                                             // does not disable submit button after recording when something
                                             // else seems invalid. useful in conjunction if you want to
                                             // set the 'disabled' attribute of the submit button yourself, see
                                             // setSubmitButtonAttribute() in the API

    enctype: 'application/json',             // enctype for the form submission. currently implemented are:
                                             // 'application/json' and 'application/x-www-form-urlencoded'

    selectors: {                             // default CSS selectors you can alter, see examples
        containerId:    'videomail',
        replayClass:    'replay',
        userMediaClass: 'userMedia',
        visualsClass:   'visuals',
        buttonClass:    null,                // can also be used as a default class for all buttons
        buttonsClass:   'buttons',

        recordButtonClass:      'record',
        pauseButtonClass:       'pause',
        resumeButtonClass:      'resume',
        previewButtonClass:     'preview',
        recordAgainButtonClass: 'recordAgain',
        submitButtonClass:      'submit',

        subjectInputName: 'subject',               // the form input name for subject
        fromInputName:    'from',                  // the form input name for the from email
        toInputName:      'to',                    // the form input name for the to email
        bodyInputName:    'body',                  // the form input name for the message (body)

        keyInputName:       'videomail_key',
        parentKeyInputName: 'videomail_parent_key',
        aliasInputName:     'videomail_alias',

        formId:         null,                    // automatically detects form if any
        submitButtonId: null                     // automatically detects submit button in the form
    },
    audio: {
        enabled:    false,      // set to true for experimential audio recording
        switch:     false,      // enables a switcher for audio recording (on/off)
        volume:     .45,        // must be between 0 .. 1 but 0.45 is recommeded to avoid
                                // distorting at the higher volume peaks
        bufferSize: 4096        // decides how often the audio is being sampled, must be a power of two
    },
    video: {
        fps:          15,          // depends on your connection
        limitSeconds: 30,          // recording automatically stops after that limit
        countdown:    3,           // set it to 0 or false to disable it
        width:        'auto',      // or use an integer for exact pixels
        height:       'auto'       // or use an integer for exact pixels
    },
    image: {
        quality:    .35,
        types:      ['webp', 'jpeg']                // recommended settings to make most of all browsers
    },
    // alter these text for internationalisation
    text: {
        pausedHeader: 'Paused',
        pausedHint:   null,
        processing:   'Processing',
        limitReached: 'Limit reached',
        buttons: {
            'record':       'Record video',
            'recordAgain':  'Record again',
            'resume':       'Resume',
            'pause':        'Pause',
            'preview':      'Preview'
        }
    },
    notifier: {
        entertain:         false,   // when true, user is entertained while waiting, see examples
        entertainClass:    'bg',
        entertainLimit:    6,
        entertainInterval: 9000
    },
    timeouts: {
        userMedia:    5e3,          // increase if you want user give more time to enable webcam
        connection:   1e4,          // increase if connection is slow
        pingInterval: 30e3          // keeps webstream (connection) alive when pausing
    },
    callbacks: {
      adjustFormDataBeforePosting: null  // a custom callback to tweak form data before posting to server
    },
    displayErrors: true,            // show errors inside the container?
    fakeUaString:  null             // just for testing purposes to simulare VM on diff browsers
}
