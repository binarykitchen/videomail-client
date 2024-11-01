import type { Meta, StoryObj } from "@storybook/html";
import { http, HttpResponse } from "msw";

import { Videomail, VideomailClient } from "../index";
import { VideomailClientOptions } from "../types/options";
import { DeepPartial } from "../types/DeepPartial";

import { SubmittedParams } from "../types/events";

const meta: Meta<DeepPartial<VideomailClientOptions>> = {
  title: "Form",
  args: {
    verbose: true,
  },
  argTypes: {
    verbose: { control: "boolean" },
  },
};

type Story = StoryObj<DeepPartial<VideomailClientOptions>>;

// Wrap into a form, validation, have a direct submit form and display the record
//
// Direct submit forms means, it sends data right away to the videomail.io server.
// But if you prefer to submit to your own server, look at the other Form examples
export const DirectSubmission: Story = {
  args: {
    video: {
      width: 240,
      countdown: false,
    },

    selectors: {
      containerId: "videomail1",
    },

    verbose: true,
  },
  render: () => `<style type="text/css">
              input[type="text"],
              .buttons {
                margin: 1em 0;
              }
              #startOver {
                display: block;
              }
            </style>
            <form id="videomail1">
              <input name="subject" type="text" placeholder="Enter a subject" required />
            </form>
            <div id="viewVideo" style="display: none">
              <h2 class="subject"></h2>
              <video class="replay"></video>
              <button id="startOver">Start over</button>
            </div>`,
  play: ({ args }) => {
    const videomailClient = new VideomailClient(args);

    const onSubmitted = ({ videomail }: SubmittedParams) => {
      videomailClient.replay(videomail, "viewVideo");

      const startOverButton = document.getElementById("startOver");

      if (startOverButton) {
        startOverButton.onclick = function () {
          videomailClient.startOver();
          // Attach again as it has been removed
          videomailClient.on("SUBMITTED", onSubmitted);
        };
      }
    };

    videomailClient.on("SUBMITTED", onSubmitted);

    videomailClient.show();
  },
};

/*
  A JSON based contact form embracing Sign Language!

  With the `submitWithVideomail` option, all videomail data is posted as well.

  Once you set the method to POST, then two request will be made internally.
  The first one to the videomail server and the second one to the specified action.

  WARNING: This example does not work on Netlify. If you clone and run that locally or on your
  own server it works fine ;)
*/
export const ContactForm: Story = {
  args: {
    submitWithVideomail: true,
    video: {
      limitSeconds: 120,
      width: 240,
      countdown: false,
    },
    selectors: {
      submitButtonSelector: 'body input[value="Submit"]',
      formId: "someForm",

      containerId: "videomail2",
    },
    defaults: {
      body: "No message content",
    },
    callbacks: {
      adjustFormDataBeforePosting(videomail) {
        videomail.subject = `Adjusted: ${videomail.subject}`;
        return videomail;
      },
    },
  },
  parameters: {
    msw: {
      handlers: [
        // Just mock and return it back
        http.post("https://localhost:8443/contact", async ({ request }) => {
          const videomail = await request.json();
          return HttpResponse.json(videomail);
        }),
      ],
    },
  },
  render: () => `<style type="text/css">
                  input[type="email"],
                  input[type="text"],
                  fieldset,
                  textarea,
                  .buttons,
                  #startOver {
                    margin: 1em 0;
                    display: block;
                  }
                </style>

                <form action="/contact" method="post" id="someForm">
                <input name="from" type="email" placeholder="Enter your email address" required />
                <input name="subject" type="text" placeholder="Enter a subject" required />
                <!-- Just for testing the isRegisteredFormField function, not relevant -->
                <input name="phone" type="text" placeholder="Enter a phone number" />
                <fieldset>
                  <legend>How do you want to contact us?</legend>
                  <p>
                    <input type="radio" name="how" id="writingOption" value="writing" checked />
                    <label for="writingOption">In Writing</label>
                  </p>
                  <p>
                    <input type="radio" name="how" id="signLanguageOption" value="sign_language" />
                    <label for="signLanguageOption">In Sign Language</label>
                  </p>
                </fieldset>
                <textarea
                  id="body"
                  name="body"
                  placeholder="Enter your message"
                  cols="40"
                  rows="5"
                  required
                ></textarea>

                <div id="videomail2"></div>
              </form>

              <!-- Placed outside the form by intention to ensure code works with that scenario as well -->
              <input type="button" value="Submit" disabled />

              <div id="viewVideo" style="display: none">
                <h2 class="subject"></h2>
                <h3 class="status"></h3>
                <p class="body"></p>
                <video class="replay"></video>
                <button id="startOver">Start over</button>
              </div>`,
  play: ({ args }) => {
    const videomailClient = new VideomailClient(args);

    const body = document.querySelector<HTMLTextAreaElement>(`#body`);
    const writingOption = document.querySelector<HTMLInputElement>(`#writingOption`);
    const signLanguageOption =
      document.querySelector<HTMLInputElement>(`#signLanguageOption`);

    if (writingOption) {
      writingOption.onclick = function () {
        videomailClient.hide();

        if (body) {
          body.style.display = "block";
          body.required = true;
        }
      };
    }

    if (signLanguageOption) {
      signLanguageOption.onclick = function () {
        videomailClient.show({ goBack: true });

        if (body) {
          body.style.display = "none";
          body.required = false;
        }
      };
    }

    const onSubmitted = ({ videomail, response }: SubmittedParams) => {
      const statusHeader = document.querySelector<HTMLHeadElement>("h3.status");

      if (statusHeader) {
        // Refer to above msw for the mocked response
        statusHeader.innerHTML = response.status.toString();
      }

      videomailClient.replay(videomail, "viewVideo");

      const startOverButton = document.getElementById("startOver");

      if (startOverButton) {
        startOverButton.onclick = function () {
          videomailClient.startOver({ keepHidden: writingOption?.checked });
          // Attach again as it has been removed
          videomailClient.on("SUBMITTED", onSubmitted);
        };
      }
    };

    videomailClient.on("SUBMITTED", onSubmitted);

    videomailClient.build();
  },
};

