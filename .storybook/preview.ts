import type { Preview } from "@storybook/html";
import { setupWorker } from "msw/browser";
import { mswLoader } from "msw-storybook-addon/csf3";

import { unloadStoryClients } from "../src/stories/util/storyLifecycle";

const preview: Preview = {
  beforeEach: () => unloadStoryClients,

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

  // Refresh the MSW worker after each upgrade:
  // npx msw init .storybook/public
  loaders: [
    mswLoader(async () => {
      const worker = setupWorker();

      await worker.start({
        onUnhandledFrame: ({ frame, defaults }) => {
          const protocol = frame.protocol;

          if (protocol && frame.data) {
            if (protocol === "http") {
              // @ts-expect-error MSW does not narrow HTTP frame data here.
              const request = frame.data.request as Request;
              const url = request.url;

              const origin = new URL(url).origin;

              if (
                origin.startsWith("https://videomail.io") ||
                origin.startsWith("https://videos.pond5.com") ||
                origin.startsWith("https://s1.dmcdn.net")
              ) {
                // Let real Videomail and asset requests through.
                return;
              }
            } else if (protocol === "ws") {
              // @ts-expect-error MSW does not narrow WebSocket frame data here.
              const origin = frame.data.connection.client.url.origin as string;

              if (origin.startsWith("wss://videomail.io")) {
                // Let the real recording connection through.
                return;
              }
            }
          }

          // Warn about anything we have not mocked or allowed.
          defaults.warn();
        },
      });

      return worker;
    }),
  ],
};

export default preview;
