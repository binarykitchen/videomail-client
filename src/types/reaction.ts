export const Reactions = {
  LOVE: { key: "love", label: "Love" },
  APPLAUSE: { key: "applause", label: "Applause" },
  FOLDED_HANDS: { key: "foldedHands", label: "Pray / Beg" },
  GRINNING_SWEAT: { key: "grinningSweat", label: "Smile / Grinning Sweat" },
  ANGER: { key: "anger", label: "Angry" },
} as const;

export type ReactionKey = (typeof Reactions)[keyof typeof Reactions]["key"];

/*
  Example usage:

  const exampleReactionsByUserKey: ReactionsByUserKey = {
    [Reactions.GRINNING_SWEAT.key]: [userKey1, userKey2],
    [Reactions.ANGER.key]: [userKey3],
    [Reactions.FOLDED_HANDS.key]: [userKey4, userKey5, userKey6],
  };
*/
export type ReactionsByUserKey = Partial<Record<ReactionKey, readonly string[]>>;

/*
  Example usage:

  const exampleReactionsPretty: ReactionsPrettyByUserKey = {
    [Reactions.GRINNING_SWEAT.key]: {
      [userKey1]: {
        nickName: "User 1",
      },
      [userKey2]: {
        maskedEmailAddress: "user2@****.com",
      },
    },
    [Reactions.ANGER.key]: {
      [userKey3]: {
        nickName: "User 3",
      },
    },
    [Reactions.FOLDED_HANDS.key]: {
      [userKey4]: {
        maskedEmailAddress: "user4@****.com",
      },
      [userKey5]: {
        maskedEmailAddress: "user5@****.com",
      },
      [userKey6]: {
        nickName: "User 6",
      },
    },
  };
*/

export interface ReactionPrettyByUserKey {
  nickName?: string;
  maskedEmailAddress?: string;
}

export type ReactionsPrettyByUserKey = Partial<
  Record<ReactionKey, Partial<Record<string, ReactionPrettyByUserKey>>>
>;
