import type { Preview } from "@storybook/html";
import { setupWorker } from "msw/browser";
import { mswLoader } from "msw-storybook-addon/csf3";

const preview: Preview = {
  parameters: {
    docs: {
      codePanel: true,
    },
    options: {
      storySort: {
        order: ["Record", "*", "Error Handling"],
      },
    },
  },

  // Initialize MSW and pass custom options directly via the loader function
  loaders: [
    mswLoader(async () => {
      const worker = setupWorker();

      await worker.start({
        onUnhandledRequest: (request, print) => {
          const origin = new URL(request.url).origin;

          if (
            origin.startsWith("https://videomail.io") ||
            origin.startsWith("wss://videomail.io") ||
            origin.startsWith("https://videos.pond5.com") ||
            origin.startsWith("https://s1.dmcdn.net")
          ) {
            // Bypass mocking for the real videomail server or assets
            return;
          }

          // Use the worker's native warning print tool for unhandled requests
          print.warning();
        },
      });

      return worker;
    }),
  ],
};

export default preview;
