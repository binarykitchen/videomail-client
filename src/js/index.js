import standardize from "./util/standardize";
import Client from "./client";

if (!navigator) {
  throw new Error("Navigator is missing!");
} else {
  // Ensures Videomail functionality is not broken on exotic browsers with shims.
  standardize(window, navigator);
}

export default Client;

// also add that so that we can require() it the normal ES5 way
module.exports = Client;
