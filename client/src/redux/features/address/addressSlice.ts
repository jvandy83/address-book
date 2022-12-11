import { AddressResponseState } from './../../../../types/Address';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import addressApi from '../../../api/addressApi';

import { AddressFormState } from '~../types/address';

// Define the initial state using that type
const initialState: AddressResponseState = {
	street: '',
	city: '',
	zip_code: '',
	state_initials: '',
	state: '',
	person_id: '',
	id: '',
};

export const createAddress = createAsyncThunk(
	'address/createAddress',
	async (values: AddressFormState, thunkAPI) => {
		const { id } = values;
		let updates = {};
		for (const value in values) {
			if (value !== id) {
				updates[value] = values[value];
			}
		}
		try {
			await addressApi.createAddress(updates, id);
		} catch (error) {
			console.error(error);
		}
	},
);

export const fetchAddress = createAsyncThunk(
	'address/fetchAddress',
	async (userId: string, thunkAPI) => {
		try {
			const address = await addressApi.fetchAddress(userId);
			return address;
		} catch (error) {
			console.error(error);
		}
	},
);

export const updateAddress = createAsyncThunk(
	'address/updateAddress',
	async (data: AddressFormState, { dispatch }) => {
		const { personId } = data;
		let updates = {};
		for (const value in data) {
			if (value !== 'personId') {
				updates[value] = data[value];
			}
		}
		try {
			const exisitngAddress = await addressApi.fetchAddress(personId);
			if (exisitngAddress) {
				await addressApi.updateAddress(updates, personId);
			} else {
				await addressApi.createAddress(updates, personId);
			}
		} catch (error) {
			console.error(error);
		}
	},
);

export const addressSlice = createSlice({
	name: 'address',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {},
	// Use the PayloadAction type to declare the contents of `action.payload`
	extraReducers: (builder) => {
		builder.addCase(fetchAddress.fulfilled, (state, { payload }) => {
			return {
				...payload,
			};
		});
	},
});

// export const {} = addressSlice.actions;

export default addressSlice.reducer;
