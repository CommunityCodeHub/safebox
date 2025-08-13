
import * as fs from 'fs';
import * as path from 'path';
import { ApplicationCredentails, AdditionalInfo } from '../entities/db-entities/application-credentails';

export class ApplicationCredentailsFileManager {
	static readFromFile(filePath: string): ApplicationCredentails[] {
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
			const cred = new ApplicationCredentails();
			cred.ApplicationName = item.ApplicationName || '';
			cred.UserName = item.UserName || '';
			cred.Password = item.Password || '';
			cred.LoginUrl = item.LoginUrl || '';
			cred.AdditionalInfo = item.AdditionalInfo || {};
			return cred;
		});
	}

	static updateFile(filePath: string, data: ApplicationCredentails[]): void {
		const absolutePath = path.resolve(filePath);
		fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2));
	}
}
