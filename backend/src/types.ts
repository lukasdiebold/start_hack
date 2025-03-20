export type AccountKV = {
	username: string;
	password: string;
	email: string;
	bio?: string;
};

export type AreaKV = {
	contactIds: string[];
};

export type ContactKV = {
	name: string;
	description: string;
	institution: string;
	category: string;
	email: string;
	website: string;
};

export type Profile = 'CLUELESS' | 'MOTIVATED' | 'HESITANT';
