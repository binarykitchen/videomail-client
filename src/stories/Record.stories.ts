import "./static/css/entertain.css";

import type { Meta, StoryObj } from "@storybook/html";

import { VideomailClient } from "../client";
import { PartialVideomailClientOptions } from "../types/options";

const meta: Meta<PartialVideomailClientOptions> = {
  title: "Record",
  args: {
    disableSubmit: true,
    verbose: true,
  },
};

type Story = StoryObj<PartialVideomailClientOptions>;

// Dead simple with most defaults
export const DeadSimple: Story = {
  name: "Dead simple",
  args: {
    video: {
      width: 320,
    },
  },
  render: (args) => {
    const videomailClient = new VideomailClient(args);
    return videomailClient.show();
  },
};

// Dead simple too but based on jpeg image frames only
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
    const videomailClient = new VideomailClient(args);
    return videomailClient.show();
  },
};

// With audio, custom button text and without auto-pause + no countdown
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
    const videomailClient = new VideomailClient(args);
    return videomailClient.show();
  },
};

// High quality: High FPS, near HD quality, short duration and without auto-pause
//
// This example shows that your browser cannot meet the FPS requirements due to
// performance issues and will use a lower one instead.
export const HighQuality: Story = {
  name: "High Quality (40 fps)",
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
    const videomailClient = new VideomailClient(args);
    return videomailClient.show();
  },
};

// Only when clicking on record button, ask for webcam access
//
// With the option loadUserMediaOnRecord, the user won't be asked for webcam access on
// page load but later, only when the record button is being pressed.
export const AskOnRecord: Story = {
  name: "Ask upon recording",
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
    const videomailClient = new VideomailClient(args);
    return videomailClient.show();
  },
};

// With a facing mode button to switch camera for mobiles
// Only seen when you are on mobile.
export const FacingMode: Story = {
  name: "Facing mode for mobiles",
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
    const videomailClient = new VideomailClient(args);
    return videomailClient.show();
  },
};

// Entertain user while waiting and disable pause/resume buttons
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
    const videomailClient = new VideomailClient(args);
    return videomailClient.show();
  },
};

// Accept existing HTML, start recording asap and allow 10 min recording wohooo
export const Inject: Story = {
  name: "Inject to existing HTML code",
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
                <noscript>Please enable Javascript</noscript>
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
    const videomailClient = new VideomailClient(args);
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
    const videomailClient = new VideomailClient(args);

    videomailClient.on("USER_MEDIA_READY", function () {
      videomailClient.record();
    });

    return videomailClient.show();
  },
};

export default meta;
