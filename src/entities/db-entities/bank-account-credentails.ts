export class BankAccountCredentails {
    private _AccountHolderName: string = '';
    private _BankName: string = '';
    private _AccountType: string = '';
    private _AccountNumber: string = '';
    private _CustomerId: string = '';
    private _LoginId: string = '';
    private _Password: string = '';
    private _TransactionPassord: string = '';
    private _AtmPin: string = '';
    private _TPin: string = '';
    private _NetbankingUrl: string = '';
    private _CreatedOn: Date = new Date();
    private _LastUpdatedOn: Date = new Date();

    constructor(){}
   

    public get AccountHolderName(): string {
        return this._AccountHolderName;
    }
    public set AccountHolderName(value: string) {
        this._AccountHolderName = value;
    }

    public get BankName(): string {
        return this._BankName;
    }
    public set BankName(value: string) {
        this._BankName = value;
    }

    public get AccountType(): string {
        return this._AccountType;
    }
    public set AccountType(value: string) {
        this._AccountType = value;
    }

    public get AccountNumber(): string {
        return this._AccountNumber;
    }
    public set AccountNumber(value: string) {
        this._AccountNumber = value;
    }

    public get CustomerId(): string {
        return this._CustomerId;
    }
    public set CustomerId(value: string) {
        this._CustomerId = value;
    }

    public get LoginId(): string {
        return this._LoginId;
    }
    public set LoginId(value: string) {
        this._LoginId = value;
    }

    public get Password(): string {
        return this._Password;
    }
    public set Password(value: string) {
        this._Password = value;
    }

    public get TransactionPassord(): string {
        return this._TransactionPassord;
    }
    public set TransactionPassord(value: string) {
        this._TransactionPassord = value;
    }

    public get AtmPin(): string {
        return this._AtmPin;
    }
    public set AtmPin(value: string) {
        this._AtmPin = value;
    }

    public get TPin(): string {
        return this._TPin;
    }
    public set TPin(value: string) {
        this._TPin = value;
    }

    public get NetbankingUrl(): string {
        return this._NetbankingUrl;
    }
    public set NetbankingUrl(value: string) {
        this._NetbankingUrl = value;
    }

    public get CreatedOn(): Date {
        return this._CreatedOn;
    }
    public set CreatedOn(value: Date) {
        this._CreatedOn = value;
    }

    public get LastUpdatedOn(): Date {
        return this._LastUpdatedOn;
    }
    public set LastUpdatedOn(value: Date) {
        this._LastUpdatedOn = value;
    }
}