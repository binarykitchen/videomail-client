import { serializeError } from "serialize-error";
import type { Response } from "superagent";
import superagent from "superagent";

import { version as videomailClientVersion } from "../package.json";
import Constants from "./constants";
import type { FullVideomailErrorData } from "./types/error";
import type { VideomailClientOptions } from "./types/options";
import type { VideomailThread } from "./types/thread";
import type {
  PartialVideomail,
  Videomail,
  VideomailIdentifierType,
} from "./types/Videomail";
import getBrowser from "./util/browser/getBrowser";
import createError from "./util/error/createError";
import findOriginalExc from "./util/error/findOriginalExc";
import sanitizeErrorReport from "./util/error/sanitizeErrorReport";
import type VideomailError from "./util/error/VideomailError";
import getVersions from "./util/getVersions";
import sanitizeUrl from "./util/url/sanitizeUrl";
import type { FormMethodType } from "./wrappers/form";
import { FormMethod } from "./wrappers/form";

// Fields the host's defaults can fill in when its form leaves them empty.
const DEFAULT_FIELDS: readonly string[] = ["from", "to", "cc", "bcc", "subject", "body"];

// Superagent's names for the encodings a host form can use.
const FORM_TYPES = new Map([
  [Constants.public.ENC_TYPE_APP_JSON, "json"],
  [Constants.public.ENC_TYPE_FORM, "form"],
]);

class Resource {
  private readonly options: VideomailClientOptions;
  private readonly timezoneId: string;

