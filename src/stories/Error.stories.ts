import type { Meta, StoryObj } from "@storybook/html";

import VideomailClient from "./../index";
import { VideomailClientOptions } from "../types/options";
import { DeepPartial } from "../types/DeepPartial";

const meta: Meta<DeepPartial<VideomailClientOptions>> = {
  title: "Error Handling",
  argTypes: {
    fakeUaString: { control: "text" },
  },
  args: {
    verbose: true,
    adjustFormOnBrowserError: true,
  },
};

type Story = StoryObj<DeepPartial<VideomailClientOptions>>;

// How it looks on a bad browser
export const BadBrowser: Story = {
  name: "Bad Browser",
  args: {
    fakeUaString: "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)",
  },
  render: (args) => {
    const videomailClient = new VideomailClient(args);
    return videomailClient.show();
  },
};

// How it looks on an unsupported iPhone
export const BadIOS: Story = {
  name: "Bad iOS",
  args: {
    fakeUaString:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25",
    video: {
      // Just to test that this height will get removed so that the whole error message will be shown
      height: 100,
    },
  },
  render: (args) => {
    const videomailClient = new VideomailClient(args);
    return videomailClient.show();
  },
};

// With an invalid site name, you don't get whitelisted
//
// By default the site name is "videomail-client-demo" which works on localhost only
// To run the videomail client on your site, you'll have to register it at
// https://www.videomail.io/whitelist to obtain a valid site name
export const InvalidSiteName: Story = {
  name: "Invalid Site Name",
  args: {
    siteName: "invalid-site-name",
  },
  render: (args) => {
    const videomailClient = new VideomailClient(args);
    return videomailClient.show();
  },
};

export default meta;
