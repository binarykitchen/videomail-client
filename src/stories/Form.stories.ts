import type { Meta, StoryObj } from "@storybook/html";

import VideomailClient from "../index";
import { VideomailClientOptions } from "../types/options";
import { DeepPartial } from "../types/DeepPartial";

import "./static/css/entertain.css";

// TODO Migrate more from Legacy

const meta: Meta<DeepPartial<VideomailClientOptions>> = {
  title: "Form",
  args: {
    verbose: true,
  },
};

type Story = StoryObj<DeepPartial<VideomailClientOptions>>;

// Wrap into a form, validation, have a direct submit form and display the record
//
// Direct submit forms means, it sends data right away to the videomail.io server.
// But if you prefer to submit to your own server, look at the other Form examples
export const DirectSubmission: Story = {
  name: "Direct Submission",
  args: {
    enablePause: false,
    video: {
      width: 240,
      countdown: false,
    },
    selectors: {
      containerId: "videomail",
    },
  },
  render: () => {
    return `<style type="text/css">
              input[type="text"],
              .buttons {
                margin: 1em 0;
              }
              #startOver {
                display: block;
              }
            </style>
            <form id="videomail">
              <input name="subject" type="text" placeholder="Enter a subject" required />
            </form>
            <div id="viewVideo" style="display: none">
              <h2 class="subject"></h2>
              <video class="replay"></video>
              <button id="startOver">Start over</button>
            </div>`;
  },
  play: ({ args }) => {
    const videomailClient = new VideomailClient(args);

    const onSubmitted = function (videomail) {
      videomailClient.replay(videomail, "viewVideo");

      const startOverButton = document.getElementById("startOver");

      if (startOverButton) {
        startOverButton.onclick = function () {
          videomailClient.startOver();
        };
      }
    };

    // @ts-ignore Fix later
    videomailClient.on(
      videomailClient.events.SUBMITTED,
      onSubmitted.bind(videomailClient),
    );

    videomailClient.show();
  },
};

export default meta;
