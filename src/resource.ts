import superagent from "superagent";
import { serializeError } from "serialize-error";

import Constants from "./constants";
import { VideomailClientOptions } from "./types/options";
import Videomail, { PartialVideomail } from "./types/Videomail";
import createError from "./util/error/createError";
import Response from "superagent/lib/node/response";
import VideomailError from "./util/error/VideomailError";
import { FormInputs, FormMethod } from "./wrappers/form";
import HTTPError from "./util/error/HTTPError";
import { FullVideomailErrorData } from "./types/error";
import { version as videomailClientVersion } from "./../package.json";

function findOriginalExc(exc: unknown) {
  if (exc instanceof Error && "response" in exc) {
    const response = exc.response as Response;
    const body = response.body;

    if ("error" in body) {
      const message = body.error.message as string;
      const cause = body.error.cause;

      const error = new HTTPError(message, { cause });

      if (body.error.name) {
        error.name = body.error.name;
      }

      if (body.error.stack) {
        error.stack = body.error.stack;
      }

      if (body.error.status) {
        error.status = body.error.status;
      }

      if (body.error.code) {
        error.code = body.error.code;
      }

      return error;
    }
  }

  return exc;
}

class Resource {
  private readonly options: VideomailClientOptions;
  private readonly timezoneId: string;

  constructor(options: VideomailClientOptions) {
    this.options = options;

    this.timezoneId = window.Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  private applyDefaultValue(videomail: PartialVideomail, name: string) {
    if (this.options.defaults[name] && !videomail[name]) {
      videomail[name] = this.options.defaults[name];
    }

    return videomail;
  }

  private applyDefaultValues(videomail: PartialVideomail) {
    let newVideomail = { ...videomail };

    newVideomail = this.applyDefaultValue(newVideomail, "from");
    newVideomail = this.applyDefaultValue(newVideomail, "to");
    newVideomail = this.applyDefaultValue(newVideomail, "cc");
    newVideomail = this.applyDefaultValue(newVideomail, "bcc");
    newVideomail = this.applyDefaultValue(newVideomail, "subject");
    newVideomail = this.applyDefaultValue(newVideomail, "body");

    return newVideomail;
  }

  private async get(identifierName: string, identifierValue: string) {
    const url = `${this.options.baseUrl}/videomail/${identifierName}/${identifierValue}/snapshot`;

    try {
      const request = await superagent("get", url)
        .type("json")
        .set("Accept", "application/json")
        .set("Timezone-Id", this.timezoneId)
        .set(Constants.SITE_NAME_LABEL, this.options.siteName)
        .timeout(this.options.timeouts.connection);

      const videomail = request.body as Videomail;

      return videomail;
    } catch (exc) {
      throw createError({ exc: findOriginalExc(exc), options: this.options });
    }
  }

  private async write(method: FormMethod, videomail: PartialVideomail) {
    const queryParams = {
      [Constants.SITE_NAME_LABEL]: this.options.siteName,
    };

    let url = `${this.options.baseUrl}/videomail/`;

    if (method === FormMethod.PUT && videomail.key) {
      url += videomail.key;
    }

    try {
      const request = await superagent(method, url)
        .query(queryParams)
        .set("Timezone-Id", this.timezoneId)
        .send(videomail)
        .timeout(this.options.timeouts.connection);

      return request;
    } catch (exc) {
      throw createError({ exc: findOriginalExc(exc), options: this.options });
    }
  }

  public async getByAlias(alias: string) {
    return await this.get("alias", alias);
  }

  public async getByKey(key: string) {
    return await this.get("key", key);
  }

  public async reportError(err: VideomailError) {
    const queryParams = {
      [Constants.SITE_NAME_LABEL]: this.options.siteName,
    };

    const url = `${this.options.baseUrl}/client-error/`;

    try {
      const fullVideomailErrorData: FullVideomailErrorData = {
        browser: err.browser,
        code: err.code,
        cookie: err.cookie,
        cpu: err.cpu,
        device: err.device,
        engine: err.engine,
        err: serializeError(err.err),
        explanation: err.explanation,
        location: err.location,
        logLines: err.logLines,
        orientation: err.orientation,
        os: err.os,
        promise: err.promise,
        reason: err.reason,
        screen: err.screen,
        siteName: err.siteName,
        status: err.status,
        title: err.title,
        message: err.message,
        stack: err.stack,
        versions: {
          videomailClient: videomailClientVersion,
          videomailNinjaFormPlugin: this.options.versions?.videomailNinjaFormPlugin,
        },
      };

      await superagent(FormMethod.POST, url)
        .query(queryParams)
        .set("Timezone-Id", this.timezoneId)
        // Note you cant send the Error instance itself, it has to be a plain JSON
        .send(fullVideomailErrorData)
        .timeout(this.options.timeouts.connection);
    } catch (exc) {
      // Can't throw it again, so just print and do nothing else further.
      console.error(exc);
    }
  }

  public async post(videomail: PartialVideomail) {
    const newVideomail: PartialVideomail = this.applyDefaultValues(videomail);

    // Always good to know the version of the client the videomail was submitted with
    newVideomail[Constants.VERSION_LABEL] = videomailClientVersion;

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

  public async form(formData: FormInputs, url: string) {
    let formType: string;

    switch (this.options.enctype) {
      case Constants.public.ENC_TYPE_APP_JSON:
        formType = "json";
        break;
      case Constants.public.ENC_TYPE_FORM:
        formType = "form";
        break;
      default:
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
