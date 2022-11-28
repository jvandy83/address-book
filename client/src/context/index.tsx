import React, { createContext, useEffect, useState } from 'react';
import { ContactFormType } from 'types/Contact';
import {
	ContactsWithAddresses,
	ContactWithAddress,
} from 'types/ContactWithAddress';
import { FormStatus } from 'types/FormStatus';

import { mutations } from '~src/api/mutate';
import { queries } from '~src/api/query';
import { getCurrentContact } from '~src/useLocalStorage';

const initialStatus = {
	enteringContact: false,
	enteringAddress: false,
	submittingContact: false,
	submittingAddress: false,
};

export const initialContactResponse = {
	first_name: '',
	last_name: '',
	email: '',
	phone_number: '',
	company: '',
	id: 0,
};
export const initialContactState = {
	first_name: '',
	last_name: '',
	phone_number: '',
	email: '',
	company: '',
	id: 0,
	person_id: 0,
	street: '',
	city: '',
	zip_code: '',
	state: '',
	state_initials: '',
};

const initialContactFormState = {
	firstName: '',
	lastName: '',
	phoneNumber: '',
	email: '',
	company: '',
};

export const initialAddressState = {
	street: '',
	city: '',
	zipCode: '',
	stateInitials: '',
};

export const initialAddressResponseState = {
	street: '',
	city: '',
	zip_code: '',
	state: '',
	state_initials: '',
};

const ContactContext = createContext({});

export const ContactProvider = ({ children }) => {
	const contact = {};

	const {
		createAddress,
		updateAddress,
		createContact,
		updateContact,
		deleteContact,
	} = mutations;

	const { fetchContacts, fetchCurrentContact } = queries;

	const useContactFetch = (id: number) => {
		fetchCurrentContact(id);
	};

	const useContactsFetch = () => {
		fetchContacts();
	};

	const useContactCreate = (id: number) => {
		const contact = createContact(id);
	};
	const useCurrentContact = (id: number) => {
		const currentContact = getCurrentContact(id);
	};

	const useContactUpdate = (id: number, updatedContact) => {
		updateContact(id, updatedContact);
	};

	const useContactDestroy = (id: number) => {
		deleteContact(id);
	};

	const useAddressCreate = (contactId: number) => {
		createAddress(contactId);
	};

	const useAddressUpdate = (contactId: number, updateAddress) => {
		updateAddress(contactId);
	};

	return (
		<ContactContext.Provider
			value={{
				useAddressCreate,
				useAddressUpdate,
				useCurrentContact,
				useContactCreate,
				useContactDestroy,
				useContactUpdate,
				useContactFetch,
				useContactsFetch,
			}}
		>
			{children}
		</ContactContext.Provider>
	);
};
