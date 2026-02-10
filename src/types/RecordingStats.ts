interface RecordingStats {
  avgFps?: number | undefined;
  avgInterval?: number | undefined;
  framesCount?: number;
  intervalSum?: number | undefined;
  sampleRate?: number;
  samplesCount?: number;
  videoType?: string;
  waitingTime?: number | undefined;
  wantedFps?: number;
  wantedInterval?: number;
}

export type { RecordingStats };
