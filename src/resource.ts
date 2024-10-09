import superagent from "superagent";

import Constants from "./constants";
import { VideomailClientOptions } from "./types/options";

const timezoneId = Intl.DateTimeFormat().resolvedOptions().timeZone;

class Resource {
  private readonly options: VideomailClientOptions;

  constructor(options: VideomailClientOptions) {
    this.options = options;
  }

  private applyDefaultValue(videomail, name: string) {
    if (this.options.defaults[name] && !videomail[name]) {
      videomail[name] = this.options.defaults[name];
    }

    return videomail;
  }

  private applyDefaultValues(videomail) {
    if (this.options.defaults) {
      videomail = this.applyDefaultValue(videomail, "from");
      videomail = this.applyDefaultValue(videomail, "to");
      videomail = this.applyDefaultValue(videomail, "cc");
      videomail = this.applyDefaultValue(videomail, "bcc");
      videomail = this.applyDefaultValue(videomail, "subject");
      videomail = this.applyDefaultValue(videomail, "body");
    }

    return videomail;
  }

  private setProperty(packedError, property, value) {
    Object.defineProperty(packedError, property, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  }

  private packError(err, res) {
    if (res && res.body && res.body.error) {
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

  private write(method, videomail, identifier, cb?) {
    if (!cb) {
      cb = identifier;
      identifier = null;
    }

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
          const returnedVideomail =
            res.body && res.body.videomail ? res.body.videomail : null;

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

  public reportError(err, cb) {
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
          cb && cb(prettyError);
        } else {
          cb && cb();
        }
      });
  }

  public post(videomail, cb) {
    videomail = this.applyDefaultValues(videomail);

    /*
     * always good to know the version of the client
     * the videomail was submitted with
     */
    videomail[Constants.VERSION_LABEL] = this.options.version;

    if (this.options.callbacks.adjustFormDataBeforePosting) {
      this.options.callbacks.adjustFormDataBeforePosting(
        videomail,
        (err, adjustedVideomail) => {
          if (err) {
            cb(err);
          } else {
            this.write("post", adjustedVideomail, cb);
          }
        },
      );
    } else {
      this.write("post", videomail, cb);
    }
  }

  public put(videomail, cb) {
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
