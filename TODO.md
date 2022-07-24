### TODOs
| Filename | line # | TODO
|:------|:------:|:------
| src/js/wrappers/container.js | 323 | figure out how to fire dom's onload event again
| src/js/wrappers/container.js | 324 | or how to run all the scripts over again
| src/js/wrappers/optionsWrapper.js | 27 | fix this, it's not really an option
| src/js/util/audioRecorder.js | 11 | code needs rewrite
| src/js/util/eventEmitter.js | 6 | MAKE EVENT EMITTING IN DESPOT NOT GLOBAL BUT BY CONTAINER ID INSTEAD
| src/js/util/eventEmitter.js | 43 | have this emitted through a configuration because it is pretty noisy
| src/js/util/humanize.js | 4 | get rid of this class and use those imports directly
| src/js/wrappers/visuals/recorder.js | 580 | in https://github.com/binarykitchen/videomail-client/issues/142
| src/js/wrappers/visuals/recorder.js | 617 | retry with navigator.getUserMedia_() maybe?
| src/js/wrappers/visuals/recorder.js | 757 | commented out because for some reasons server does not accept such a long
| src/js/wrappers/visuals/recorder.js | 762 | consider removing this later or have it for debug=1 only?
| src/js/wrappers/visuals/userMedia.js | 309 | consider removing that if it's not the case anymore (for better performance)
| gulpfile.js | 1 | write this in ES6 once i have figured out how to
| gulpfile.js | 58 | fix this, so that it also works when not minified, this
| gulpfile.js | 63 | location is bad, should be in a temp folder or so