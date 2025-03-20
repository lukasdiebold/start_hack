export type AccountKV = {
	username: string;
	password: string;
	email: string;
	bio?: string;
};

export type Profile = 'CLUELESS' | 'MOTIVATED' | 'HESITANT';

export enum Category {
	SALES = 'Sales',
	MARKETING = 'Marketing',
}
