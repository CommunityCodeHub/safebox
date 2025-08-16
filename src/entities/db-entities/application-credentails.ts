

export interface IApplicationCredentails {
  ApplicationName: string;
  UserName: string;
  Password: string;
  LoginUrl: string;
  AdditionalInfo: { [key: string]: string };
}

export interface AdditionalInfo {
    [key: string]: string;
}

export class ApplicationCredentails {
    private _ApplicationName: string = '';
    private _UserName: string = '';
    private _Password: string = '';
    private _LoginUrl: string = '';
    private _addionalInfo: AdditionalInfo = {}; 

   
    constructor(){
        
    }

    public get AdditionalInfo(): AdditionalInfo {
        return this._addionalInfo;
    }
    public set AdditionalInfo(value: AdditionalInfo) {
        this._addionalInfo = value;
    }


    public get ApplicationName(): string {
        return this._ApplicationName;
    }
    public set ApplicationName(value: string) {
        this._ApplicationName = value;
    }

    public get UserName(): string {
        return this._UserName;
    }
    public set UserName(value: string) {
        this._UserName = value;
    }

    public get Password(): string {
        return this._Password;
    }
    public set Password(value: string) {
        this._Password = value;
    }

    public get LoginUrl(): string {
        return this._LoginUrl;
    }
    public set LoginUrl(value: string) {
        this._LoginUrl = value;
    }
}