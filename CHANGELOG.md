## Changelog

To keep it sweet and short, we're listing breaking or hot changes here only. Rest assured that we kill bugs all the time and they would make that list way too long (and are documented in GitHub tickets anyway).

### v1.18.0 (2016-08-28)

- **VideomailClient:** New function `submit()` to manually submit a videomail

### v1.9.0 (2016-03-12)

- **VideomailClient:** Removed the `containerId` option in `show()` - define it in the constructor under options instead.

### v1.8.0 (2016-02-26)

- **VideomailClient:** Very long pauses are now possible. This thanks to pings to keep connection to server alive.

### v1.7.0 (2015-12-5)

- **VideomailClient:** New option to switch audio recording on or off `options.audio.switch`
- **VideomailClient:** Removed Flash solution for good

### v1.6.0 (2015-09-20)

- **VideomailClient:** Changed order of arguments `VideomailClient.replay(parentElement, videomail)` to `VideomailClient.replay(videomail[, parentElement])`

### v1.5.0 (2015-08-18)

Minor change:
- **VideomailClient:** Renamed `options.buttons.stopButtonClass` to `options.buttons.previewButtonClass`

### v1.4.0 (2015-08-11)

Minor change:
- **VideomailClient:** Renamed `options.buttons.backButtonClass` to `options.buttons.recordAgainButtonClass`
- **VideomailClient:** Merged `back` and `record` button actions to `recordAgain`

### v1.3.0 (2015-07-03)

Minor change:
- **VideomailClient:** Renamed `options.debug` to `options.verbose`

### v1.2.0 (2015-05-17)

- **VideomailClient:** Renamed `VideomailClient.form()` to `VideomailClient.show()`

### v1.1.0 (2015-04-18)

- **VideomailClient:** Do not initialize the client in the global scope but return an object. Replace `VideomailClient.init()` with `new VideomailClient()`
  ([#3](https://github.com/binarykitchen/videomail-client/issues/3))
