import { v4 as uuidv4 } from 'uuid';
import { IExtensibleProperties } from './extensible-properties';

export interface IApplicationCredentials {
  ApplicationCredentailId: string;
  ApplicationName: string;
  UserName: string;
  Password: string;
  LoginUrl: string;
  AdditionalInfo: { [key: string]: string };
  CreatedOn: Date;
  LastUpdatedOn: Date;

}



export class ApplicationCredentials implements IApplicationCredentials {
    private _ApplicationName: string = '';
    private _UserName: string = '';
    private _Password: string = '';
    private _LoginUrl: string = '';
    private _rowId: string = uuidv4(); 
    private _additionalInfo: IExtensibleProperties = {};
    private _createdOn: Date = new Date();
    private _lastUpdatedOn: Date = new Date();

   
    constructor(){
        
    }
    // CreatedOn: Date;
    // LastUpdatedOn: Date;

    public get CreatedOn(): Date {
        return this._createdOn;
    }
    public set CreatedOn(value: Date) {
        this._createdOn = value;
    }


    public get LastUpdatedOn(): Date {
        return this._lastUpdatedOn;
    }
    public set LastUpdatedOn(value: Date) {
        this._lastUpdatedOn = value;
    }


    public get ApplicationCredentailId(): string {
        return this._rowId;
    }
    public set ApplicationCredentailId(value: string) {
        this._rowId = value;
    }

    public get AdditionalInfo(): IExtensibleProperties {
        return this._additionalInfo;
    }
    public set AdditionalInfo(value: IExtensibleProperties) {
        this._additionalInfo = value;
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