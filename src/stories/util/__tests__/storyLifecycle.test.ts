import { createStoryClient, unloadStoryClients } from "../storyLifecycle";

describe("Story lifecycle", () => {
  it("unloads every client created by a story", () => {
    const clients = [createStoryClient(), createStoryClient()];
    clients.forEach((client) => client.show());

    unloadStoryClients();

    expect(clients.map((client) => client.isBuilt())).toEqual([false, false]);
  });
});
