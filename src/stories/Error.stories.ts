import type { Meta, StoryObj } from "@storybook/html";

import { VideomailClientOptions } from "../types/options";
import { DeepPartial } from "../types/DeepPartial";
import VideomailClient from "../client";

const meta: Meta<DeepPartial<VideomailClientOptions>> = {
  title: "Error Handling",
  args: {
    verbose: true,
  },
};

type Story = StoryObj<DeepPartial<VideomailClientOptions>>;

// With an invalid site name, you don't get whitelisted
//
// By default the site name is "videomail-client-demo" which works on localhost only
// To run the videomail client on your site, you'll have to register it at
// https://www.videomail.io/whitelist to obtain a valid site name
export const InvalidSiteName: Story = {
  args: {
    siteName: "invalid-site-name",
  },
  render: (args) => {
    const videomailClient = new VideomailClient(args);
    return videomailClient.show();
  },
};

export default meta;
