declare module "multiparty" {
	interface FormOptions {
		autoFields?: boolean;
		autoFiles?: boolean;
		maxFields?: number;
		maxFieldsSize?: number;
		maxFilesSize?: number;
	}

	export class Form {
		constructor(options?: FormOptions);
		parse(
			req: any,
			callback: (
				err: any,
				fields: { [key: string]: any },
				files: { [key: string]: any },
			) => void,
		): void;
	}
}
