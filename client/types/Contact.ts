export type ContactType = {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	company: string;
	id: string;
};

export type ContactFormType = {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	company: string;
};

export type ContactResponseType = {
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	company: string;
	id: string;
};

export type ContactWithAddress = {
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	company: string;
	id: string;
	street: string;
	zip_code: string;
	city: string;
	state: string;
	state_initials: string;
	person_id: string;
};

export type ContactsWithAddresses = ContactWithAddress[];
