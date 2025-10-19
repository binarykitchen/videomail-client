import { EmailAddress } from "./EmailAddress";

interface DeliveryReport {
  userKey: string | false;
}

type DeliveryRecord = Record<EmailAddress, DeliveryReport>;

export type { DeliveryRecord };
