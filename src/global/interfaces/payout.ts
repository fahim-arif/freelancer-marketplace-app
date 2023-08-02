export interface IStripeConnect {
  detailsSubmitted: boolean;
  ordersEnabled: boolean;
  payoutsEnabled: boolean;
  moreInformationRequired: boolean;
  payoutMethods: IStripePayoutMethod[];
}

export enum StripePayoutType {
  BankAccount = 0,
  Card = 1,
}

export interface IStripePayoutMethod {
  name: string;
  last4: string;
  type: StripePayoutType;
}
