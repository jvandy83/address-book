export type ContactWithAddress = {
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	company: string;
	id: number;
	street: string;
	zip_code: string;
	city: string;
	state: string;
	state_initials: string;
	person_id: number;
};

export type ContactsWithAddresses = ContactWithAddress[];
