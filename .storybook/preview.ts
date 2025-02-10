import "@storybook/addon-console";

import { initialize, mswLoader } from "msw-storybook-addon";

import type { Preview } from "@storybook/html";

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize({
  onUnhandledRequest: ({ url, method }) => {
    const origin = new URL(url).origin;

    if (
      origin.startsWith("https://videomail.io") ||
      origin.startsWith("https://videos.pond5.com") ||
      origin.startsWith("https://s1.dmcdn.net")
    ) {
      // When using the real videomail server or fun hamster videos, don't need to mock that
      return false;
    }

    console.warn(`Unhandled ${method} request to ${url}`);
    return true;
  },
});

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        // See https://storybook.js.org/docs/writing-stories/naming-components-and-hierarchy
        order: ["Record", "*", "Error Handling"],
      },
    },
  },
  // 👈 Add the MSW loader to all stories
  loaders: [mswLoader],
};

export default preview;
