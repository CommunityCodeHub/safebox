
import { v4 as uuidv4 } from 'uuid';
import { IExtensibleProperties } from './extensible-properties';

export enum AccountType {
        Savings = 'Savings',
        Current = 'Current',
        FixedDeposit = 'Fixed Deposit',
        RecurringDeposit = 'Recurring Deposit',
        MutualFund = "Mutual Fund"
}

export interface IBasicAccountDetails {
    NetbankingUrl: unknown;
    TransactionPassword: unknown;
    Password: unknown;
    LoginId: unknown;
    ApplicationName: string;
    BankName: string;
    AccountHolderName: string;
    AccountType: AccountType | string;
    OtherAccountType: string;
    AccountNumber: string;
    CustomerId: string; 
    TelephoneBankingPin: string;
}        

export interface IBankAccountCredentails {
    BasicAccountDetails: IBasicAccountDetails;
    AdditionalInfo: IExtensibleProperties;
    CreditCardDetails: ICardDetails[];
    DebitCardDetails: ICardDetails[];
    CreatedOn: Date;
    LastUpdatedOn: Date;
}

export interface ICardDetails{
    CardName: string;
    CardHolderName: string;
    CardNumber: string;
    ExpiryDate: string;
    CVV: string;
    IssuingBank: string;
    CreatedOn: Date;
    LastUpdatedOn: Date;
    AdditionalInfo: IExtensibleProperties;
    Pin: string
}


export class BankAccountCredentails implements IBankAccountCredentails {
    constructor(
        
    ) {}

        public BasicAccountDetails: IBasicAccountDetails;
        public AdditionalInfo: IExtensibleProperties;
        public CreditCardDetails: ICardDetails[];
        public DebitCardDetails: ICardDetails[];
        public CreatedOn: Date;
        public LastUpdatedOn: Date;
}