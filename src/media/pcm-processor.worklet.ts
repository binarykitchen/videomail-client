interface PcmProcessorOptions {
  processorOptions: { bufferSize: number };
}

type AudioWorkletProcessorConstructor = new () => { readonly port: MessagePort };

declare const AudioWorkletProcessor: AudioWorkletProcessorConstructor;

declare function registerProcessor(
  name: string,
  processor: new (
    options: PcmProcessorOptions,
  ) => InstanceType<typeof AudioWorkletProcessor>,
): void;

class VideomailPcmProcessor extends AudioWorkletProcessor {
  private readonly bufferSize: number;
  private samples: Float32Array;
  private position = 0;

  public constructor(options: PcmProcessorOptions) {
    super();
    this.bufferSize = options.processorOptions.bufferSize;
    this.samples = new Float32Array(this.bufferSize);
  }

  public process(inputs: Float32Array[][]) {
    const input = inputs[0]?.[0];

    if (input) {
      for (let offset = 0; offset < input.length;) {
        const count = Math.min(input.length - offset, this.bufferSize - this.position);
        this.samples.set(input.subarray(offset, offset + count), this.position);
        offset += count;
        this.position += count;

        if (this.position === this.bufferSize) {
          this.port.postMessage(this.samples, [this.samples.buffer]);
          this.samples = new Float32Array(this.bufferSize);
          this.position = 0;
        }
      }
    }

    return true;
  }
}

registerProcessor("videomail-pcm", VideomailPcmProcessor);
