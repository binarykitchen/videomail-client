import h from "hyperscript";
import hidden from "hidden";

export default function (visuals, recordNote, options) {
  let recordTimerElement;

  let nearComputed = false;
  let endNighComputed = false;

  let started;
  let countdown;

  function pad(n) {
    return n < 10 ? "0" + n : n;
  }

  function thresholdReached(secs, threshold) {
    return secs >= options.video.limitSeconds * threshold;
  }

  function isNear(secs) {
    if (!nearComputed && thresholdReached(secs, 0.6)) {
      nearComputed = true;
      return true;
    }

    return false;
  }

  function endIsNigh(secs) {
    if (!endNighComputed && thresholdReached(secs, 0.8)) {
      endNighComputed = true;
      return true;
    }

    return false;
  }

  function setNear() {
    recordTimerElement.classList.add("near");
  }

  function setNigh() {
    recordTimerElement.classList.add("nigh");
  }

  this.check = function (opts) {
    const newCountdown = getStartSeconds() - Math.floor(opts.intervalSum / 1e3);

    // performance optimisation (another reason we need react here!)
    if (newCountdown !== countdown) {
      countdown = newCountdown;
      update();
      countdown < 1 && visuals.stop(true);
    }
  };

  function update() {
    const mins = parseInt(countdown / 60, 10);
    const secs = countdown - mins * 60;

    if (!nearComputed || !endNighComputed) {
      const remainingSeconds = options.video.limitSeconds - countdown;

      if (isNear(remainingSeconds)) {
        recordNote.setNear();
        setNear();

        options.debug("End is near, " + countdown + " seconds to go");
      } else if (endIsNigh(remainingSeconds)) {
        recordNote.setNigh();
        setNigh();

        options.debug("End is nigh, " + countdown + " seconds to go");
      }
    }

    recordTimerElement.innerHTML = mins + ":" + pad(secs);
  }

  function hide() {
    hidden(recordTimerElement, true);
  }

  function show() {
    recordTimerElement.classList.remove("near");
    recordTimerElement.classList.remove("nigh");

    hidden(recordTimerElement, false);
  }

  function getSecondsRecorded() {
    return getStartSeconds() - countdown;
  }

  function getStartSeconds() {
    return options.video.limitSeconds;
  }

  this.start = function () {
    countdown = getStartSeconds();
    nearComputed = endNighComputed = false;
    started = true;

    update();

    show();
  };

  this.pause = function () {
    recordNote.hide();
  };

  this.resume = function () {
    recordNote.show();
  };

  function isStopped() {
    return countdown === null;
  }

  this.stop = function () {
    if (!isStopped() && started) {
      options.debug(
        "Stopping record timer. Was recording for about ~" +
          getSecondsRecorded() +
          " seconds.",
      );

      hide();
      recordNote.stop();

      countdown = null;
      started = false;
    }
  };

  this.build = function () {
    recordTimerElement = visuals.querySelector(".recordTimer");

    if (!recordTimerElement) {
      recordTimerElement = h("p.recordTimer");

      hide();

      visuals.appendChild(recordTimerElement);
    } else {
      hide();
    }
  };
}
