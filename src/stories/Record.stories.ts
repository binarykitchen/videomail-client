import "./static/css/entertain.css";

import type { Meta, StoryObj } from "@storybook/html";

import { PartialVideomailClientOptions } from "../types/options";
import { createStoryClient } from "./util/storyLifecycle";

const meta: Meta<PartialVideomailClientOptions> = {
  title: "Record",
  args: {
    disableSubmit: true,
    verbose: true,
  },
};

type Story = StoryObj<PartialVideomailClientOptions>;

// Start with the defaults: video without audio.
export const DeaFSimple: Story = {
  name: "Simple recording",
  args: {
    video: {
      width: 320,
    },
  },
  render: (args) => {
    const videomailClient = createStoryClient(args);
    return videomailClient.show();
  },
};

// The same setup, with audio for anyone who wants it.
export const DeadSimple: Story = {
  name: "Simple recording with audio",
  args: {
    audio: {
      enabled: true,
    },
    video: {
      width: 320,
    },
  },
  render: (args) => {
    const videomailClient = createStoryClient(args);
    return videomailClient.show();
  },
};

// Use JPEG frames instead of the default WebP preference.
export const SimpleJpegs: Story = {
  name: "Using JPEG image frames",
  args: {
    enablePause: true,
    enableAutoPause: true,
    image: {
      types: ["jpeg"],
    },
    video: {
      countdown: 3,
      width: 320,
      limitSeconds: 20,
    },
  },
  render: (args) => {
    const videomailClient = createStoryClient(args);
    return videomailClient.show();
  },
};

// Let users toggle audio. Skip auto-pause and the countdown.
export const Audio: Story = {
  name: "With audio switcher",
  args: {
    enableAutoPause: false,
    audio: {
      enabled: false,
      switch: true,
    },
    image: {
      quality: 0.4,
    },
    video: {
      limitSeconds: 15,
      countdown: false,
      width: 320,
    },
    text: {
      buttons: {
        preview: "Stop",
      },
    },
  },
  render: (args) => {
    const videomailClient = createStoryClient(args);
    return videomailClient.show();
  },
};

export const ChangingLimit: Story = {
  name: "Changing limit on the fly",
  args: {
    enableAutoPause: false,
    audio: {
      enabled: false,
      switch: true,
    },
    image: {
      quality: 0.4,
    },
    video: {
      limitSeconds: 30,
      countdown: false,
      width: 320,
    },
    text: {
      buttons: {
        preview: "Stop",
      },
    },
  },
  render: (args) => {
    const videomailClient = createStoryClient(args);

    videomailClient.on("ENABLING_AUDIO", function () {
      videomailClient.setLimitSeconds(15);
    });

    videomailClient.on("DISABLING_AUDIO", function () {
      videomailClient.setLimitSeconds(30);
    });

    return videomailClient.show();
  },
};

// Aim for 40 fps and larger frames, without auto-pause.
// The browser may lower the frame rate if it cannot keep up.
export const HighQuality: Story = {
  name: "High quality (40 fps)",
  args: {
    enableAutoPause: false,
    video: {
      countdown: false,
      fps: 40,
      limitSeconds: 60,
      width: 1024,
    },
    image: {
      quality: 0.95,
    },
  },
  render: (args) => {
    const videomailClient = createStoryClient(args);
    return videomailClient.show();
  },
};

// Ask for camera access on Record, not on page load.
export const AskOnRecord: Story = {
  name: "Ask for access on Record",
  args: {
    audio: {
      enabled: true,
    },
    video: {
      width: 320,
      countdown: false,
    },
    loadUserMediaOnRecord: true,
  },
  render: (args) => {
    const videomailClient = createStoryClient(args);
    return videomailClient.show();
  },
};

// Show a camera switch button on mobile.
export const FacingMode: Story = {
  name: "Switch cameras on mobile",
  args: {
    audio: {
      enabled: true,
    },
    video: {
      width: 320,
      facingModeButton: true,
    },
  },
  render: (args) => {
    const videomailClient = createStoryClient(args);
    return videomailClient.show();
  },
};

// Show animations while encoding, without pause/resume controls.
export const Entertain: Story = {
  name: "Entertain while encoding",
  args: {
    enablePause: false,
    video: {
      fps: 30,
      limitSeconds: 60,
      countdown: false,
      width: 720,
    },
    image: {
      quality: 0.9,
    },
    notifier: {
      entertain: true,
      entertainClass: "bg",
      entertainLimit: 4,
      entertainInterval: 2e3,
    },
  },
  render: (args) => {
    const videomailClient = createStoryClient(args);
    return videomailClient.show();
  },
};

// Reuse existing markup and allow up to 10 minutes per recording.
export const Inject: Story = {
  name: "Use existing HTML",
  args: {
    enableAutoPause: true,
    selectors: {
      containerId: "videomail2",
      userMediaClass: "webcam",
      visualsClass: "da_window",
      buttonsClass: "all_my_buttons",
    },
    video: {
      countdown: 3,
      width: 640,
      limitSeconds: 600,
    },
  },
  render: () => `<div id="videomail2" class="videomail">
              <div class="da_window">
                <noscript>Please enable JavaScript to record a video.</noscript>
                <p class="recordNote" style="display: none"></p>
                <p class="recordTimer" style="display: none"></p>
                <div class="paused" style="display: none">
                  <p class="pausedHeader"></p>
                </div>
                <p class="countdown" style="display: none"></p>
                <div class="notifier"></div>
                <video class="replay" controls style="display: none"></video>
                <video class="webcam" style="display: none"></video>
              </div>
              <div class="all_my_buttons" style="display: none">
                <button class="record" style="display: none">&#9673; Record</button>
                <button class="pause" style="display: none">&#9553; Pause</button>
                <button class="resume" style="display: none">&#9673; Resume</button>
                <button class="preview" style="display: none">&#x25ba; Preview</button>
                <button class="recordAgain" style="display: none">&#x25c0; Record again</button>
              </div>
            </div>`,
  play: ({ args }) => {
    const videomailClient = createStoryClient(args);
    videomailClient.show();
  },
};

// Automatically record when ready
export const AutoRecord: Story = {
  name: "Records right away when loaded",
  args: {
    video: {
      countdown: 3,
      width: 240,
      limitSeconds: 60,
    },
  },
  render: (args) => {
    const videomailClient = createStoryClient(args);

    videomailClient.on("USER_MEDIA_READY", function () {
      videomailClient.record();
    });

    return videomailClient.show();
  },
};

export const MobileBreakPoint: Story = {
  name: "Sets a mobile breakpoint",
  args: {
    video: {
      width: 400,
      mobileBreakPoint: 740,
    },
  },
  render: (args) => {
    const videomailClient = createStoryClient(args);
    return videomailClient.show();
  },
};

export const AutoPlayOnReplay: Story = {
  name: "Auto play video after recording",
  args: {
    video: {
      width: 400,
      autoPlay: true,
    },
  },
  render: (args) => {
    const videomailClient = createStoryClient(args);
    return videomailClient.show();
  },
};

export default meta;
