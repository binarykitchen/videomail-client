// Used for mocked MSW responses in storybook

import Videomail from "../../../types/Videomail";

const videomailExample: Videomail = {
  subject: "Hamster on Speed",
  from: "automatic@videomail.io",
  to: ["automatic@videomail.io"],
  body: "some dead bodies in here",
  recordingStats: {
    avgFps: 16.39344262295082,
    wantedFps: 15,
    avgInterval: 66.19285714285714,
    wantedInterval: 66.66666666666667,
    intervalSum: 9267,
    framesCount: 140,
    videoType: "webm",
    waitingTime: 1378,
  },
  width: 400,
  height: 226,
  versions: {
    videomailClient: "2.1.26",
  },
  siteName: "videomail.io",
  sending: true,
  alias: "test-example-mofo-485573266478",
  dateCreated: 1511570565748,
  format: {
    nb_streams: 1,
    nb_programs: 0,
    format_name: "mov,mp4,m4a,3gp,3g2,mj2",
    format_long_name: "QuickTime / MOV",
    start_time: 0,
    duration: 8.537,
    size: 1349099,
    bit_rate: 1264237,
    probe_score: 100,
    tags: {
      major_brand: "isom",
      minor_version: "512",
      compatible_brands: "isomiso2avc1mp41",
      encoder: "Lavf57.71.100",
    },
  },
  dateUpdated: 1511570574377,
  accepted: ["automatic@videomail.io"],
  url: "https://videomail.io/videomail/test-example-mofo-485573266478",
  key: "11e7-d179-62e4cfa0-8f72-6ff7f0c1e906",
  mp4: "https://videos.pond5.com/brown-hamster-continuously-running-fast-footage-072830929_main_xxl.mp4",
  webm: "https://videos.pond5.com/brown-hamster-continuously-running-fast-footage-072830929_main_xxl.webm",
  poster: "https://s1.dmcdn.net/v/VwuuU1b-B8bKNOTFe/x1080",
  replyUrl: "/reply/test-example-mofo-485573266478",
  correctUrl: "https://videomail.io/correct/test-example-mofo-485573266478",
  dateCreatedPretty: "Nov 25, 2017, 1:42 PM",
  expiresAfter: 1734131452642,
  expiresAfterIso: "2024-12-13T23:10:52.642Z",
  expiresAfterPretty: "14 Dec 2024, 12:10 pm",
};

export default videomailExample;
