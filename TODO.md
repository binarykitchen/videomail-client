### TODOs
| Filename | line # | TODO
|:------|:------:|:------
| src/js/util/audioRecorder.js | 13 | code needs rewrite
| src/js/util/eventEmitter.js | 7 | MAKE EVENT EMITTING IN DESPOT NOT GLOBAL BUT BY CONTAINER ID INSTEAD
| src/js/util/eventEmitter.js | 45 | have this emitted through a configuration because it is pretty noisy
| src/js/util/humanize.js | 4 | get rid of this class and use those imports directly
| src/js/wrappers/container.js | 307 | figure out how to fire dom's onload event again
| src/js/wrappers/container.js | 308 | or how to run all the scripts over again
| src/js/wrappers/optionsWrapper.js | 27 | fix this, it's not really an option
| src/js/wrappers/visuals/recorder.js | 608 | in https://github.com/binarykitchen/videomail-client/issues/142
| src/js/wrappers/visuals/recorder.js | 654 | retry with navigator.getUserMedia_() maybe?
| src/js/wrappers/visuals/recorder.js | 802 | commented out because for some reasons server does
| src/js/wrappers/visuals/recorder.js | 807 | consider removing this later or have it for debug=1 only?
| src/js/wrappers/visuals/userMedia.js | 312 | consider removing that if it's not the case anymore (for better performance)
| gulpfile.js | 2 | write this in ES6 once i have figured out how to
| gulpfile.js | 61 | fix this, so that it also works when not minified, this
| gulpfile.js | 67 | location is bad, should be in a temp folder or so