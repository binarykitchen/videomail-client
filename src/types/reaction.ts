// When logged in, it's an array of nick names or masked email addresses, otherwise
// when not logged in, it's just a number of reactions.
export type ReactionPretty = number | string[];
export type ReactionsPretty = Record<string, ReactionPretty[]>;
