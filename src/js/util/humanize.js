import { filesize } from "filesize";
import humanizeDuration from "humanize-duration";

// todo get rid of this class and use those imports directly

export default {
  filesize(bytes, round) {
    return filesize(bytes, {
      round,
    });
  },

  toTime(t) {
    return humanizeDuration(t);
  },
};
