import type { Dimension } from "../../../types/dimension";
import type { VideomailClientOptions } from "../../../types/options";
import calculateHeight from "../../../util/html/dimensions/calculateHeight";
import calculateWidth from "../../../util/html/dimensions/calculateWidth";
import getRatio from "../../../util/html/dimensions/getRatio";
import useFullWidth from "../../../util/html/dimensions/useFullWidth";
import type Visuals from "../../visuals";
import type UserMedia from "../userMedia";

interface RecorderDimensionsContext {
  options: VideomailClientOptions;
  visuals: Pick<Visuals, "getRatio" | "limitWidth">;
  getRecorderElement: () => HTMLVideoElement | null | undefined;
  getUserMedia: () => UserMedia | undefined;
}

class RecorderDimensions {
  private readonly context: RecorderDimensionsContext;

  constructor(context: RecorderDimensionsContext) {
    this.context = context;
  }

  public correctDimensions() {
    const recorderElement = this.context.getRecorderElement();

    if (!recorderElement) {
      return;
    }

    const widthDimension = useFullWidth(this.context.options.video.mobileBreakPoint);

    if (this.context.options.video.stretch || widthDimension) {
      recorderElement.style.width = "100%";
      recorderElement.style.removeProperty("height");
    } else {
      if (this.context.options.video.width) {
        const recorderWidth = this.getRecorderWidth(true);

        if (recorderWidth?.value) {
          recorderElement.width = recorderWidth.value;
        } else {
          recorderElement.style.removeProperty("width");
        }
      }

      if (this.context.options.video.height) {
        const recorderHeight = this.getRecorderHeight(true);

        if (recorderHeight?.value) {
          recorderElement.height = recorderHeight.value;
        } else {
          recorderElement.style.removeProperty("height");
        }
      }
    }
  }

  public getRecorderWidth(responsive: boolean) {
    const userMedia = this.context.getUserMedia();

    if (userMedia?.hasVideoWidth()) {
      return userMedia.getRawWidth(responsive);
    } else if (responsive && this.context.options.video.width) {
      return this.context.visuals.limitWidth(this.context.options.video.width);
    }

    const dimension: Dimension = {
      unit: "px",
      value: this.context.options.video.width,
    };

    return dimension;
  }

  public getRecorderHeight(responsive: boolean, useBoundingClientRect?: boolean) {
    const recorderElement = this.context.getRecorderElement();
    const userMedia = this.context.getUserMedia();
    let recorderHeight: Dimension | undefined;

    if (recorderElement && useBoundingClientRect) {
      const height = recorderElement.getBoundingClientRect().height;

      recorderHeight = {
        unit: "px",
        value: height,
      };
    } else if (userMedia) {
      let height = userMedia.getRawHeight(responsive);

      // Respect the source ratio when the requested width is smaller than the camera's.
      if (height !== undefined && this.context.options.video.width) {
        const ratio = this.getRatio();

        if (ratio !== undefined) {
          const idealHeight = this.context.options.video.width * ratio;
          height = Math.min(idealHeight, height);
        }
      }

      recorderHeight = {
        unit: "px",
        value: height,
      };
    } else if (responsive && this.context.options.video.height) {
      recorderHeight = this.calculateHeight(responsive);
    } else if (this.context.options.video.height) {
      const height = this.context.options.video.height;

      recorderHeight = {
        unit: "px",
        value: height,
      };
    }

    return recorderHeight;
  }

  public getRatio() {
    const userMedia = this.context.getUserMedia();
    let ratio: number | undefined;

    if (userMedia) {
      const userMediaVideoWidth = userMedia.getVideoWidth();
      const userMediaVideoHeight = userMedia.getVideoHeight();

      if (!userMediaVideoWidth || userMediaVideoWidth < 1) {
        ratio = this.context.visuals.getRatio();
      } else if (userMediaVideoHeight) {
        ratio = userMediaVideoHeight / userMediaVideoWidth;
      }
    } else {
      ratio = getRatio(this.context.options);
    }

    return ratio;
  }

  public calculateWidth(responsive: boolean) {
    const userMedia = this.context.getUserMedia();
    const recorderElement = this.context.getRecorderElement();
    let videoHeight: number | undefined;

    if (userMedia) {
      videoHeight = userMedia.getVideoHeight();
    } else if (recorderElement) {
      videoHeight = recorderElement.videoHeight || recorderElement.height;
    }

    return calculateWidth(responsive, this.context.options, videoHeight, this.getRatio());
  }

  public calculateHeight(responsive: boolean) {
    const userMedia = this.context.getUserMedia();
    const recorderElement = this.context.getRecorderElement();
    let videoDimension: Dimension | undefined;

    if (userMedia) {
      const videoHeight = userMedia.getVideoHeight();

      videoDimension = {
        value: videoHeight,
        unit: "px",
      };
    } else if (recorderElement) {
      const videoHeight = recorderElement.videoHeight || recorderElement.height;

      videoDimension = {
        value: videoHeight,
        unit: "px",
      };
    } else {
      videoDimension = calculateHeight(
        responsive,
        undefined,
        this.context.options,
        this.getRatio(),
        recorderElement,
      );
    }

    return videoDimension;
  }
}

export default RecorderDimensions;
