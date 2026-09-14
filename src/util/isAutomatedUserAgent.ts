function isAutomatedUserAgent(userAgent = navigator.userAgent) {
  return /bot|crawler|spider|headlesschrome|phantomjs|puppeteer|playwright/iu.test(
    userAgent,
  );
}

export default isAutomatedUserAgent;