// This records and submit a video, without any email addresses at all
//
// It is very similar to the contact_form.html example with the exception that it does
// not submit any form data nor won't trigger an email being sent on the server.
//
// In the POST response you'll get data about the newly generated videomail,
// i.E. its ID. It is up to you how to process it further.
export const VideoSubmissionOnly: Story = {
  args: {
    enablePause: false,
    video: {
      limitSeconds: 80,
      width: 640,
      height: 340,
      countdown: false,
    },
    selectors: {
      containerId: "videomail3",
    },
  },
  render: () => `<style type="text/css">
                  .buttons,
                  #startOver {
                    margin: 1em 0;
                    display: block;
                  }
                </style>
                <form id="videomail3" action="/contact" method="post">
                  <div class="buttons">
                    <button type="submit" disabled>Submit</button>
                  </div>
                </form>

                <div id="viewVideo" style="display: none">
                  <h4 style="display: none">Permalink to view online <a class="url"></a></h4>
                  <h4 style="display: none">Permalink to WebM video <a class="webm"></a></h4>
                  <h4 style="display: none">Permalink to MP4 video <a class="mp4"></a></h4>
                  <video class="replay"></video>
                  <button id="startOver">Start over</button>
                </div>`,
  play: ({ args }) => {
    const videomailClient = new VideomailClient(args);

    function setAttribute(videomail: Videomail, name: string) {
      if (videomail[name]) {
        const element = document.querySelector(`a.${name}`);

        if (element) {
          element.innerHTML = videomail[name];
          element.setAttribute("href", videomail[name]);

          if (element.parentElement) {
            element.parentElement.style.display = "block";
          }
        }
      }
    }

    const onSubmitted = ({ videomail }: SubmittedParams) => {
      setAttribute(videomail, "url");
      setAttribute(videomail, "webm");
      setAttribute(videomail, "mp4");

      videomailClient.replay(videomail, "viewVideo");

      const startOverButton = document.getElementById("startOver");

      if (startOverButton) {
        startOverButton.onclick = function () {
          videomailClient.startOver();
          // Attach again as it has been removed
          videomailClient.on("SUBMITTED", onSubmitted);
        };
      }
    };

    videomailClient.on("SUBMITTED", onSubmitted);

    videomailClient.show();
  },
};

