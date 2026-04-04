import { UserKey } from "./user";

export const Reaction = {
  LOVE: { key: "love", label: "Love" },
  APPLAUSE: { key: "applause", label: "Applause" },
  FOLDED_HANDS: { key: "foldedHands", label: "Pray / Beg" },
  GRINNING_SWEAT: { key: "grinningSweat", label: "Smile / Grinning Sweat" },
  ANGER: { key: "anger", label: "Angry" },
} as const;

export type Reaction = (typeof Reaction)[keyof typeof Reaction];
export type ReactionKey = Reaction["key"];
export type ReactionLabel = Reaction["label"];

export type Reactions = Partial<Record<ReactionKey, UserKey[]>>;
