import type { Meta, StoryObj } from "@storybook/html";

import { VideomailClient } from "../client";
import { PartialVideomailClientOptions } from "../types/options";
import videomailDesktopExample from "./static/json/desktopVideomail";
import videomailMobileExample from "./static/json/mobileVideomail";

const meta: Meta<PartialVideomailClientOptions> = {
  title: "Player",
  args: {
    disableSubmit: true,
    verbose: true,
  },
};

type Story = StoryObj<PartialVideomailClientOptions>;

// Play an existing desktop videomail, nothing else
export const PlayDesktopVideomail: Story = {
  name: "Play desktop videomail",
  render: (args) => {
    const videomailClient = new VideomailClient(args);
    return videomailClient.replay(videomailDesktopExample);
  },
};

// Play an existing videomail recorded on mobile, nothing else
export const PlayMobileVideomail: Story = {
  name: "Play mobile videomail",
  render: (args) => {
    const videomailClient = new VideomailClient(args);
    return videomailClient.replay(videomailMobileExample);
  },
};

// A form to play an existing videomail, with a form
export const PlayVideomailWithForm: Story = {
  name: "Play videomail with form",
  args: {
    selectors: {
      formId: "email",
      keyInputName: "key",
    },
  },
  render: () => `<style type="text/css">
              input[type="email"],
              input[type="text"],
              textarea,
              .buttons {
                margin: 1em 0;
                display: block;
              }
              #videomail,
              #email {
                float: left;
              }
              #email {
                width: 400px;
                margin-left: 1em;
              }
              #email input,
              #email textarea {
                width: 100%;
              }
            </style>
            <div id="videomail">
              <div class="visuals"></div>
            </div>
            <form id="email">
              <fieldset>
                <input name="key" type="hidden" />
                <input name="from" type="email" required="required" />
                <input name="to" type="email" required="required" multiple />
                <input name="subject" type="text" required="required" />
                <textarea name="body" rows="4"></textarea>
                <input id="send" disabled="" type="submit" value="✉ Send" />
              </fieldset>
            </form>`,
  play: ({ args }) => {
    const videomailClient = new VideomailClient(args);

    // just a copy paste of json of the videomail
    // you normally would get from a xhr get request
    videomailClient.replay(videomailDesktopExample, "videomail");
  },
};

export default meta;