// Another form example where the videomail input itself is optional and takes
// full width of the parent container (stretch = true)
export const Stretch: Story = {
  args: {
    video: { limitSeconds: 120, width: 320, countdown: false, stretch: true },
    enableAutoValidation: false,
    selectors: {
      submitButtonSelector: 'body input[value="Submit"]',
      formId: "optionalVideomailForm",
      containerId: "videomail4",
    },
  },
  render: () => `<style type="text/css">
                    input[type="email"],
                    input[type="text"],
                    fieldset,
                    textarea,
                    .buttons,
                    #startOver {
                      margin: 1em 0;
                      display: block;
                    }
                  </style>
                  <form action="/contact" method="post" id="optionalVideomailForm">
                    <input name="from" type="email" placeholder="Enter your email address" required />
                    <input name="subject" type="text" placeholder="Enter a subject" required />
                    <div id="videomail4"></div>
                    <textarea
                      id="body"
                      name="body"
                      placeholder="Enter your message"
                      cols="40"
                      rows="5"
                      required
                    ></textarea>
                  </form>

                  <!-- Placed outside the form by intention to ensure code works with that scenario as well -->
                  <input type="button" value="Submit" />

                  <div id="viewVideo" style="display: none">
                    <h2 class="subject"></h2>
                    <h3 class="status"></h3>
                    <p class="body"></p>
                    <video class="replay"></video>
                    <button id="startOver">Start over</button>
                  </div>`,
  play: ({ args }) => {
    const videomailClient = new VideomailClient(args);

    const onSubmitted = ({ videomail, response }: SubmittedParams) => {
      const statusHeader = document.querySelector("h3.status");

      if (statusHeader) {
        statusHeader.innerHTML = response.status.toString();
      }

      videomailClient.replay(videomail, "viewVideo");

      const startOverButton = document.getElementById("startOver");

      if (startOverButton) {
        startOverButton.onclick = function () {
          videomailClient.startOver();
          // Attach again as it has been removed
          videomailClient.on("SUBMITTED", onSubmitted);
        };
      }
    };

    videomailClient.on("SUBMITTED", onSubmitted);

    videomailClient.show();
  },
};

// Another form example with optional CC and BCC input fields for email addresses
export const WithCCAndBCC: Story = {
  args: {
    video: { limitSeconds: 120, width: 320, countdown: false },
    selectors: {
      submitButtonSelector: 'body input[value="Submit"]',
      formId: "videomailFormWithCcAndBcc",
      containerId: "videomail5",
    },
  },
  render: () => `<style type="text/css">
                  input[type="email"],
                  input[type="text"],
                  fieldset,
                  textarea,
                  .buttons,
                  #startOver {
                    margin: 1em 0;
                    display: block;
                  }
                </style>
                <form id="videomailFormWithCcAndBcc">
                <input
                  name="from"
                  size="64"
                  type="email"
                  placeholder="Enter your email address"
                  required
                />
                <input
                  multiple
                  name="to"
                  size="64"
                  type="email"
                  placeholder="Enter recipient TO email addresss(es)"
                />
                <input
                  multiple
                  name="cc"
                  size="64"
                  type="email"
                  placeholder="Enter recipient CC email address(es)"
                />
                <input
                  multiple
                  name="bcc"
                  size="64"
                  type="email"
                  placeholder="Enter recipient BCC email address(es)"
                />
                <input
                  name="subject"
                  size="64"
                  type="text"
                  placeholder="Enter a subject"
                  required
                />
                <div id="videomail5"></div>
                <textarea
                  id="body"
                  name="body"
                  placeholder="Enter your message"
                  cols="40"
                  rows="4"
                  required
                ></textarea>
              </form>
              <input type="button" value="Submit" disabled />
              <div id="viewVideo" style="display: none">
                <h2 class="subject"></h2>
                <h3 class="status"></h3>
                <p class="body"></p>
                <video class="replay"></video>
                <button id="startOver">Start over</button>
              </div>`,
  play: ({ args }) => {
    const videomailClient = new VideomailClient(args);

    const onSubmitted = ({ videomail, response }: SubmittedParams) => {
      const statusHeader = document.querySelector("h3.status");

      if (statusHeader) {
        statusHeader.innerHTML = response.status.toString();
      }

      videomailClient.replay(videomail, "viewVideo");

      const startOverButton = document.getElementById("startOver");

      if (startOverButton) {
        startOverButton.onclick = function () {
          videomailClient.startOver();
          // Attach again as it has been removed
          videomailClient.on("SUBMITTED", onSubmitted);
        };
      }
    };

    videomailClient.on("SUBMITTED", onSubmitted);

    videomailClient.show();
  },
};

export default meta;
