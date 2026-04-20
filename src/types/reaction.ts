export const Reactions = {
  LOVE: { key: "love", label: "Love" },
  APPLAUSE: { key: "applause", label: "Applause" },
  GRINNING_SWEAT: { key: "grinningSweat", label: "Whew!" },
  FIRE: { key: "fire", label: "Fire" },
} as const;

export type ReactionType = (typeof Reactions)[keyof typeof Reactions];
export type ReactionKey = ReactionType["key"];
export type ReactionLabel = ReactionType["label"];

export type ReactionsByUserKey = Partial<Record<ReactionKey, readonly string[]>>;

export interface ReactionPrettyByUserKey {
  nickName?: string | undefined;
  maskedEmailAddress?: string | undefined;
}

export type ReactionsPrettyByUserKey = Partial<
  Record<ReactionKey, Partial<Record<string, ReactionPrettyByUserKey>>>
>;
