import { VideomailClient } from "../../client";
import type { PartialVideomailClientOptions } from "../../types/options";

const storyClients = new Set<VideomailClient>();

export function createStoryClient(options?: PartialVideomailClientOptions) {
  const client = new VideomailClient(options);
  storyClients.add(client);

  return client;
}

export function unloadStoryClients() {
  for (const client of storyClients) {
    client.unload();
  }

  storyClients.clear();
}
