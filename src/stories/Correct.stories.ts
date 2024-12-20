import type { Meta, StoryObj } from "@storybook/html";

import { VideomailClientOptions } from "../types/options";
import { DeepPartial } from "../types/DeepPartial";
import videomailExample from "./static/json/videomail";
import VideomailClient from "../client";

// TODO Migrate more from Legacy

const meta: Meta<DeepPartial<VideomailClientOptions>> = {
  title: "Correct",
  args: {
    verbose: true,
  },
};

type Story = StoryObj<DeepPartial<VideomailClientOptions>>;

// A form to correct an existing videomail
export const CorrectExisting: Story = {
  args: {
    video: {
      width: 400,
    },
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
                  #videomail .visuals,
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
                  <div class="visuals" />
                </div>
                <form id="email">
                  <fieldset>
                    <input name="key" value="" type="hidden" />
                    <input name="from" type="email" required="required" />
                    <input name="to" type="email" required="required" multiple />
                    <input name="subject" type="text" required="required" />
                    <textarea name="body" rows="4"></textarea>
                    <input id="send" disabled="" type="submit" value="✉ Send" />
                  </fieldset>
                </form>`,
  play: ({ args }) => {
    const videomailClient = new VideomailClient(args);
    videomailClient.replay(videomailExample);
  },
};

export default meta;
