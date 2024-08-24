import superagent from "superagent";

import Constants from "./constants";

const timezoneId = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function (options) {
  function applyDefaultValue(videomail, name) {
    if (options.defaults[name] && !videomail[name]) {
      videomail[name] = options.defaults[name];
    }

    return videomail;
  }

  function applyDefaultValues(videomail) {
    if (options.defaults) {
      videomail = applyDefaultValue(videomail, "from");
      videomail = applyDefaultValue(videomail, "to");
      videomail = applyDefaultValue(videomail, "cc");
      videomail = applyDefaultValue(videomail, "bcc");
      videomail = applyDefaultValue(videomail, "subject");
      videomail = applyDefaultValue(videomail, "body");
    }

    return videomail;
  }

  function packError(err, res) {
    if (res && res.body && res.body.error) {
      // use the server generated text instead of the superagent's default text
      err = res.body.error;

      if (!err.message && res.text) {
        err.message = res.text;
      }
    }

    return err;
  }

  function fetch(identifierName, identifierValue, cb) {
    const url = `${options.baseUrl}/videomail/${identifierName}/${identifierValue}/snapshot`;
    const request = superagent("get", url);

    request
      .type("json")
      .set("Accept", "application/json")
      .set("Timezone-Id", timezoneId)
      .set(Constants.SITE_NAME_LABEL, options.siteName)
      .timeout(options.timeouts.connection)
      .end(function (err, res) {
        if (err) {
          const prettyError = packError(err, res);
          cb(prettyError);
        } else {
          const videomail = res.body ? res.body : null;
          cb(null, videomail);
        }
      });
  }

  function write(method, videomail, identifier, cb) {
    if (!cb) {
      cb = identifier;
      identifier = null;
    }

    const queryParams = {};

    let url = `${options.baseUrl}/videomail/`;

    if (identifier) {
      url += identifier;
    }

    const request = superagent(method, url);

    queryParams[Constants.SITE_NAME_LABEL] = options.siteName;

    request
      .query(queryParams)
      .set("Timezone-Id", timezoneId)
      .send(videomail)
      .timeout(options.timeout)
      .end(function (err, res) {
        if (err) {
          const prettyError = packError(err, res);
          cb(prettyError);
        } else {
          const returnedVideomail =
            res.body && res.body.videomail ? res.body.videomail : null;

          cb(null, returnedVideomail, res.body);
        }
      });
  }

  this.getByAlias = function (alias, cb) {
    fetch("alias", alias, cb);
  };

  this.getByKey = function (key, cb) {
    fetch("key", key, cb);
  };

  this.reportError = function (err, cb) {
    const queryParams = {};
    const url = `${options.baseUrl}/client-error/`;
    const request = superagent("post", url);

    queryParams[Constants.SITE_NAME_LABEL] = options.siteName;

    request
      .query(queryParams)
      .send(err)
      .timeout(options.timeout)
      .end(function (err, res) {
        if (err) {
          const prettyError = packError(err, res);
          cb && cb(prettyError);
        } else {
          cb && cb();
        }
      });
  };

  this.post = function (videomail, cb) {
    videomail = applyDefaultValues(videomail);

    /*
     * always good to know the version of the client
     * the videomail was submitted with
     */
    videomail[Constants.VERSION_LABEL] = options.version;

    if (options.callbacks.adjustFormDataBeforePosting) {
      options.callbacks.adjustFormDataBeforePosting(
        videomail,
        function (err, adjustedVideomail) {
          if (err) {
            cb(err);
          } else {
            write("post", adjustedVideomail, cb);
          }
        },
      );
    } else {
      write("post", videomail, cb);
    }
  };

  this.put = function (videomail, cb) {
    write("put", videomail, videomail.key, cb);
  };

  this.form = function (formData, url, cb) {
    let formType;

    switch (options.enctype) {
      case Constants.public.ENC_TYPE_APP_JSON:
        formType = "json";
        break;
      case Constants.public.ENC_TYPE_FORM:
        formType = "form";
        break;
      default:
        // keep all callbacks async
        setTimeout(() => {
          cb(new Error(`Invalid enctype given: ${options.enctype}`));
        }, 0);
    }

    if (formType) {
      superagent
        .post(url)
        .type(formType)
        .set("Timezone-Id", timezoneId)
        .send(formData)
        .timeout(options.timeout)
        .end(function (err, res) {
          if (err) {
            const prettyError = packError(err, res);
            cb(prettyError);
          } else {
            cb(null, res);
          }
        });
    }
  };
}
