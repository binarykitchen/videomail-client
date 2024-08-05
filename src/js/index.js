import standardize from "./util/standardize";
import Client from "./client";

if (!navigator) {
  throw new Error("Navigator is missing!");
} else {
  // Ensures Videomail functionality is not broken on exotic browsers with shims.
  standardize(window, navigator);
}

// Provide both ways

// export { Client };

export default Client;
