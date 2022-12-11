import { BASE_URL } from './client';

import axios from 'axios';

const createContact = async (values) => {
	const { data } = await axios.post(
		`${BASE_URL}/person`,
		{ ...values },
		{
			headers: {
				'Content-Type': 'application/json',
			},
		},
	);
	localStorage.setItem('current-contact', data.contact.id);
	return data.contact;
};

const updateContact = async (update, id) => {
	try {
		await axios.put(
			`${BASE_URL}/person/${id}`,
			{
				...update,
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
	await axios.delete(`${BASE_URL}/person/${id}`);
};

const fetchContacts = async () => {
	const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/persons`);
	return data;
};
const searchContacts = async (searchString: string) => {
	const { data } = await axios.post(
		`${process.env.REACT_APP_BASE_URL}/search`,
		{
			data: searchString,
		},
		{
			headers: {
				'Content-Type': 'application/json',
			},
		},
	);
	return data.matches;
};

const fetchCurrentContact = async (id: string) => {
	localStorage.setItem('current-contact', id);
	const { data } = await axios.get(
		`${process.env.REACT_APP_BASE_URL}/persons/${id}`,
	);
	console.log(data);
	return data.contact;
};

const contactApi = {
	fetchCurrentContact,
	fetchContacts,
	searchContacts,
	createContact,
	updateContact,
	deleteContact,
};

export default contactApi;
