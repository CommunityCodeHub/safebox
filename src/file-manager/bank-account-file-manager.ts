
import * as fs from 'fs';
import * as path from 'path';
import { BankAccountCredentails } from '../entities/db-entities/bank-account-credentails';

export class BankAccountCredentailsFileManager {
	static readFromFile(filePath: string): BankAccountCredentails[] {
		const absolutePath = path.resolve(filePath);
		if (!fs.existsSync(absolutePath)) {
			throw new Error(`File not found: ${absolutePath}`);
		}
		const fileContent = fs.readFileSync(absolutePath, 'utf-8');
		const jsonArray = JSON.parse(fileContent);
		if (!Array.isArray(jsonArray)) {
			throw new Error('JSON content is not an array');
		}
		return jsonArray.map((item: any) => {
			const cred = new BankAccountCredentails();
			cred.AccountHolderName = item.AccountHolderName || '';
			cred.BankName = item.BankName || '';
			cred.AccountType = item.AccountType || '';
			cred.AccountNumber = item.AccountNumber || '';
			cred.CustomerId = item.CustomerId || '';
			cred.LoginId = item.LoginId || '';
			cred.Password = item.Password || '';
			cred.TransactionPassord = item.TransactionPassord || '';
			cred.AtmPin = item.AtmPin || '';
			cred.TPin = item.TPin || '';
			cred.NetbankingUrl = item.NetbankingUrl || '';
			cred.CreatedOn = item.CreatedOn ? new Date(item.CreatedOn) : new Date();
			cred.LastUpdatedOn = item.LastUpdatedOn ? new Date(item.LastUpdatedOn) : new Date();
			return cred;
		});
	}

    static updateFile(filePath: string, data: BankAccountCredentails[]): void {
        const absolutePath = path.resolve(filePath);
        fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2));
    }
}
