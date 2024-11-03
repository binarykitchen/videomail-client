import superagent from "superagent";

import Constants from "./constants";
import { VideomailClientOptions } from "./types/options";
import Videomail, { PartialVideomail } from "./types/Videomail";
import createError from "./util/error/createError";
import Response from "superagent/lib/node/response";
import VideomailError from "./util/error/VideomailError";
import { FormInputs, FormMethod } from "./wrappers/form";

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
      throw createError({ exc, options: this.options });
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
      throw createError({ exc, options: this.options });
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
      await superagent(FormMethod.POST, url)
        .query(queryParams)
        .send(err)
        .timeout(this.options.timeouts.connection);
    } catch (exc) {
      // Can't throw it again, so just print and do nothing else further.
      console.error(exc);
    }
  }

  public async post(videomail: PartialVideomail) {
    const newVideomail: PartialVideomail = this.applyDefaultValues(videomail);

    /*
     * always good to know the version of the client
     * the videomail was submitted with
     */
    newVideomail[Constants.VERSION_LABEL] = this.options.version;

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
      throw createError({ exc, options: this.options });
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
      throw createError({ exc, options: this.options });
    }
  }
}

export default Resource;
