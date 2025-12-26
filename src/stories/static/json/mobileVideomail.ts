// Used for mocked MSW responses in storybook

import { Videomail } from "../../../types/Videomail";

const videomailMobileExample: Videomail = {
  alias: "re-test-furz-3-dec-2025-06-17-pm-144110111540",
  editUrl:
    "https://videomail.io/videomail/alias/re-test-furz-3-dec-2025-06-17-pm-144110111540/correct",
  dateCreated: 1764739035953,
  dateCreatedServerPretty: "3 Dec 2025, 06:17 pm (NZDT)",
  dateUpdated: 1764739038454,
  dateUpdatedServerPretty: "3 Dec 2025, 06:17 pm (NZDT)",
  expiresAfter: 1769923035953,
  expiresAfterIso: "2026-02-01T05:17:15.953Z",
  expiresAfterServerPretty: "1 Feb 2026, 06:17 pm (NZDT)",
  format: {
    bit_rate: 516619,
    duration: 6.07,
    format_long_name: "Matroska / WebM",
    format_name: "matroska,webm",
    nb_programs: 0,
    nb_streams: 1,
    probe_score: 100,
    size: 391985,
    start_time: 0,
    tags: {
      ENCODER: "Lavf60.3.100",
    },
  },
  from: "michael.heuberger@binarykitchen.com",
  height: 300,
  key: "1f0d0073-ca74-68f0-b34a-d7bf88d120e4",
  mp4: "https://videomail.io/api/videomail/key/1f0d0073-ca74-68f0-b34a-d7bf88d120e4/type/mp4/",
  poster:
    "https://videomail.io/api/videomail/key/1f0d0073-ca74-68f0-b34a-d7bf88d120e4/poster/",
  recordLocation: "https://videomail.io/",
  recordingStats: {
    avgFps: 20.148637489677952,
    avgInterval: 49.631147540983605,
    framesCount: 122,
    intervalSum: 6055,
    videoType: "mp4",
    waitingTime: 213,
    wantedFps: 18,
    wantedInterval: 55.55555555555556,
  },
  replyAllUrl:
    "https://videomail.io/videomail/alias/re-test-furz-3-dec-2025-06-17-pm-144110111540/replyAll",
  replyUrl:
    "https://videomail.io/videomail/alias/re-test-furz-3-dec-2025-06-17-pm-144110111540/reply",
  sending: false,
  sent: true,
  sentDate: 1764739038454,
  sentDateIso: "2025-12-03T05:17:18.454Z",
  sentDateServerPretty: "3 Dec 2025, 06:17 pm (NZDT)",
  sentTo: {
    "michael.heuberger@binarykitchen.com": {
      userKey: false,
    },
  },
  serverTimePretty: "4 Dec 2025, 06:42 pm",
  siteName: "videomail.io",
  subject: "RE: Test furz",
  url: "https://videomail.io/videomail/alias/re-test-furz-3-dec-2025-06-17-pm-144110111540",
  versions: {
    videomailClient: "13.5.3",
  },
  webm: "https://videomail.io/api/videomail/key/1f0d0073-ca74-68f0-b34a-d7bf88d120e4/type/webm/",
  width: 390,
};

export default videomailMobileExample;
