import numberIsInteger from "number-is-integer";

import VideomailError from "./../util/videomailError";

function getOuterWidth(element) {
  let outerWidth = 0;
  let rect = element.getBoundingClientRect();

  if (rect) {
    outerWidth = rect.right - rect.left;
  }

  if (outerWidth < 1) {
    // last effort, can happen when replaying only
    rect = document.body.getBoundingClientRect();
    outerWidth = rect.right - rect.left;
  }

  return outerWidth;
}

function figureMinHeight(height, options) {
  if (options.hasDefinedHeight()) {
    if (!height) {
      height = options.video.height;
    } else {
      height = Math.min(options.video.height, height);
    }
  }

  if (numberIsInteger(height) && height < 1) {
    throw VideomailError.create(
      "Got a video height less than 1 (" + height + ") while figuring out the minimum!",
      options,
    );
  }

  // just return it, can be "auto"
  return height;
}

export default {
  limitWidth: function (element, width, options) {
    let limitedWidth;

    const outerWidth = getOuterWidth(element);

    if (width) {
      // only when that element has a defined width, apply this logic
      limitedWidth = outerWidth > 0 && outerWidth < width ? outerWidth : width;
    } else {
      // else apply the outer width when the element has no defined width yet
      limitedWidth = outerWidth;
    }

    if (numberIsInteger(limitedWidth) && limitedWidth < 1) {
      throw VideomailError.create("Limited width cannot be less than 1!", options);
    } else {
      return limitedWidth;
    }
  },

  // this is difficult to compute and is not entirely correct.
  // but good enough for now to ensure some stability.
  limitHeight: function (height, options) {
    if (numberIsInteger(height) && height < 1) {
      throw VideomailError.create(
        "Passed limit-height argument cannot be less than 1!",
        options,
      );
    } else {
      const limitedHeight = Math.min(
        height,
        // document.body.scrollHeight,
        document.documentElement.clientHeight,
      );

      if (limitedHeight < 1) {
        throw VideomailError.create("Limited height cannot be less than 1!", options);
      } else {
        return limitedHeight;
      }
    }
  },

  calculateWidth: function (options) {
    let height = options.videoHeight || null;
    const ratio = options.ratio || options.getRatio();

    height = figureMinHeight(height, options);

    if (options.responsive) {
      height = this.limitHeight(height, options);
    }

    if (numberIsInteger(height) && height < 1) {
      throw VideomailError.create(
        "Height cannot be smaller than 1 when calculating width.",
        options,
      );
    } else {
      const calculatedWidth = parseInt(height / ratio);

      if (calculatedWidth < 1) {
        throw VideomailError.create(
          "Calculated width cannot be smaller than 1!",
          options,
        );
      } else {
        return calculatedWidth;
      }
    }
  },

  calculateHeight: function (element, options) {
    let width = options.videoWidth || null;
    let height;

    const ratio = options.ratio || options.getRatio();

    if (options.hasDefinedWidth()) {
      width = options.video.width;
    }

    if (numberIsInteger(width) && width < 1) {
      throw VideomailError.create(
        "Unable to calculate height when width is less than 1.",
        options,
      );
    } else if (options.responsive) {
      width = this.limitWidth(element, width, options);
    }

    if (width) {
      height = parseInt(width * ratio);
    }

    if (numberIsInteger(height) && height < 1) {
      throw VideomailError.create(
        "Just calculated a height less than 1 which is wrong.",
        options,
      );
    } else {
      return figureMinHeight(height, options);
    }
  },
};
