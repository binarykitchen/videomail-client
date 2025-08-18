import { EmailAddress } from "./EmailAddress";

interface DeliveryReport {
  userKey?: string | undefined;
}

type DeliveryRecord = Record<EmailAddress, DeliveryReport | undefined>;

export default DeliveryRecord;
