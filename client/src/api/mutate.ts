import { abbrState } from '../utils';

import axios from 'axios';

declare var process: {
	env: {
		REACT_APP_BASE_URL: string;
	};
};

const BASE_URL = process.env.REACT_APP_BASE_URL;

const createContact = async (values) => {
	try {
		const { data } = await axios.post(
			`${BASE_URL}/person`,
			{ ...values },
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
		return data;
	} catch (error) {
		console.error(error);
	}
};

const updateContact = async (updatedContact, id) => {
	try {
		await axios.put(
			`${BASE_URL}/person/${id}`,
			{
				...updatedContact,
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
	} catch (error) {
		console.error(error);
	}
};

const deleteContact = async (id) => {
	localStorage.removeItem('current-contact');
	try {
		await axios.delete(`${BASE_URL}/person/${id}`);
	} catch (err) {
		console.error(err);
	}
};

//// end of contact handlers

const createAddress = async (values) => {
	const newContactId = JSON.parse(localStorage.getItem('new-contact')!);
	const convertedStateInitialsToName = abbrState(values.stateInitials, 'name');
	try {
		const { data } = await axios.post(
			`${BASE_URL}/address/${newContactId}`,
			{
				...values,
				state: convertedStateInitialsToName,
				personId: newContactId,
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
		localStorage.removeItem('new-contact');
		return data.address;
	} catch (error) {
		console.error(error);
	}
};

const updateAddress = async (id: number, updatedAddress) => {
	const convertedStateInitialsToName = abbrState(
		updatedAddress.stateInitials,
		'name',
	);

	try {
		await axios.put(
			`${BASE_URL}/address/${id}`,
			{
				...updatedAddress,
				state: convertedStateInitialsToName,
				personId: id,
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
	} catch (error) {
		console.error(error);
	}
};

export const mutations = {
	createAddress,
	updateAddress,
	createContact,
	updateContact,
	deleteContact,
};
