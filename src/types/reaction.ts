export const Reactions = {
  LOVE: { key: "love", label: "Love" },
  APPLAUSE: { key: "applause", label: "Applause" },
  FOLDED_HANDS: { key: "foldedHands", label: "Pray / Beg" },
  GRINNING_SWEAT: { key: "grinningSweat", label: "Smile / Grinning Sweat" },
  ANGER: { key: "anger", label: "Angry" },
} as const;

export type ReactionsType = (typeof Reactions)[keyof typeof Reactions];
export type ReactionKey = ReactionsType["key"];
export type ReactionLabel = ReactionsType["label"];

type UserKey = string;

export type PartialReactions = Partial<Record<ReactionKey, UserKey[]>>;

// When logged in, it's an array of nick names or masked email addresses, otherwise
// when not logged in, it's just a number of reactions.
export type ReactionPretty = number | UserKey[];
export type ReactionsPretty = Record<string, ReactionPretty[]>;
