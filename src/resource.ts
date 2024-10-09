import superagent from "superagent";

import Constants from "./constants";
import { VideomailClientOptions } from "./types/options";
import { PartialVideomail } from "./types/Videomail";

const timezoneId = window.Intl.DateTimeFormat().resolvedOptions().timeZone;

class Resource {
  private readonly options: VideomailClientOptions;

  constructor(options: VideomailClientOptions) {
    this.options = options;
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

  private setProperty(packedError, property, value) {
    Object.defineProperty(packedError, property, {
      value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  }

  private packError(err, res) {
    if (res?.body?.error) {
      const originalError = res.body.error;

      const packedError = new Error();

      this.setProperty(packedError, "name", originalError.name);
      this.setProperty(packedError, "type", originalError.type);
      this.setProperty(packedError, "message", originalError.message || res.statusText);
      this.setProperty(packedError, "cause", originalError.cause);
      this.setProperty(packedError, "status", originalError.status);
      this.setProperty(packedError, "code", originalError.code);
      this.setProperty(packedError, "errno", originalError.errno);
      this.setProperty(packedError, "details", originalError.details);
      this.setProperty(packedError, "stack", originalError.stack);

      return packedError;
    }

    return err;
  }

  private get(identifierName: string, identifierValue: string, cb) {
    const url = `${this.options.baseUrl}/videomail/${identifierName}/${identifierValue}/snapshot`;
    const request = superagent("get", url);

    request
      .type("json")
      .set("Accept", "application/json")
      .set("Timezone-Id", timezoneId)
      .set(Constants.SITE_NAME_LABEL, this.options.siteName)
      .timeout(this.options.timeouts.connection)
      .end((err, res) => {
        if (err) {
          const prettyError = this.packError(err, res);
          cb(prettyError);
        } else {
          const videomail = res.body ? res.body : null;
          cb(null, videomail);
        }
      });
  }

  private write(method: string, videomail: PartialVideomail, identifier?: string, cb?) {
    const queryParams = {};

    let url = `${this.options.baseUrl}/videomail/`;

    if (identifier) {
      url += identifier;
    }

    const request = superagent(method, url);

    queryParams[Constants.SITE_NAME_LABEL] = this.options.siteName;

    request
      .query(queryParams)
      .set("Timezone-Id", timezoneId)
      .send(videomail)
      .timeout(this.options.timeouts.connection)
      .end((err, res) => {
        if (err) {
          const prettyError = this.packError(err, res);
          cb(prettyError);
        } else {
          const returnedVideomail = res.body?.videomail ? res.body.videomail : null;

          cb(null, returnedVideomail, res.body);
        }
      });
  }

  public getByAlias(alias: string, cb) {
    this.get("alias", alias, cb);
  }

  public getByKey(key: string, cb) {
    this.get("key", key, cb);
  }

  public reportError(err, cb?) {
    const queryParams = {};
    const url = `${this.options.baseUrl}/client-error/`;
    const request = superagent("post", url);

    queryParams[Constants.SITE_NAME_LABEL] = this.options.siteName;

    request
      .query(queryParams)
      .send(err)
      .timeout(this.options.timeouts.connection)
      .end((err, res) => {
        if (err) {
          const prettyError = this.packError(err, res);
          cb?.(prettyError);
        } else {
          cb?.();
        }
      });
  }

  public post(videomail: PartialVideomail, cb) {
    const newVideomail = this.applyDefaultValues(videomail);

    /*
     * always good to know the version of the client
     * the videomail was submitted with
     */
    newVideomail[Constants.VERSION_LABEL] = this.options.version;

    if (this.options.callbacks.adjustFormDataBeforePosting) {
      this.options.callbacks.adjustFormDataBeforePosting(
        newVideomail,
        (err, adjustedVideomail) => {
          if (err) {
            cb(err);
          } else {
            this.write("post", adjustedVideomail, cb);
          }
        },
      );
    } else {
      this.write("post", newVideomail, cb);
    }
  }

  public put(videomail: PartialVideomail, cb) {
    this.write("put", videomail, videomail.key, cb);
  }

  public form(formData, url: string, cb) {
    let formType;

    switch (this.options.enctype) {
      case Constants.public.ENC_TYPE_APP_JSON:
        formType = "json";
        break;
      case Constants.public.ENC_TYPE_FORM:
        formType = "form";
        break;
      default:
        // keep all callbacks async
        setTimeout(() => {
          cb(new Error(`Invalid enctype given: ${this.options.enctype}`));
        }, 0);
    }

    if (formType) {
      superagent
        .post(url)
        .type(formType)
        .set("Timezone-Id", timezoneId)
        .send(formData)
        .timeout(this.options.timeouts.connection)
        .end((err, res) => {
          if (err) {
            const prettyError = this.packError(err, res);
            cb(prettyError);
          } else {
            cb(null, res);
          }
        });
    }
  }
}

export default Resource;
