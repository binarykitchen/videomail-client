import Client from "./client";
import standardize from "./util/standardize";

// Ensures Videomail functionality is not broken on exotic browsers with shims.
standardize(window, navigator);

export default Client;
