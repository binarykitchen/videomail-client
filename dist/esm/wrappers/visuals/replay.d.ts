import Despot from "../../util/Despot";
import { VideomailClientOptions } from "../../types/options";
import Visuals from "../visuals";
import Videomail from "../../types/Videomail";
import { UnloadParams } from "../container";
import { VideoType } from "../../types/VideoType";
declare class Replay extends Despot {
    private readonly visuals;
    private built;
    private replayElement?;
    private videomail?;
    constructor(visuals: Visuals, options: VideomailClientOptions);
    private buildElement;
    private isStandalone;
    private copyAttributes;
    private correctDimensions;
    setVideomail(newVideomail: Videomail, playerOnly?: boolean): void;
    show(videomailWidth: number | undefined, videomailHeight: number | undefined, hasAudio?: boolean, playerOnly?: boolean): void;
    build(replayParentElement: HTMLElement): void;
    unload(params?: UnloadParams): void;
    getVideoSource(type: string): HTMLSourceElement | undefined;
    private setTrackSource;
    private setVideoSource;
    setMp4Source(src?: string, bustCache?: boolean): void;
    setWebMSource(src?: string, bustCache?: boolean): void;
    getVideoType(): VideoType | undefined;
    private pause;
    reset(cb?: any): void;
    hide(): void;
    isShown(): boolean;
    getVisuals(): Visuals;
    getElement(): HTMLVideoElement | null | undefined;
}
export default Replay;
