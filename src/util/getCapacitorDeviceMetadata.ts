import type {
  BatteryInfo,
  DeviceInfo,
  GetLanguageCodeResult,
  LanguageTag,
} from "@capacitor/device";
import { Device } from "@capacitor/device";
import type { ErrorObject } from "serialize-error";
import { serializeError } from "serialize-error";

import { CapacitorDeviceMetadata } from "../types/device";

async function getCapacitorDeviceMetadata() {
  const errors: ErrorObject[] = [];
  let battery: BatteryInfo | undefined;
  let info: DeviceInfo | undefined;
  let languageCode: GetLanguageCodeResult | undefined;
  let languageTag: LanguageTag | undefined;

  try {
    info = await Device.getInfo();
  } catch (exc) {
    const err = serializeError(exc);

    let ignore = false;

    if (err.message?.includes("Device API not available in this browser")) {
      ignore = true;
    }

    if (!ignore) {
      errors.push(err);
    }
  }

  try {
    battery = await Device.getBatteryInfo();
  } catch (exc) {
    errors.push(serializeError(exc));
  }

  try {
    languageCode = await Device.getLanguageCode();
  } catch (exc) {
    errors.push(serializeError(exc));
  }

  try {
    languageTag = await Device.getLanguageTag();
  } catch (exc) {
    errors.push(serializeError(exc));
  }

  const metadata: CapacitorDeviceMetadata = {};

  if (battery) {
    metadata.battery = battery;
  }

  if (errors.length > 0) {
    metadata.errors = errors;
  }

  if (info) {
    metadata.info = info;
  }

  if (languageCode) {
    metadata.languageCode = languageCode;
  }

  if (languageTag) {
    metadata.languageTag = languageTag;
  }

  return metadata;
}

export default getCapacitorDeviceMetadata;
