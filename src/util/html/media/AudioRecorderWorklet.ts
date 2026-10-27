export const AUDIO_RECORDER_PROCESSOR_NAME = "videomail-pcm-recorder";

export interface AudioRecorderProcessorOptions {
  processorOptions: {
    bufferSize: number;
  };
}

export interface AudioRecorderProcessor {
  process(
    inputs: readonly (readonly Float32Array[])[],
    outputs: readonly (readonly Float32Array[])[],
  ): boolean;
}

interface AudioRecorderProcessorBase {
  readonly port: {
    onmessage: ((event: MessageEvent<unknown>) => void) | null;
    postMessage: (message: unknown, transfer: Transferable[]) => void;
  };
}

export default function registerAudioRecorderProcessor(
  name: string,
  Processor: new () => AudioRecorderProcessorBase,
  register: (
    processorName: string,
    processor: new (options: AudioRecorderProcessorOptions) => AudioRecorderProcessor,
  ) => void,
) {
  class PcmRecorderProcessor extends Processor {
    declare private samples: Float32Array<ArrayBuffer>;
    declare private offset: number;
    declare private recordingId: number;

    public constructor(options: AudioRecorderProcessorOptions) {
      super();
      this.samples = new Float32Array(options.processorOptions.bufferSize);
      this.offset = 0;
      this.recordingId = 0;

      this.port.onmessage = (event) => {
        const recordingId: unknown = event.data;

        if (typeof recordingId !== "number") {
          return;
        }
        if (!Number.isSafeInteger(recordingId) || recordingId < -1) {
          return;
        }

        this.recordingId = recordingId;
        this.offset = 0;
      };
    }

    public process(inputs: readonly (readonly Float32Array[])[]) {
      if (this.recordingId < 0) {
        return false;
      }

      const channel = inputs[0]?.[0];

      if (!channel || this.recordingId === 0) {
        return true;
      }

      let inputOffset = 0;

      while (inputOffset < channel.length) {
        const count = Math.min(
          this.samples.length - this.offset,
          channel.length - inputOffset,
        );
        this.samples.set(channel.subarray(inputOffset, inputOffset + count), this.offset);
        this.offset += count;
        inputOffset += count;

        if (this.offset === this.samples.length) {
          const samples = this.samples;

          this.port.postMessage({ recordingId: this.recordingId, samples }, [
            samples.buffer,
          ]);
          this.samples = new Float32Array(this.offset);
          this.offset = 0;
        }
      }

      return true;
    }
  }

  register(name, PcmRecorderProcessor);
}
