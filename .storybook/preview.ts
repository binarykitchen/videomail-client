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
  //
  // Remember always to initialize the MSW worker after each upgrade with:
  // npx msw init .storybook/public
  loaders: [
    mswLoader(async () => {
      const worker = setupWorker();

      await worker.start({
        onUnhandledFrame: ({ frame, defaults }) => {
          const protocol = frame.protocol;

          if (protocol && frame.data) {
            if (protocol === "http") {
              // @ts-expect-error MSW shall fix this typing sooner or later
              const request = frame.data.request as Request;
              const url = request.url;

              const origin = new URL(url).origin;

              if (
                origin.startsWith("https://videomail.io") ||
                origin.startsWith("https://videos.pond5.com") ||
                origin.startsWith("https://s1.dmcdn.net")
              ) {
                // Bypass mocking for the real videomail server or assets
                return;
              }
            } else if (protocol === "ws") {
              // @ts-expect-error MSW shall fix this typing sooner or later
              const origin = frame.data.connection.client.url.origin as string;

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
