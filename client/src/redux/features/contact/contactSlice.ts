import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../../redux/store';

import contactApi from '../../../api/contactApi';

// Define a type for the slice state
import {
	ContactWithAddress,
	ContactsWithAddresses,
	ContactType,
	ContactFormType,
} from '~../types/Contact';
interface UpdatedContactType {
	updatedContact: ContactType;
	id: string;
}

interface ContactState {
	currentContact: ContactWithAddress;
	contacts: ContactsWithAddresses;
	searchResults: ContactsWithAddresses;
}

export const initialContactState = {
	first_name: '',
	last_name: '',
	phone_number: '',
	email: '',
	company: '',
	street: '',
	city: '',
	zip_code: '',
	state_initials: '',
	state: '',
	person_id: '',
	id: '',
};

// Define the initial state using that type
const initialState: ContactState = {
	currentContact: initialContactState,
	contacts: [],
	searchResults: [],
};

export const createContact = createAsyncThunk(
	'contacts/createContact',
	async (values: ContactFormType, thunkAPI) => {
		try {
			const contact = await contactApi.createContact(values);
			return contact;
		} catch (error) {
			console.error(error);
		}
	},
);
export const fetchCurrentContact = createAsyncThunk(
	'contacts/fetchCurrentContact',
	async (userId: string, thunkAPI) => {
		try {
			const contact = await contactApi.fetchCurrentContact(userId);
			return contact;
		} catch (error) {
			console.error(error);
		}
	},
);

export const fetchContacts = createAsyncThunk(
	'contacts/fetchContacts',
	async (thunkAPI) => {
		try {
			const data = await contactApi.fetchContacts();
			return data.contacts;
		} catch (error) {
			console.error(error);
		}
	},
);
export const searchContacts = createAsyncThunk(
	'contacts/searchContacts',
	async (value: string, thunkAPI) => {
		try {
			const data = await contactApi.searchContacts(value);
			return data.contacts;
		} catch (error) {
			console.error(error);
		}
	},
);

export const updateContact = createAsyncThunk(
	'contacts/updateContact',
	async (data: UpdatedContactType, thunkAPI) => {
		const { updatedContact, id } = data;
		try {
			await contactApi.updateContact(updatedContact, id);
			const contact = await contactApi.fetchCurrentContact(id);
			return contact;
		} catch (error) {
			console.error(error);
		}
	},
);
export const deleteContact = createAsyncThunk(
	'contacts/deleteContact',
	async (id: string, thunkAPI) => {
		try {
			await contactApi.deleteContact(id);
		} catch (error) {
			console.error(error);
		}
	},
);

export const contactSlice = createSlice({
	name: 'contact',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		clearSearchResults: (state) => {
			return {
				...state,
				searchResults: [],
			};
		},
	},
	// Use the PayloadAction type to declare the contents of `action.payload`
	extraReducers: (builder) => {
		builder.addCase(createContact.fulfilled, (state, { payload }) => {
			return {
				...state,
				currentContact: payload,
			};
		});
		builder.addCase(fetchCurrentContact.fulfilled, (state, { payload }) => {
			return {
				...state,
				currentContact: payload,
			};
		});
		builder.addCase(fetchContacts.fulfilled, (state, { payload }) => {
			return {
				...state,
				contacts: payload,
			};
		});
		builder.addCase(updateContact.fulfilled, (state, { payload }) => {
			return {
				...state,
				currentContact: payload,
			};
		});
		builder.addCase(searchContacts.fulfilled, (state, { payload }) => {
			return {
				...state,
				searchResults: payload,
			};
		});
	},
});

// Other code such as selectors can use the imported `RootState` type
export const selectCurrentContactId = (state: RootState) =>
	state.contact.currentContact?.id;

export const { clearSearchResults } = contactSlice.actions;

export default contactSlice.reducer;
