interface RecordingStats {
  avgFps?: number | undefined;
  avgInterval?: number;
  framesCount?: number;
  intervalSum?: number;
  sampleRate?: number;
  samplesCount?: number;
  videoType?: string;
  waitingTime?: number | undefined;
  wantedFps?: number;
  wantedInterval?: number;
}

export default RecordingStats;