  constructor(options: VideomailClientOptions) {
    this.options = options;

    this.timezoneId = window.Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  private applyDefaultValues(videomail: PartialVideomail) {
    const newVideomail = { ...videomail };

    // TODO(types) Defaults are plain strings, but to, cc and bcc expect address lists.
    for (const name of DEFAULT_FIELDS) {
      const defaultValue = this.options.defaults[name];

      if (defaultValue && !newVideomail[name]) {
        newVideomail[name] = defaultValue;
      }
    }

    return newVideomail;
  }

  // Every write to the Videomail API identifies the site and the user's time zone.
  private sendToApi(method: FormMethodType, url: string, body: object) {
    return superagent(method, url)
      .query({ [Constants.WHITELIST_KEY_LABEL]: this.options.whitelistKey })
      .set("Timezone-Id", this.timezoneId)
      .withCredentials()
      .send(body)
      .timeout(this.options.timeouts.connection);
  }

  private async get(
    identifierName: string,
    identifierValue: string,
    identifierType: VideomailIdentifierType,
  ) {
    const encodedIdentifier = encodeURIComponent(identifierValue);
    const url = `${this.options.apiUrl}/videomail/${identifierName}/${encodedIdentifier}/${identifierType}`;

    try {
      const request = await superagent("get", url)
        .type("json")
        .set("Accept", "application/json")
        .withCredentials()
        .set("Timezone-Id", this.timezoneId)
        .set(Constants.WHITELIST_KEY_LABEL, this.options.whitelistKey)
        .timeout(this.options.timeouts.connection);

      if (identifierType === "thread") {
        const thread = request.body as VideomailThread;
        return thread;
      }

      const videomail = request.body as Videomail;
      return videomail;
    } catch (exc) {
      throw createError({ exc: findOriginalExc(exc), options: this.options });
    }
  }

  private async write(method: FormMethodType, videomail: PartialVideomail) {
    const path = videomail.public ? "wall" : "videomail";
    let url = `${this.options.apiUrl}/${path}/`;

    if (method === FormMethod.PUT) {
      if (videomail.public) {
        throw createError({
          message: "A public videomail cannot be updated.",
          options: this.options,
        });
      }

      if (!videomail.key) {
        throw createError({
          message: "A videomail key is required when updating a videomail.",
          options: this.options,
        });
      }

      url += encodeURIComponent(videomail.key);
    }

    try {
      return await this.sendToApi(method, url, videomail);
    } catch (exc) {
      throw createError({ exc: findOriginalExc(exc), options: this.options });
    }
  }

  public async getByAlias(alias: string) {
    return (await this.get("alias", alias, "snapshot")) as Videomail;
  }

  public async getByKey(key: string) {
    return (await this.get("key", key, "snapshot")) as Videomail;
  }

  public async getThreadByAlias(alias: string) {
    return (await this.get("alias", alias, "thread")) as VideomailThread;
  }

  public async getThreadByKey(key: string) {
    return (await this.get("key", key, "thread")) as VideomailThread;
  }

  public async reportError(err: VideomailError) {
    const url = `${this.options.apiUrl}/client-error/`;

    let supportedConstraints: MediaTrackSupportedConstraints | undefined;
    let enumerateDevices: MediaDeviceInfo[] | undefined;

    try {
      // Insecure pages may not expose mediaDevices.
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (navigator.mediaDevices) {
        supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
        enumerateDevices = await navigator.mediaDevices.enumerateDevices();
      }
    } catch {
      supportedConstraints = undefined;
      enumerateDevices = undefined;
    }

    const fullVideomailErrorData: FullVideomailErrorData = {
      versions: getVersions(this.options),
      browser: err.browser,
      code: err.code,
      cause: err.cause instanceof Error ? serializeError(err.cause) : err.cause,
      cpu: err.cpu,
      device: err.device,
      engine: err.engine,
      err: err.err ? serializeError(err.err) : undefined,
      explanation: err.explanation,
      location: err.location,
      logLines: err.logLines,
      orientation: err.orientation,
      os: err.os,
      screen: err.screen,
      whitelistKey: err.whitelistKey,
      status: err.status,
      title: err.title,
      message: err.message,
      stack: err.stack,
      supportedConstraints,
      enumerateDevices,
      usedConstraints: err.usedConstraints,
    };

    // Send plain JSON, not a live Error instance.
    await this.sendToApi(
      FormMethod.POST,
      url,
      sanitizeErrorReport(fullVideomailErrorData),
    );
  }

  public async post(videomail: PartialVideomail) {
    const newVideomail: PartialVideomail = this.applyDefaultValues(videomail);

    if (!newVideomail.versions) {
      newVideomail.versions = {};
    }

    // Keep the client version and recording page for troubleshooting.
    newVideomail.versions.videomailClient = videomailClientVersion;

    // The page path is all support needs. Credentials, query strings and fragments
    // can carry tokens or personal data, and this value is stored with the video.
    newVideomail.recordLocation = sanitizeUrl(window.location.href);

    const browser = getBrowser(this.options);
    newVideomail.browserStats = browser.getUsefulData();

    try {
      let res: Response;

      if (this.options.callbacks.adjustFormDataBeforePosting) {
        const adjustedVideomail =
          this.options.callbacks.adjustFormDataBeforePosting(newVideomail);

        res = await this.write(FormMethod.POST, adjustedVideomail);
      } else {
        res = await this.write(FormMethod.POST, newVideomail);
      }

      return res;
    } catch (exc) {
      throw createError({ exc: findOriginalExc(exc), options: this.options });
    }
  }

  public async put(videomail: PartialVideomail) {
    return await this.write(FormMethod.PUT, videomail);
  }

  public async form(formData: Record<string, unknown>, url: string) {
    const formType = FORM_TYPES.get(this.options.enctype);

    if (!formType) {
      throw createError({
        err: new Error(`Invalid enctype given: ${this.options.enctype}`),
        options: this.options,
      });
    }

    try {
      const res = await superagent
        .post(url)
        .type(formType)
        .set("Timezone-Id", this.timezoneId)
        .send(formData)
        .timeout(this.options.timeouts.connection);

      return res;
    } catch (exc) {
      throw createError({ exc: findOriginalExc(exc), options: this.options });
    }
  }
}

export default Resource;
