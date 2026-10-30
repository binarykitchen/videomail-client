import type { Meta, StoryObj } from "@storybook/html";

import { PartialVideomailClientOptions } from "../types/options";
import { createStoryClient } from "./util/storyLifecycle";

const meta: Meta<PartialVideomailClientOptions> = {
  title: "Error Handling",
  args: { verbose: true },
};

type Story = StoryObj<PartialVideomailClientOptions>;

// The demo key works on localhost only. An invalid key shows an error.
// Get a key for your site at https://www.videomail.io/whitelist.
export const InvalidWhitelistKey: Story = {
  name: "Invalid whitelist key",
  args: {
    whitelistKey: "invalid-whitelist-key",
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

export default meta;
