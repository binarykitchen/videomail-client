import "@storybook/addon-console";
import type { Preview } from "@storybook/html";
const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        // See https://storybook.js.org/docs/writing-stories/naming-components-and-hierarchy
        order: ["Record", "*", "Error Handling"],
      },
    },
  },
};
export default preview;
