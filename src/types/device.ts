import type {
  BatteryInfo,
  DeviceInfo,
  GetLanguageCodeResult,
  LanguageTag,
} from "@capacitor/device";
import type { ErrorObject } from "serialize-error";

interface CapacitorDeviceMetadata {
  battery?: BatteryInfo;
  errors?: ErrorObject[];
  info?: DeviceInfo;
  languageCode?: GetLanguageCodeResult;
  languageTag?: LanguageTag;
}

export type { CapacitorDeviceMetadata };
