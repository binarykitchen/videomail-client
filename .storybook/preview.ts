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
        onUnhandledFrame: ({ frame, defaults }) => {
          if (frame.data) {
            // @ts-expect-error MSW shall fix this typing sooner or later
            const request = frame.data.request as Request;
            const origin = new URL(request.url).origin;

            if (frame.protocol === "http") {
              if (
                origin.startsWith("https://videomail.io") ||
                origin.startsWith("https://videos.pond5.com") ||
                origin.startsWith("https://s1.dmcdn.net")
              ) {
                // Bypass mocking for the real videomail server or assets
                return;
              }
            } else if (frame.protocol === "ws") {
              if (origin.startsWith("wss://videomail.io")) {
                // Bypass mocking for the real videomail WebSocket server
                return;
              }
            }
          }

          // Use the worker's native warning print tool for unhandled requests
          defaults.warn();
        },
      });

      return worker;
    }),
  ],
};

export default preview;
